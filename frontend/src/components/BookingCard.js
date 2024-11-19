import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
} from '@mui/material';
import { format } from 'date-fns';

const BookingCard = ({ booking }) => {
    const formatDate = (date) => {
        return format(new Date(date), 'MMM dd, yyyy hh:mm a');
    };

    return (
        <Card sx={{ mb: 2, backgroundColor: '#f8f9fa' }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" component="div">
                        Booking #{booking.id.slice(-6)}
                    </Typography>
                    <Chip
                        label={booking.status}
                        color={booking.status === 'active' ? 'success' : 'default'}
                    />
                </Box>

                <Typography color="text.secondary" gutterBottom>
                    Date: {formatDate(booking.booking_date)}
                </Typography>
                
                <Typography color="text.secondary" gutterBottom>
                    Duration: {booking.time_slot.duration_minutes} minutes
                </Typography>

                <Typography color="text.secondary" gutterBottom>
                    Seats: {booking.seat_ids.length} 
                    ({booking.seat_ids.join(', ')})
                </Typography>

                <Typography variant="body2" sx={{ mt: 1 }}>
                    Total Cost: {booking.total_cost} Blu Dollars
                </Typography>
            </CardContent>
        </Card>
    );
};

export default BookingCard;