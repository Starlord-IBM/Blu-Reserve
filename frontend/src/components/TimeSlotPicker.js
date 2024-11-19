import React from 'react';

const TimeSlotPicker = ({ timeSlots, selectedTime, selectedDuration, onTimeSelect, onDurationChange }) => {
  return (
    <div style={styles.container}>
      <div style={styles.timeSlots}>
        {timeSlots.map((slot) => (
          <div
            key={slot.start_time}
            style={{
              ...styles.timeSlot,
              backgroundColor: selectedTime === slot.start_time ? '#2ecc71' : '#3498db',
            }}
            onClick={() => onTimeSelect(slot.start_time)}
          >
            {new Date(slot.start_time).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        ))}
      </div>
      
      {selectedTime && (
        <div style={styles.durationContainer}>
          <label style={styles.label}>Duration (minutes):</label>
          <input
            type="range"
            min="10"
            max="120"
            step="5"
            value={selectedDuration}
            onChange={(e) => onDurationChange(parseInt(e.target.value))}
            style={styles.slider}
          />
          <span style={styles.durationDisplay}>{selectedDuration} minutes</span>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: 'white',
  },
  timeSlots: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
    gap: '10px',
  },
  timeSlot: {
    padding: '10px',
    textAlign: 'center',
    borderRadius: '4px',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  durationContainer: {
    marginTop: '20px',
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
    color: '#2c3e50',
    fontWeight: 'bold',
  },
};

export default TimeSlotPicker;