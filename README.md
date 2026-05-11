
# Betterboxd — Find Movies by Feel

**Describe a mood, a scene, an emotion — and we'll find the movie that matches.** Betterboxd uses semantic embeddings and similarity search to recommend films based on vibe rather than traditional filters.

## 🚀 Live Demo

**[betterboxd-1.onrender.com](https://betterboxd-1.onrender.com/)**

## 📚 How It Works

The project uses pre-trained embeddings to understand the semantic meaning of movie vibes. Behind the scenes:

1. Movie overviews are embedded into a high-dimensional vector space
2. Your vibe description is embedded using the same model
3. We find the 5 movies closest to your vibe in that space
4. Results are ranked by cosine similarity score and movie rating

Read the full embedding training process: **[Kaggle Notebook](https://www.kaggle.com/code/siddhichavan/movie-recommendation-by-vibe)**

## 🛠 Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: FastAPI (Python)
- **ML/Embeddings**: Sentence Transformers
- **Data**: 4,800+ movies from TMDB
- **Deployment**: Docker, Render

## 💻 Run Locally

### Prerequisites
- Python 3.8+
- Docker (optional)

### Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/36sid/betterboxd.git
   cd movie-vibe-search
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the server**
   ```bash
   uvicorn main:app --reload
   ```

   The app will be available at `http://localhost:8000`

### Run with Docker

```bash
docker build -t betterboxd .
docker run -p 10000:10000 betterboxd
```

Then open `http://localhost:10000` in your browser.
