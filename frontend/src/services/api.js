import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add authentication token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Location APIs
export const getLocations = () => api.get('/locations');
export const getLocation = (id) => api.get(`/locations/${id}`);

// Seat APIs
export const getAvailableSeats = (locationId, date, floor) => 
    api.get(`/seats/available/${locationId}`, { params: { date, floor } });

// Booking APIs
export const createBooking = (bookingData) => api.post('/bookings', bookingData);
export const getUserBookings = (userId) => api.get(`/bookings/user/${userId}`);
export const cancelBooking = (bookingId) => api.post(`/bookings/${bookingId}/cancel`);