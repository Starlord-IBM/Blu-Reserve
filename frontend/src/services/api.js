import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth service
export const authService = {
    login: async (email, password) => {
        try {
            const formData = new URLSearchParams();
            formData.append('username', email);
            formData.append('password', password);

            const response = await api.post('/auth/login', formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            if (response.data.access_token) {
                localStorage.setItem('token', response.data.access_token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }

            return response.data;
        } catch (error) {
            throw error.response?.data?.detail || 'Failed to login';
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    register: async (username, email, password) => {
        try {
            const response = await api.post('/auth/register', {
                username,
                email,
                password
            });
            return response.data;
        } catch (error) {
            throw error.response?.data?.detail || 'Failed to register';
        }
    },

    getCurrentUser: async () => {
        try {
            const response = await api.get('/auth/me');
            return response.data;
        } catch (error) {
            throw error.response?.data?.detail || 'Failed to get user data';
        }
    }
};

// Seat service
export const seatService = {
    getAvailableSeats: async (bookingDate, durationMinutes) => {
        try {
            const response = await api.get('/seats/available', {
                params: {
                    booking_date: bookingDate.toISOString(),
                    duration_minutes: durationMinutes
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data?.detail || 'Failed to fetch available seats';
        }
    }
};

// Booking service
export const bookingService = {
    createBooking: async (bookingData) => {
        try {
            console.log('Sending booking data:', bookingData);
            const response = await api.post('/bookings/', {
                seat_ids: bookingData.seat_ids,
                booking_date: bookingData.booking_date,
                duration_minutes: parseInt(bookingData.duration_minutes),
                total_cost: parseFloat(bookingData.total_cost)
            });
            console.log('Booking response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Booking error:', error.response?.data || error);
            throw new Error(error.response?.data?.detail || 'Failed to create booking');
        }
    },

    getMyBookings: async () => {
        try {
            const response = await api.get('/bookings/my-bookings');
            return response.data;
        } catch (error) {
            throw error.response?.data?.detail || 'Failed to fetch bookings';
        }
    },

    cancelBooking: async (bookingId) => {
        try {
            const response = await api.post(`/bookings/${bookingId}/cancel`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.detail || 'Failed to cancel booking';
        }
    }
};

export default api;