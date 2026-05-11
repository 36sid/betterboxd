from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MinMaxScaler
import pandas as pd
import numpy as np

app = FastAPI()

# Load everything on startup
print("Loading model and data...")
model = SentenceTransformer('all-MiniLM-L6-v2')
embeddings = np.load('model/embeddings.npy')
df = pd.read_csv('model/movies_clean.csv')
print("Ready!")

class Query(BaseModel):
    vibe: str
    top_k: int = 5

@app.post("/search")
def search(query: Query):
    query_embedding = model.encode([query.vibe])
    similarities = cosine_similarity(query_embedding, embeddings)[0]

    valid_mask = similarities >= 0.25
    final_scores = 0.85 * similarities + 0.15 * df['boost'].values
    final_scores[~valid_mask] = 0

    top_indices = final_scores.argsort()[::-1][:query.top_k]

    results = []
    for idx in top_indices:
        movie = df.iloc[idx]
        results.append({
            "title": movie['title'],
            "year": str(movie['release_date'])[:4],
            "overview": movie['overview'],
            "genres": movie['genre_names'],
            "rating": round(float(movie['vote_average']), 1),
            "score": round(float(final_scores[idx]) * 100, 1)
        })

    return {"results": results}

@app.get("/health")
def health():
    return {"status": "ok"}

app.mount("/", StaticFiles(directory="static", html=True), name="static")