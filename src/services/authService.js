import api from './api';

const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post('/Authentication/login', {
        email: credentials.email,
        password: credentials.password,
      });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', user.id);
      return { data: { user, token } };
    } catch (error) {
      throw new Error(error.response?.data || 'Invalid credentials');
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/users', userData);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', user.id);
      return { data: { user, token } };
    } catch (error) {
      throw new Error(error.response?.data || 'Registration failed');
    }
  },

  getCurrentUser: async () => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      return api.get(`/users/${userId}`);
    }
    return Promise.reject('No user logged in');
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    return Promise.resolve();
  },
};

export default authService;