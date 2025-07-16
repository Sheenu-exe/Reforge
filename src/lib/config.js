// Create a config file (e.g., config.js)
const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://reforge-backend.onrender.com/'  // Replace with your deployed API URL
  : 'http://localhost:5000';

export default API_URL;