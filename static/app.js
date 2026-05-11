const input = document.getElementById('vibeInput');
const btn = document.getElementById('searchBtn');
const resultsEl = document.getElementById('results');
const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('error');
const emptyEl = document.getElementById('empty');
const divider = document.getElementById('divider');
const suggestionsEl = document.querySelector('.suggestions');

// Event listeners
input.addEventListener('keydown', handleInputKeydown);
suggestionsEl.addEventListener('click', handleSuggestionClick);
btn.addEventListener('click', search);

function handleInputKeydown(e) {
  if (e.key === 'Enter') search();
}

function handleSuggestionClick(e) {
  if (e.target.classList.contains('suggestion')) {
    fillAndSearch(e.target.textContent);
  }
}

function fillAndSearch(text) {
  input.value = text;
  search();
}

function setLoading(on) {
  loadingEl.classList.toggle('active', on);
  btn.disabled = on;
  btn.textContent = on ? '...' : 'Search';
}

function hideAll() {
  errorEl.classList.remove('active');
  emptyEl.classList.remove('active');
  resultsEl.innerHTML = '';
}

async function search() {
  const vibe = input.value.trim();
  if (!vibe) return;

  hideAll();
  setLoading(true);
  divider.classList.add('visible');

  try {
    const res = await fetch('/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vibe, top_k: 5 })
    });

    if (!res.ok) throw new Error('Server error');

    const data = await res.json();
    setLoading(false);

    if (!data.results || data.results.length === 0) {
      emptyEl.classList.add('active');
      return;
    }

    renderResults(data.results);
  } catch (err) {
    setLoading(false);
    errorEl.classList.add('active');
  }
}

function renderResults(movies) {
  resultsEl.innerHTML = movies.map((m, i) => {
    const genres = m.genres
      ? m.genres.split(' ').filter(Boolean).slice(0, 3).map(g => `<span class="tag">${g}</span>`).join('')
      : '';

    const stars = '★'.repeat(Math.round(m.rating / 2)) + '☆'.repeat(5 - Math.round(m.rating / 2));

    return `
      <div class="movie-card">
        <div>
          <div class="movie-meta">
            <span class="rank">#${i + 1}</span>
            <span class="movie-title">${m.title}</span>
            <span class="movie-year">${m.year}</span>
          </div>
          <p class="movie-overview">${m.overview}</p>
          <div class="movie-tags">${genres}</div>
        </div>
        <div class="movie-score-wrap">
          <p class="match-label">Match</p>
          <p class="match-score">${m.score}<span>%</span></p>
          <div class="rating-row">
            <span class="star">${stars}</span>
            <span class="rating-val">${m.rating}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}
