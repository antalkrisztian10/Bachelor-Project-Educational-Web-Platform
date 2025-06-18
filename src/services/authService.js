// src/services/authService.js
import axios from '@/api/axios' // Ensure you have an axios instance in your project

const authService = {
  // Register a new user
  async registerUser(userData) {
    return axios.post('/register', userData) // Send POST request to the backend
  },

  // Login an existing user
  async loginUser(credentials) {
    return axios.post('/login', credentials) // Send POST request to the backend
  }
}

export default authService
