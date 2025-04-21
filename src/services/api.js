import axios from 'axios';

const API_URL = 'http://localhost:5086/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const movieService = {
  getAll: () => api.get('/Film'),
  getById: (id) => api.get(`/Film/${id}`),
  getNowPlaying: () => api.get('/Film?releaseDate_lte=2025-04-17'),
  getUpcoming: () => api.get('/Film?releaseDate_gt=2025-04-17'),
};

export const cinemaService = {
  getAll: () => api.get('/cinemas'),
  getById: (id) => api.get(`/cinemas/${id}`),
};

export const showTimeService = {
  getAll: () => api.get('/showTimes'),
  getById: (id) => api.get(`/showTimes/${id}`),
  getByMovieId: (movieId) => api.get(`/showTimes?movieId=${movieId}`),
  getByCinemaId: (cinemaId) => api.get(`/showTimes?cinemaId=${cinemaId}`),
  getByMovieAndCinema: (movieId, cinemaId) => 
    api.get(`/showTimes?movieId=${movieId}&cinemaId=${cinemaId}`),
  getByDate: (date) => api.get(`/showTimes?date=${date}`),
};

export const seatService = {
  getByShowTimeId: (showTimeId) => api.get(`/seats?showTimeId=${showTimeId}`),
  updateSeat: (seatId, seatData) => api.patch(`/seats/${seatId}`, seatData),
};

export const bookingService = {
  getAll: () => api.get('/bookings'),
  getById: (id) => api.get(`/bookings/${id}`),
  getByUserId: (userId) => api.get(`/bookings?userId=${userId}`),
  create: (bookingData) => api.post('/bookings', bookingData),
  update: (id, bookingData) => api.put(`/bookings/${id}`, bookingData),
  delete: (id) => api.delete(`/bookings/${id}`),
};

export const authService = {
  login: (credentials) => api.post('/login', credentials),
  register: (userData) => api.post('/users', userData),
  getCurrentUser: () => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      return api.get(`/users/${userId}`);
    }
    return Promise.reject('No user logged in');
  },
};

export default api;