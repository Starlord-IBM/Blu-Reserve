import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Button,
    Typography,
    Alert,
    Paper,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { seatService, bookingService } from '../services/api';
import TimeSlotPicker from '../components/TimeSlotPicker';
import SeatMap from '../components/SeatMap';

const BookSeats = () => {
    const navigate = useNavigate();
    const { user, updateUser } = useAuth();
    
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState('11:00');
    const [selectedDuration, setSelectedDuration] = useState(30);
    const [seats, setSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [confirmDialog, setConfirmDialog] = useState(false);

    useEffect(() => {
        fetchAvailableSeats();
    }, [selectedDate, selectedTime, selectedDuration]);

    const fetchAvailableSeats = async () => {
        try {
            setLoading(true);
            setError('');
            
            const bookingDate = new Date(selectedDate);
            const [hours, minutes] = selectedTime.split(':');
            bookingDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

            const availableSeats = await seatService.getAvailableSeats(
                bookingDate,
                selectedDuration
            );
            setSeats(availableSeats);
            setSelectedSeats([]);
        } catch (err) {
            console.error('Error fetching seats:', err);
            setError(typeof err === 'string' ? err : 'Failed to fetch available seats');
        } finally {
            setLoading(false);
        }
    };

    const handleSeatSelect = (seatId) => {
        setSelectedSeats(prev => {
            if (prev.includes(seatId)) {
                return prev.filter(id => id !== seatId);
            }
            return [...prev, seatId];
        });
    };

    const calculateTotalCost = () => {
        return selectedSeats.length * (selectedDuration / 30) * 5;
    };

    const handleBookingConfirm = async () => {
        try {
            setLoading(true);
            setError('');
    
            // Convert local date/time to UTC
            const bookingDate = new Date(selectedDate);
            const [hours, minutes] = selectedTime.split(':');
            bookingDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
            
            const bookingData = {
                seat_ids: selectedSeats,
                booking_date: bookingDate.toISOString(), // This will convert to UTC
                duration_minutes: parseInt(selectedDuration),
                total_cost: parseFloat(calculateTotalCost())
            };
    
            await bookingService.createBooking(bookingData);
            await updateUser();
            setConfirmDialog(false);
            navigate('/my-bookings');
        } catch (err) {
            console.error('Booking error:', err);
            setError(err.message || 'Failed to create booking');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Book Seats
                </Typography>

                <TimeSlotPicker
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                    selectedDuration={selectedDuration}
                    onDateChange={setSelectedDate}
                    onTimeChange={setSelectedTime}
                    onDurationChange={setSelectedDuration}
                />

                {error && (
                    <Alert severity="error" sx={{ my: 2 }}>
                        {error}
                    </Alert>
                )}

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Box sx={{ my: 4 }}>
                        <SeatMap
                            seats={seats}
                            selectedSeats={selectedSeats}
                            onSeatSelect={handleSeatSelect}
                        />

                        {selectedSeats.length > 0 && (
                            <Paper 
                                elevation={3} 
                                sx={{ 
                                    mt: 3, 
                                    p: 3,
                                    borderRadius: 2
                                }}
                            >
                                <Typography variant="h6" gutterBottom>
                                    Booking Summary
                                </Typography>
                                <Box sx={{ mb: 2 }}>
                                    <Typography>
                                        Selected Seats: {selectedSeats.length}
                                    </Typography>
                                    <Typography>
                                        Duration: {selectedDuration} minutes
                                    </Typography>
                                    <Typography>
                                        Total Cost: {calculateTotalCost()} Blu Dollars
                                    </Typography>
                                    <Typography color="text.secondary">
                                        Your Balance: {user.blu_dollars} Blu Dollars
                                    </Typography>
                                </Box>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={() => setConfirmDialog(true)}
                                    disabled={calculateTotalCost() > user.blu_dollars}
                                >
                                    Proceed to Book
                                </Button>
                            </Paper>
                        )}
                    </Box>
                )}

                <Dialog
                    open={confirmDialog}
                    onClose={() => {
                        setConfirmDialog(false);
                        setError('');
                    }}
                >
                    <DialogTitle>Confirm Booking</DialogTitle>
                    <DialogContent>
                        <Box sx={{ minWidth: 300 }}>
                            <Typography gutterBottom>
                                Are you sure you want to book {selectedSeats.length} seat(s) for {selectedDuration} minutes?
                            </Typography>
                            <Typography variant="subtitle1" sx={{ mt: 2 }}>
                                Booking Details:
                            </Typography>
                            <Typography>
                                Date: {selectedDate.toLocaleDateString()}
                            </Typography>
                            <Typography>
                                Time: {selectedTime}
                            </Typography>
                            <Typography>
                                Duration: {selectedDuration} minutes
                            </Typography>
                            <Typography variant="h6" sx={{ mt: 2 }}>
                                Total Cost: {calculateTotalCost()} Blu Dollars
                            </Typography>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button 
                            onClick={() => {
                                setConfirmDialog(false);
                                setError('');
                            }}
                            color="inherit"
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleBookingConfirm}
                            variant="contained"
                            color="primary"
                            disabled={loading}
                        >
                            {loading ? (
                                <CircularProgress size={24} sx={{ color: 'white' }} />
                            ) : (
                                'Confirm'
                            )}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Container>
    );
};

export default BookSeats;