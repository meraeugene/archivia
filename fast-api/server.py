from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from supabase import create_client
from dotenv import load_dotenv
import os

# Load .env variables
load_dotenv()

# ---------------- Supabase setup ----------------
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# ---------------- Supabase connection test ----------------
try:
    test = supabase.table("users").select("id, user_id").limit(1).execute()
    if test.data:
        print("✅ Supabase connected successfully. Sample user:", test.data[0])
    else:
        print("⚠️ Supabase connected but no users found.")
except Exception as e:
    print("❌ Supabase connection failed:", e)


# ---------------- FastAPI setup ----------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- Load trained models ----------------
vectorizer = joblib.load("vectorizer.pkl")
lr_model = joblib.load("lr_model.pkl")
clf_df = pd.read_pickle("clf_df.pkl")  # Contains columns: TITLE, ABSTRACT, ADVISER, COMBINED_TEXT

# ---------------- Pydantic model ----------------
class Project(BaseModel):
    title: str
    abstract: str

# ---------------- Helper: map adviser names to Supabase IDs ----------------
def map_adviser_names_to_ids(adviser_names: list[str]) -> dict[str, str]:
    mapping = {}
    for name in adviser_names:
  
        response = supabase.table("user_profiles").select("user_id").eq("full_name", name).execute()
        if response.data:
            mapping[name] = response.data[0]["user_id"]
        else:
            mapping[name] = None
    return mapping

# ---------------- Helper: get adviser capacity ----------------
def get_adviser_capacity(adviser_id: str) -> tuple[str, str]:
    response = supabase.table("adviser_capacity") \
        .select("current_leaders, max_leaders") \
        .eq("adviser_id", adviser_id) \
        .execute()

    if response.data:
        cap = response.data[0]
        capacity_str = f"{cap['current_leaders']}/{cap['max_leaders']}"
        availability = "Unavailable" if cap['current_leaders'] >= cap['max_leaders'] else "Available"
        return capacity_str, availability

    return "0/0", "Available"  # fallback if no record exists


# ---------------- Recommendation endpoint ----------------
@app.post("/recommend")
def recommend(project: Project):
    if not project.title.strip() or not project.abstract.strip():
        raise HTTPException(status_code=400, detail="Title and abstract are required.")


    user_text = f"{project.title} {project.abstract}"
    user_vec = vectorizer.transform([user_text])

    similarities = cosine_similarity(user_vec, vectorizer.transform(clf_df["COMBINED_TEXT"])).flatten()
    clf_df["similarity"] = similarities

    # Rank advisers by highest similarity project
    adviser_scores = clf_df.groupby("ADVISER")["similarity"].max().sort_values(ascending=False)

    adviser_names = adviser_scores.head(5).index.tolist()
    print("🔹 Top adviser names:", adviser_names)

    name_to_id = map_adviser_names_to_ids(adviser_names)
    print("🔹 Adviser name -> UUID mapping:", name_to_id)

    results = []
    for adviser_name, score in adviser_scores.head(5).items():
        adviser_id = name_to_id.get(adviser_name)

        print("🔹 Processing adviser:", adviser_name, "with ID:", adviser_id)
        
        if adviser_id is None:
            print(f"⚠️ Adviser not found in DB: {adviser_name}")
            continue  # Skip advisers not in DB
        
        capacity, availability = get_adviser_capacity(adviser_id)

         # Fetch the full name from Supabase
        supabase_user = supabase.table("user_profiles").select(  "prefix, full_name, suffix, profile_picture, email, position, research_interest, bio").eq("user_id", adviser_id).execute()

        if not supabase_user.data:
            print(f"⚠️ Full name not found in Supabase for user_id: {adviser_id}")
            full_name = adviser_name  # fallback
        else:
            user = supabase_user.data[0]
            prefix = user.get("prefix") or ""
            name = user.get("full_name") or adviser_name
            suffix = user.get("suffix") or ""

            # Construct full name with optional prefix/suffix
            full_name_with_title = f"{prefix + ' ' if prefix else ''}{name}{', ' + suffix if suffix else ''}"
            print("🔹 Full name with title from Supabase:", full_name_with_title)

        adviser_projects = (
            clf_df[clf_df["ADVISER"] == adviser_name]
            .sort_values(by="similarity", ascending=False)[["TITLE", "ABSTRACT", "similarity"]]
            .to_dict(orient="records")
        )

        projects = [
            {
                "title": p["TITLE"],
                "abstract": p["ABSTRACT"],
                "similarity": float(p["similarity"])
            }
            for p in adviser_projects
        ]

        results.append({
            "full_name": full_name_with_title,
            "id": name_to_id[adviser_name],
            "score": float(score),
            "availability": availability, 
            "capacity": capacity,
            "projects": projects,
            "profile_picture": user.get("profile_picture"),
            "email": user.get("email"),
            "position": user.get("position"),
            "research_interest": user.get("research_interest"),
            "bio": user.get("bio"),
        })



    if not results:
        raise HTTPException(status_code=404, detail="No advisers found in the database.")

    return {"recommendations": results}
