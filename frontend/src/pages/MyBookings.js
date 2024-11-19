import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    CircularProgress,
    Alert,
    Paper,
    Grid,
    Chip,
    Divider,
    Card,
    CardContent,
} from '@mui/material';
import { bookingService } from '../services/api';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PaymentIcon from '@mui/icons-material/Payment';
import DateRangeIcon from '@mui/icons-material/DateRange';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString('en-IN', {
                timeZone: 'Asia/Kolkata',
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            }),
            time: date.toLocaleTimeString('en-IN', {
                timeZone: 'Asia/Kolkata',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            }),
            ist: date.toLocaleString('en-IN', {
                timeZone: 'Asia/Kolkata',
                dateStyle: 'medium',
                timeStyle: 'short'
            })
        };
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await bookingService.getMyBookings();
            setBookings(data);
        } catch (err) {
            console.error('Error fetching bookings:', err);
            setError('Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'active':
                return 'success';
            case 'completed':
                return 'default';
            case 'cancelled':
                return 'error';
            default:
                return 'default';
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg">
            <Box my={4}>
                <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
                    My Bookings
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {bookings.length === 0 ? (
                    <Paper sx={{ p: 4, textAlign: 'center' }}>
                        <Typography color="text.secondary">
                            No bookings found
                        </Typography>
                    </Paper>
                ) : (
                    <Grid container spacing={3}>
                        {bookings.map((booking) => {
                            const startTime = formatDateTime(booking.booking_date);
                            const endTime = formatDateTime(booking.booking_end);
                            
                            return (
                                <Grid item xs={12} key={booking.id}>
                                    <Card elevation={3}>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                <Typography variant="h6">
                                                    Booking #{booking.id.slice(-6)}
                                                </Typography>
                                                <Chip 
                                                    label={booking.status}
                                                    color={getStatusColor(booking.status)}
                                                    size="small"
                                                />
                                            </Box>

                                            <Divider sx={{ my: 2 }} />

                                            <Grid container spacing={2}>
                                                <Grid item xs={12} sm={6}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                        <DateRangeIcon sx={{ mr: 1, color: 'primary.main' }} />
                                                        <Typography>
                                                            {startTime.date}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                        <AccessTimeIcon sx={{ mr: 1, color: 'primary.main' }} />
                                                        <Typography>
                                                            {startTime.time} - {endTime.time} IST
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                        <EventSeatIcon sx={{ mr: 1, color: 'primary.main' }} />
                                                        <Typography>
                                                            Seats: {booking.seat_ids.join(', ')}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                        <PaymentIcon sx={{ mr: 1, color: 'primary.main' }} />
                                                        <Typography>
                                                            {booking.total_cost} Blu Dollars
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                            </Grid>

                                            <Box sx={{ mt: 2 }}>
                                                <Typography variant="caption" color="text.secondary">
                                                    Duration: {booking.duration_minutes} minutes
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
                )}
            </Box>
        </Container>
    );
};

export default MyBookings;