import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// frontend/src/services/api.js

export const getLocations = async () => {
    try {
        const response = await api.get('/locations');
        return { data: response.data || [] };
    } catch (error) {
        console.error('Error fetching locations:', error);
        throw error.response?.data || error;
    }
};

export const getTimeSlots = async (locationId, date) => {
    try {
        const response = await api.get(`/timeslots/${locationId}`, {
            params: { date }
        });
        return { data: response.data || [] };
    } catch (error) {
        console.error('Error fetching time slots:', error);
        throw error.response?.data || error;
    }
};

// Bookings
export const createBooking = async (bookingData) => {
    try {
        const response = await api.post('/bookings', bookingData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};