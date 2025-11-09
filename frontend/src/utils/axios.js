import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:5001',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Add request interceptor for auth token and CORS
instance.interceptors.request.use(
    function (config) {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            console.log('No token found in localStorage');
        }
        return config;
    },
    function (error) {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
instance.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            console.log('Unauthorized request - clearing token');
            localStorage.removeItem('token');
        }
        return Promise.reject(error);
    }
);

export default instance;