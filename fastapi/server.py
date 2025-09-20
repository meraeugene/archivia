# server.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # your Next.js frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load your trained TF-IDF and model
vectorizer = joblib.load("vectorizer.pkl")
lr_model = joblib.load("lr_model.pkl")
clf_df = pd.read_pickle("clf_df.pkl")  # store DataFrame with advisers

class Project(BaseModel):
    title: str
    abstract: str

@app.post("/recommend")
def recommend(project: Project):
    user_text = project.title + " " + project.abstract
    user_vec = vectorizer.transform([user_text])

    similarities = cosine_similarity(
        user_vec, vectorizer.transform(clf_df["COMBINED_TEXT"])
    ).flatten()

    # Get **top 3 closest projects**
    top_idx = similarities.argsort()[-3:][::-1]

    results = []
    for i in top_idx:
        adviser = clf_df.iloc[i]["ADVISER"]
        project_title = clf_df.iloc[i]["TITLE"]
        score = float(similarities[i])

        results.append({
            "adviser": adviser,
            "projects": [{
                "title": project_title,
                "similarity": score
            }]
        })

    return {"recommendations": results}
