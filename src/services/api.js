import axios from 'axios';

const API_BASE = 'https://backend-kve8.onrender.com/api';

export const apiService = {
  // Subscriptions
  getSubscriptions: () => axios.get(`${API_BASE}/subscriptions/`),
  getCompanies: () => axios.get(`${API_BASE}/data/companies/`),
  getSubscriptionDetails: (id) => axios.get(`${API_BASE}/subscriptions/${id}`),
  createSubscription: (data) => axios.post(`${API_BASE}/subscriptions/create-subscription`, data),
  addProductToSubscription: (subscriptionId, productId) => 
    axios.put(`${API_BASE}/subscriptions/add-product/${subscriptionId}/${productId}`),

  // Products
  getProducts: () => axios.get(`${API_BASE}/products/`),
  getProductDetails: (id) => axios.get(`${API_BASE}/products/${id}`),
  createProduct: (data) => axios.post(`${API_BASE}/products/create-product`, data),
  addFundToProduct: (productId, data) => axios.post(`${API_BASE}/funds/add-fund/${productId}`, data),

  // Blogs
  getBlogs: () => axios.get(`${API_BASE}/blogs/`),
  getBlogDetails: (id) => axios.get(`${API_BASE}/blogs/${id}`),
  createBlog: (data) => axios.post(`${API_BASE}/blogs/create`, data),
  deleteBlog: (id) => axios.delete(`${API_BASE}/blogs/${id}`)
};