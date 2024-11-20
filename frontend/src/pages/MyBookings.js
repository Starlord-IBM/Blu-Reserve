// import React, { useState, useEffect } from 'react';
// import {
//     Container,
//     Typography,
//     Box,
//     CircularProgress,
//     Alert,
//     Paper,
//     Grid,
//     Chip,
//     Divider,
//     Card,
//     CardContent,
// } from '@mui/material';
// import { bookingService } from '../services/api';
// import EventSeatIcon from '@mui/icons-material/EventSeat';
// import AccessTimeIcon from '@mui/icons-material/AccessTime';
// import PaymentIcon from '@mui/icons-material/Payment';
// import DateRangeIcon from '@mui/icons-material/DateRange';

// const MyBookings = () => {
//     const [bookings, setBookings] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');

//     const formatDateTime = (dateString) => {
//         const date = new Date(dateString);
//         return {
//             date: date.toLocaleDateString('en-IN', {
//                 timeZone: 'Asia/Kolkata',
//                 day: '2-digit',
//                 month: 'short',
//                 year: 'numeric'
//             }),
//             time: date.toLocaleTimeString('en-IN', {
//                 timeZone: 'Asia/Kolkata',
//                 hour: '2-digit',
//                 minute: '2-digit',
//                 hour12: true
//             }),
//             ist: date.toLocaleString('en-IN', {
//                 timeZone: 'Asia/Kolkata',
//                 dateStyle: 'medium',
//                 timeStyle: 'short'
//             })
//         };
//     };

//     useEffect(() => {
//         fetchBookings();
//     }, []);

//     const fetchBookings = async () => {
//         try {
//             setLoading(true);
//             setError('');
//             const data = await bookingService.getMyBookings();
//             setBookings(data);
//         } catch (err) {
//             console.error('Error fetching bookings:', err);
//             setError('Failed to fetch bookings');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const getStatusColor = (status) => {
//         switch (status.toLowerCase()) {
//             case 'active':
//                 return 'success';
//             case 'completed':
//                 return 'default';
//             case 'cancelled':
//                 return 'error';
//             default:
//                 return 'default';
//         }
//     };

//     if (loading) {
//         return (
//             <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
//                 <CircularProgress />
//             </Box>
//         );
//     }

//     return (
//         <Container maxWidth="lg">
//             <Box my={4}>
//                 <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
//                     My Bookings
//                 </Typography>

//                 {error && (
//                     <Alert severity="error" sx={{ mb: 3 }}>
//                         {error}
//                     </Alert>
//                 )}

//                 {bookings.length === 0 ? (
//                     <Paper sx={{ p: 4, textAlign: 'center' }}>
//                         <Typography color="text.secondary">
//                             No bookings found
//                         </Typography>
//                     </Paper>
//                 ) : (
//                     <Grid container spacing={3}>
//                         {bookings.map((booking) => {
//                             const startTime = formatDateTime(booking.booking_date);
//                             const endTime = formatDateTime(booking.booking_end);
                            
//                             return (
//                                 <Grid item xs={12} key={booking.id}>
//                                     <Card elevation={3}>
//                                         <CardContent>
//                                             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//                                                 <Typography variant="h6">
//                                                     Booking #{booking.id.slice(-6)}
//                                                 </Typography>
//                                                 <Chip 
//                                                     label={booking.status}
//                                                     color={getStatusColor(booking.status)}
//                                                     size="small"
//                                                 />
//                                             </Box>

//                                             <Divider sx={{ my: 2 }} />

//                                             <Grid container spacing={2}>
//                                                 <Grid item xs={12} sm={6}>
//                                                     <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
//                                                         <DateRangeIcon sx={{ mr: 1, color: 'primary.main' }} />
//                                                         <Typography>
//                                                             {startTime.date}
//                                                         </Typography>
//                                                     </Box>
//                                                     <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
//                                                         <AccessTimeIcon sx={{ mr: 1, color: 'primary.main' }} />
//                                                         <Typography>
//                                                             {startTime.time} - {endTime.time} IST
//                                                         </Typography>
//                                                     </Box>
//                                                 </Grid>
//                                                 <Grid item xs={12} sm={6}>
//                                                     <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
//                                                         <EventSeatIcon sx={{ mr: 1, color: 'primary.main' }} />
//                                                         <Typography>
//                                                             Seats: {booking.seat_ids.join(', ')}
//                                                         </Typography>
//                                                     </Box>
//                                                     <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
//                                                         <PaymentIcon sx={{ mr: 1, color: 'primary.main' }} />
//                                                         <Typography>
//                                                             {booking.total_cost} Blu Dollars
//                                                         </Typography>
//                                                     </Box>
//                                                 </Grid>
//                                             </Grid>

//                                             <Box sx={{ mt: 2 }}>
//                                                 <Typography variant="caption" color="text.secondary">
//                                                     Duration: {booking.duration_minutes} minutes
//                                                 </Typography>
//                                             </Box>
//                                         </CardContent>
//                                     </Card>
//                                 </Grid>
//                             );
//                         })}
//                     </Grid>
//                 )}
//             </Box>
//         </Container>
//     );
// };

// export default MyBookings;

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { FaCalendar, FaClock, FaChair, FaCoins } from 'react-icons/fa';
import { bookingService } from '../services/api';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await bookingService.getMyBookings();
            setBookings(data);
        } catch (err) {
            console.error('Error fetching bookings:', err);
            setError('Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return format(date, 'hh:mm aa');
    };

    const formatSeatNumber = (seatId) => {
        // Extract the last part of the seat ID
        const seatNumber = seatId.split('_').pop();
        return seatNumber.match(/[ABC]\d+/) ? seatNumber : seatId;
    };

    const formatTimeRange = (startTime, duration) => {
        const start = new Date(startTime);
        const end = new Date(start.getTime() + duration * 60000);
        return `${formatTime(start)} - ${formatTime(end)} IST`;
    };

    if (loading) {
        return (
            <div style={styles.loading}>
                Loading...
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.error}>
                {error}
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>My Bookings</h1>
            
            {bookings.length === 0 ? (
                <div style={styles.noBookings}>
                    No bookings found
                </div>
            ) : (
                bookings.map((booking) => (
                    <div key={booking.id} style={styles.bookingCard}>
                        <div style={styles.bookingHeader}>
                            <h3>Booking #{booking.id.slice(-5)}</h3>
                            <span style={{
                                ...styles.status,
                                backgroundColor: booking.status === 'active' ? '#27ae60' : '#95a5a6'
                            }}>
                                {booking.status}
                            </span>
                        </div>

                        <div style={styles.bookingDetails}>
                            <div style={styles.detailItem}>
                                <FaCalendar style={styles.icon} />
                                <span>{format(new Date(booking.booking_date), 'dd MMM yyyy')}</span>
                            </div>

                            <div style={styles.detailItem}>
                                <FaClock style={styles.icon} />
                                <span>{formatTimeRange(booking.booking_date, booking.duration_minutes)}</span>
                            </div>

                            <div style={styles.detailItem}>
                                <FaChair style={styles.icon} />
                                <span>Seats: {booking.seat_ids.map(formatSeatNumber).join(', ')}</span>
                            </div>

                            <div style={styles.detailItem}>
                                <FaCoins style={styles.icon} />
                                <span>{booking.total_cost} Blu Dollars</span>
                            </div>
                        </div>

                        <div style={styles.duration}>
                            Duration: {booking.duration_minutes} minutes
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

const styles = {
    container: {
        padding: '2rem',
        maxWidth: '1000px',
        margin: '0 auto',
    },
    title: {
        color: '#2c3e50',
        marginBottom: '2rem',
        textAlign: 'center',
    },
    bookingCard: {
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '1.5rem',
        marginBottom: '1rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    bookingHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
    },
    status: {
        padding: '0.25rem 0.75rem',
        borderRadius: '20px',
        color: 'white',
        fontSize: '0.9rem',
    },
    bookingDetails: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '1rem',
    },
    detailItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: '#2c3e50',
    },
    icon: {
        color: '#3498db',
    },
    duration: {
        color: '#7f8c8d',
        fontSize: '0.9rem',
        borderTop: '1px solid #eee',
        paddingTop: '1rem',
        marginTop: '1rem',
    },
    loading: {
        textAlign: 'center',
        padding: '2rem',
        color: '#2c3e50',
        fontSize: '1.2rem',
    },
    error: {
        textAlign: 'center',
        padding: '2rem',
        color: '#e74c3c',
        fontSize: '1.2rem',
    },
    noBookings: {
        textAlign: 'center',
        padding: '2rem',
        color: '#7f8c8d',
        fontSize: '1.2rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
};

export default MyBookings;