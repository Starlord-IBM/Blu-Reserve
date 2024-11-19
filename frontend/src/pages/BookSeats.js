import React, { useState } from 'react';

const BookSeats = () => {
  const [bookingDetails, setBookingDetails] = useState({
    location: '',
    date: '',
    timeSlot: '',
    floor: '',
    selectedSeat: null
  });

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Book Cafeteria Seats</h1>
      
      <div style={styles.form}>
        <select
          value={bookingDetails.location}
          onChange={(e) => setBookingDetails({ ...bookingDetails, location: e.target.value })}
          style={styles.select}
        >
          <option value="">Select Location</option>
          <option value="BLR-01">Bangalore Main Cafeteria</option>
        </select>

        <input
          type="date"
          value={bookingDetails.date}
          onChange={(e) => setBookingDetails({ ...bookingDetails, date: e.target.value })}
          style={styles.input}
        />

        <select
          value={bookingDetails.floor}
          onChange={(e) => setBookingDetails({ ...bookingDetails, floor: e.target.value })}
          style={styles.select}
        >
          <option value="">Select Floor</option>
          <option value="0">Ground Floor</option>
          <option value="1">First Floor</option>
        </select>

        <div style={styles.seatMap}>
          <p>Seat map will be displayed here</p>
        </div>

        <button style={styles.button}>
          Confirm Booking
        </button>
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
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  select: {
    padding: '0.75rem',
    borderRadius: '4px',
    border: '1px solid #dcdde1',
    fontSize: '1rem',
  },
  input: {
    padding: '0.75rem',
    borderRadius: '4px',
    border: '1px solid #dcdde1',
    fontSize: '1rem',
  },
  seatMap: {
    border: '1px solid #dcdde1',
    borderRadius: '4px',
    padding: '2rem',
    marginTop: '1rem',
    textAlign: 'center',
  },
  button: {
    padding: '0.75rem',
    backgroundColor: '#2c3e50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
};

export default BookSeats;