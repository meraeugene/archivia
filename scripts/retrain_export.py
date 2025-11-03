# ===============================================================
# ADVISER RECOMMENDER SYSTEM  (TF-IDF + Experience)
# Prepares PKL model for FastAPI recommender
# Author: Prince Roniver A. Magsalos & Andrew R. Villalon
# ===============================================================

import pandas as pd
import numpy as np
from supabase import create_client, Client
from sklearn.feature_extraction.text import TfidfVectorizer
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
            experience_points[panel_name] = experience_points.get(panel_name, 0) + 0.4

df["experience_score"] = df["adviser_name"].map(experience_points).fillna(0)
if df["experience_score"].max() > 0:
    df["experience_score"] /= df["experience_score"].max()

# -----------------------------
# Text embeddings: TF-IDF
# -----------------------------
vectorizer = TfidfVectorizer(stop_words="english")
tfidf_matrix = vectorizer.fit_transform(df["combined_text"])

# -----------------------------
# Export model
# -----------------------------
def main(output_file):
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    model_dict = {
        "vectorizer": vectorizer,
        "tfidf_matrix": tfidf_matrix,
        "df": df,
        "experience_points": experience_points,
    }
    joblib.dump(model_dict, output_file)
    print(f"Adviser model exported as '{output_file}'.")

if __name__ == "__main__":
    out_file = sys.argv[1] if len(sys.argv) > 1 else "scripts/adviser_recommender.pkl"
    main(out_file)
