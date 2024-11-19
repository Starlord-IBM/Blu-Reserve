import React from 'react';

const SeatMap = ({ seats, selectedSeat, onSeatSelect }) => {
  return (
    <div style={styles.container}>
      <div style={styles.grid}>
        {seats.map((seat) => (
          <div
            key={seat.id}
            style={{
              ...styles.seat,
              backgroundColor: selectedSeat === seat.id ? '#2ecc71' : '#3498db',
              cursor: seat.status === 'available' ? 'pointer' : 'not-allowed',
              opacity: seat.status === 'available' ? 1 : 0.5,
            }}
            onClick={() => {
              if (seat.status === 'available') {
                onSeatSelect(seat.id);
              }
            }}
          >
            {seat.seat_number}
          </div>
        ))}
      </div>
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
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))',
    gap: '10px',
    justifyItems: 'center',
  },
  seat: {
    width: '50px',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    color: 'white',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
  },
};

export default SeatMap;