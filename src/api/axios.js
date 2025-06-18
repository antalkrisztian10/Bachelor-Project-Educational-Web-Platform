import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000' // Your backend server's URL
})

export default axiosInstance
