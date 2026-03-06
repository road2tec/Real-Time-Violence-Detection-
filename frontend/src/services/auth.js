import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
    }
    return response.data;
};

export const register = async (email, password) => {
    const response = await axios.post(`${API_URL}/register`, { email, password });
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('token');
};

export const getToken = () => localStorage.getItem('token');
