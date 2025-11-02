# ===============================================================
# HYBRID ADVISER RECOMMENDER SYSTEM v3.2 (Balanced Edition)
# TF-IDF + SBERT + Research Interest + Logistic Regression + Experience
# Author: Prince Roniver A. Magsalos
# ===============================================================

import pandas as pd
import numpy as np
from supabase import create_client, Client
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sentence_transformers import SentenceTransformer
from scipy.sparse import hstack
import joblib
import re
import os
import sys
from dotenv import load_dotenv

# -----------------------------
# Load env variables
# -----------------------------
load_dotenv()
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
print("Connected to Supabase.")

# -----------------------------
# Fetch data
# -----------------------------
response = supabase.table("ml_thesis_view").select("*").execute()
df_all = pd.DataFrame(response.data)

# Only active advisers
df = df_all[df_all["status"] == "active"].copy()

# Balance dataset
max_per_adviser = 8
min_per_adviser = 3
valid_advisers = df["adviser_name"].value_counts()
valid_advisers = valid_advisers[valid_advisers >= min_per_adviser].index
df = df[df["adviser_name"].isin(valid_advisers)]
df = df.groupby("adviser_name", group_keys=False).apply(
    lambda x: x.sample(n=min(len(x), max_per_adviser), random_state=42)
).reset_index(drop=True)

# -----------------------------
# Clean & combine text
# -----------------------------
def clean_text(text):
    if not text:
        return ""
    if isinstance(text, list):
        text = " ".join(map(str, text))
    text = str(text)
    text = re.sub(r"[^a-zA-Z0-9\s]", " ", text)
    return text.lower().strip()

df["combined_text"] = (
    df["title"].fillna("").apply(clean_text) + " " +
    df["abstract"].fillna("").apply(clean_text) + " " +
    df["keywords"].fillna("").apply(clean_text) + " " +
    df["research_interest"].fillna("").apply(clean_text) + " " +
    df["category"].fillna("").apply(clean_text)
)

# -----------------------------
# Compute experience
# -----------------------------
experience_points = {}
for _, row in df_all.iterrows():
    adv = row["adviser_name"]
    if adv:
        experience_points[adv] = experience_points.get(adv, 0) + 1.0
    for p in ["panel_member1", "panel_member2", "panel_member3"]:
        panel_name = row.get(p)
        if panel_name and pd.notna(panel_name):
            experience_points[panel_name] = experience_points.get(panel_name, 0) + 0.3

df["experience_score"] = df["adviser_name"].map(experience_points).fillna(0)
if df["experience_score"].max() > 0:
    df["experience_score"] /= df["experience_score"].max()

# -----------------------------
# Text embeddings
# -----------------------------
vectorizer = TfidfVectorizer(stop_words="english")
tfidf_matrix = vectorizer.fit_transform(df["combined_text"])

sbert_model = SentenceTransformer("all-MiniLM-L6-v2")
sbert_embeddings = sbert_model.encode(df["combined_text"].tolist(), show_progress_bar=True)

# -----------------------------
# Train Logistic Regression
# -----------------------------
X_combined = hstack([tfidf_matrix, np.array(df["experience_score"]).reshape(-1, 1)])
y = df["adviser_name"]
log_reg = LogisticRegression(max_iter=2000, class_weight="balanced")
log_reg.fit(X_combined, y)

# -----------------------------
# Export model
# -----------------------------
def main(output_file):
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    model_dict = {
        "vectorizer": vectorizer,
        "log_reg": log_reg,
        "df": df,
        "adviser_embeddings": sbert_embeddings,
        "experience_points": experience_points,
    }
    joblib.dump(model_dict, output_file)
    print(f"Adviser model exported as '{output_file}'.")

if __name__ == "__main__":
    out_file = sys.argv[1] if len(sys.argv) > 1 else "scripts/adviser_prediction_model.pkl"
    main(out_file)
