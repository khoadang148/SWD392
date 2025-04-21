// src/services/cinemaService.js
import api from './api';

const cinemaService = {
  getAll: () => api.get('/cinemas'),
  getById: (id) => api.get(`/cinemas/${id}`),
  getByCity: (city) => api.get(`/cinemas?city=${city}`)
};

export default cinemaService;