import React from 'react';

const BookingCard = ({ booking, onCancel }) => {
  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h3>Booking #{booking.id}</h3>
        <span style={getStatusStyle(booking.status)}>{booking.status}</span>
      </div>

      <div style={styles.details}>
        <p><strong>Date:</strong> {new Date(booking.booking_date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> {new Date(booking.time_slot.start_time).toLocaleTimeString()}</p>
        <p><strong>Duration:</strong> {booking.time_slot.duration_minutes} minutes</p>
        <p><strong>Seat:</strong> {booking.seat_id}</p>
      </div>

      {booking.status === 'active' && (
        <button 
          onClick={() => onCancel(booking.id)}
          style={styles.cancelButton}
        >
          Cancel Booking
        </button>
      )}
    </div>
  );
};

const getStatusStyle = (status) => ({
  ...styles.status,
  backgroundColor: 
    status === 'active' ? '#2ecc71' :
    status === 'cancelled' ? '#e74c3c' :
    status === 'completed' ? '#3498db' : '#95a5a6',
});

const styles = {
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  status: {
    padding: '5px 10px',
    borderRadius: '4px',
    color: 'white',
    fontSize: '0.9em',
  },
  details: {
    display: 'grid',
    gap: '10px',
  },
  cancelButton: {
    marginTop: '15px',
    padding: '8px 16px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
};

export default BookingCard;