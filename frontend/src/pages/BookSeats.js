import React, { useState } from 'react';

const BookSeats = () => {
  const [bookingDetails, setBookingDetails] = useState({
    location: '',
    date: '',
    timeSlot: '',
    floor: ''
  });

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
      <h1>Book Cafeteria Seats</h1>
      <div style={{ marginBottom: '20px' }}>
        <select 
          value={bookingDetails.location}
          onChange={(e) => setBookingDetails({ ...bookingDetails, location: e.target.value })}
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        >
          <option value="">Select Location</option>
          <option value="BLR-01">Bangalore Main Cafeteria (BLR-01)</option>
        </select>

        <input 
          type="date"
          value={bookingDetails.date}
          onChange={(e) => setBookingDetails({ ...bookingDetails, date: e.target.value })}
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />

        <select
          value={bookingDetails.timeSlot}
          onChange={(e) => setBookingDetails({ ...bookingDetails, timeSlot: e.target.value })}
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        >
          <option value="">Select Time Slot</option>
          <option value="11:30">11:30</option>
          <option value="12:00">12:00</option>
          <option value="12:30">12:30</option>
        </select>

        <select
          value={bookingDetails.floor}
          onChange={(e) => setBookingDetails({ ...bookingDetails, floor: e.target.value })}
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        >
          <option value="">Select Floor</option>
          <option value="0">Ground Floor</option>
          <option value="1">First Floor</option>
          <option value="2">Second Floor</option>
        </select>
      </div>

      <div style={{ border: '1px solid #ccc', padding: '20px', marginBottom: '20px' }}>
        <p>Seat map will be displayed here</p>
      </div>

      <button>Confirm Booking</button>
    </div>
  );
};

export default BookSeats;