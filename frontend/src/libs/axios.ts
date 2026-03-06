import axios from 'axios';

// Create an axios instance

export const axiosInstance = axios.create({
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json',
  },
});
