import React from 'react';

const MyBookings = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>My Bookings</h1>
      
      <div style={styles.bookingsList}>
        <p style={styles.emptyMessage}>No bookings found</p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '2rem auto',
    padding: '0 1rem',
  },
  title: {
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: '2rem',
  },
  bookingsList: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '2rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#7f8c8d',
  },
};

export default MyBookings;