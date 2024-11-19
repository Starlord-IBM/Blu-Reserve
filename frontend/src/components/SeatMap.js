import React from 'react';
import { Grid, Button, Paper, Typography, Box } from '@mui/material';

const SeatMap = ({ seats, selectedSeats, onSeatSelect }) => {
    // Group seats into rows (assuming 8 seats per row)
    const seatsPerRow = 8;
    const rows = [];
    for (let i = 0; i < seats.length; i += seatsPerRow) {
        rows.push(seats.slice(i, i + seatsPerRow));
    }

    const handleSeatClick = (seatId) => {
        // Only allow selection of available seats
        const seat = seats.find(s => s.id === seatId);
        if (seat && seat.status === "available") {
            onSeatSelect(seatId);
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 3, backgroundColor: 'grey.50' }}>
            <Typography variant="h6" gutterBottom>
                Select Seats
            </Typography>

            {/* Legend */}
            <Box sx={{ mb: 3, display: 'flex', gap: 3, alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ 
                        width: 20, 
                        height: 20, 
                        backgroundColor: 'grey.300', 
                        mr: 1 
                    }} />
                    <Typography variant="body2">Unavailable</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ 
                        width: 20, 
                        height: 20, 
                        border: '1px solid',
                        borderColor: 'primary.main',
                        mr: 1 
                    }} />
                    <Typography variant="body2">Available</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ 
                        width: 20, 
                        height: 20, 
                        backgroundColor: 'primary.main',
                        mr: 1 
                    }} />
                    <Typography variant="body2">Selected</Typography>
                </Box>
            </Box>

            {/* Screen representation */}
            <Box sx={{ 
                width: '100%', 
                height: '20px', 
                backgroundColor: 'grey.300',
                borderRadius: '4px',
                mb: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Typography variant="caption" color="text.secondary">
                    SCREEN
                </Typography>
            </Box>

            {/* Seat grid */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {rows.map((row, rowIndex) => (
                    <Grid container spacing={2} key={rowIndex} justifyContent="center">
                        {row.map((seat) => {
                            const isSelected = selectedSeats.includes(seat.id);
                            const isUnavailable = seat.status === "unavailable";

                            return (
                                <Grid item key={seat.id}>
                                    <Button
                                        variant={isSelected ? "contained" : "outlined"}
                                        onClick={() => handleSeatClick(seat.id)}
                                        disabled={isUnavailable}
                                        sx={{
                                            minWidth: '48px',
                                            height: '48px',
                                            p: 0,
                                            backgroundColor: isUnavailable ? 'grey.300' : 
                                                           isSelected ? 'primary.main' : 'transparent',
                                            '&:disabled': {
                                                backgroundColor: 'grey.300',
                                                color: 'grey.500'
                                            },
                                            '&:hover': {
                                                backgroundColor: isSelected ? 'primary.dark' : 
                                                               isUnavailable ? 'grey.300' : 'primary.50'
                                            }
                                        }}
                                    >
                                        {seat.seat_number}
                                    </Button>
                                </Grid>
                            );
                        })}
                    </Grid>
                ))}
            </Box>
        </Paper>
    );
};

export default SeatMap;