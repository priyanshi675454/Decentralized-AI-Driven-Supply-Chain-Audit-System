import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
})

// Auto attach token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token')
  if (token) req.headers.Authorization = `Bearer ${token}`
  return req
})

// Auth
export const registerUser = (data) => API.post('/auth/register', data)
export const loginUser = (data) => API.post('/auth/login', data)
export const getProfile = () => API.get('/auth/profile')

// Products
export const createProduct = (data) => API.post('/products', data)
export const getProducts = () => API.get('/products')
export const getProductById = (productId) => API.get(`/products/${productId}`)

// Shipments
export const addShipment = (data) => API.post('/shipments', data)
export const getShipments = (productId) => API.get(`/shipments/${productId}`)

export default API