import React from 'react';
import { 
    Box, 
    FormControl, 
    InputLabel, 
    MenuItem, 
    Select, 
    Typography 
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

const TimeSlotPicker = ({ 
    selectedDate, 
    selectedTime, 
    selectedDuration, 
    onDateChange, 
    onTimeChange, 
    onDurationChange 
}) => {
    // Available time slots from 9 AM to 9 PM
    const timeSlots = Array.from({ length: 13 }, (_, i) => {
        const hour = i + 9;
        return {
            value: `${hour}:00`,
            label: `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`
        };
    });

    const durations = [
        { value: 30, label: '30 minutes' },
        { value: 60, label: '1 hour' },
        { value: 90, label: '1.5 hours' },
        { value: 120, label: '2 hours' }
    ];

    return (
        <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Select Date and Time
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        label="Booking Date"
                        value={selectedDate}
                        onChange={onDateChange}
                        minDate={new Date()}
                        sx={{ minWidth: 200 }}
                    />
                </LocalizationProvider>

                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Time</InputLabel>
                    <Select
                        value={selectedTime}
                        label="Time"
                        onChange={(e) => onTimeChange(e.target.value)}
                    >
                        {timeSlots.map((slot) => (
                            <MenuItem key={slot.value} value={slot.value}>
                                {slot.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Duration</InputLabel>
                    <Select
                        value={selectedDuration}
                        label="Duration"
                        onChange={(e) => onDurationChange(e.target.value)}
                    >
                        {durations.map((duration) => (
                            <MenuItem key={duration.value} value={duration.value}>
                                {duration.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
        </Box>
    );
};

export default TimeSlotPicker;