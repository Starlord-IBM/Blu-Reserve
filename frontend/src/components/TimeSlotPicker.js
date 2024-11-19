import React from 'react';
import { format, parseISO } from 'date-fns';

const TimeSlotPicker = ({ 
    availableSlots, 
    selectedSlot, 
    selectedDuration, 
    onSlotSelect, 
    onDurationChange 
}) => {
    return (
        <div style={styles.container}>
            <div style={styles.slotsGrid}>
                {availableSlots.map((slot, index) => (
                    <div
                        key={index}
                        style={{
                            ...styles.slot,
                            backgroundColor: selectedSlot?.start_time === slot.start_time 
                                ? '#2ecc71' 
                                : '#3498db'
                        }}
                        onClick={() => onSlotSelect(slot)}
                    >
                        {format(parseISO(slot.start_time), 'HH:mm')}
                    </div>
                ))}
            </div>

            {selectedSlot && (
                <div style={styles.durationContainer}>
                    <label style={styles.label}>
                        Duration: {selectedDuration} minutes
                    </label>
                    <input
                        type="range"
                        min={30}
                        max={120}
                        step={30}
                        value={selectedDuration}
                        onChange={(e) => onDurationChange(parseInt(e.target.value))}
                        style={styles.slider}
                    />
                    <div style={styles.durationDisplay}>
                        {format(parseISO(selectedSlot.start_time), 'HH:mm')} - 
                        {format(
                            parseISO(selectedSlot.start_time).getTime() + 
                            selectedDuration * 60000, 
                            'HH:mm'
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    title: {
        marginBottom: '15px',
        color: '#2c3e50',
    },
    slotsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
        gap: '10px',
        marginBottom: '20px',
    },
    slot: {
        padding: '10px',
        textAlign: 'center',
        color: 'white',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    },
    durationContainer: {
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '4px',
    },
    label: {
        display: 'block',
        marginBottom: '10px',
        color: '#2c3e50',
    },
    slider: {
        width: '100%',
        marginBottom: '10px',
    },
    durationDisplay: {
        textAlign: 'center',
        color: '#2c3e50',
        fontWeight: 'bold',
    },
};

export default TimeSlotPicker;