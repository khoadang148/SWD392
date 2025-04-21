// src/services/movieService.js
import api from './api';

const movieService = {
  getAll: () => api.get('/movies'),
  getById: (id) => api.get(`/movies/${id}`),
  getNowPlaying: () => api.get('/movies?releaseDate_lte=2025-04-17'),
  getUpcoming: () => api.get('/movies?releaseDate_gt=2025-04-17'),
  searchMovies: (query) => api.get(`/movies?q=${query}`),
  getByGenre: (genre) => api.get(`/movies?genre_like=${genre}`)
};

export default movieService;