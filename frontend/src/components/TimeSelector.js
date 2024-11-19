import React from 'react';

const TimeSelector = ({ selectedTime, selectedDuration, onTimeChange, onDurationChange }) => {
    // Generate time options from 9 AM to 9 PM
    const generateTimeOptions = () => {
        const times = [];
        for (let hour = 9; hour <= 21; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                times.push(timeString);
            }
        }
        return times;
    };

    return (
        <div style={styles.container}>
            <div style={styles.timeSelection}>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Select Time:</label>
                    <select
                        value={selectedTime}
                        onChange={(e) => onTimeChange(e.target.value)}
                        style={styles.select}
                    >
                        <option value="">Choose time</option>
                        {generateTimeOptions().map((time) => (
                            <option key={time} value={time}>
                                {time}
                            </option>
                        ))}
                    </select>
                </div>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>Duration (minutes):</label>
                    <select
                        value={selectedDuration}
                        onChange={(e) => onDurationChange(parseInt(e.target.value))}
                        style={styles.select}
                    >
                        <option value={30}>30 minutes</option>
                        <option value={60}>1 hour</option>
                        <option value={90}>1.5 hours</option>
                        <option value={120}>2 hours</option>
                    </select>
                </div>
            </div>

            {selectedTime && (
                <div style={styles.summary}>
                    <p>Selected Time: <strong>{selectedTime}</strong></p>
                    <p>Duration: <strong>{selectedDuration} minutes</strong></p>
                    <p>End Time: <strong>
                        {calculateEndTime(selectedTime, selectedDuration)}
                    </strong></p>
                </div>
            )}
        </div>
    );
};

const calculateEndTime = (startTime, durationMinutes) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0);
    const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
    return `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
};

const styles = {
    container: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    timeSelection: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '20px',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    label: {
        color: '#2c3e50',
        fontWeight: 'bold',
        fontSize: '0.9rem',
    },
    select: {
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ddd',
        fontSize: '1rem',
        backgroundColor: 'white',
    },
    summary: {
        backgroundColor: '#f8f9fa',
        padding: '15px',
        borderRadius: '4px',
        marginTop: '20px',
    },
};

export default TimeSelector;