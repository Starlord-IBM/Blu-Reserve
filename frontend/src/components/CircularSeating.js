import React, { useState } from 'react';

const CircularSeating = ({ 
    selectedSeats = [], 
    onSeatSelect, 
    requiredSeats,
    maxSeats = 60  // Increased total seats
}) => {
    const calculateSeatingLayout = () => {
        const seats = [];
        const centerX = 300; // Increased center point
        const centerY = 300;
        const poolRadius = 80;

        // Three concentric circles for more seats
        const circles = [
            { radius: poolRadius + 50, seats: 16, prefix: 'A' },  // Inner circle
            { radius: poolRadius + 120, seats: 20, prefix: 'B' }, // Middle circle
            { radius: poolRadius + 190, seats: 24, prefix: 'C' }  // Outer circle
        ];

        circles.forEach((circle, circleIndex) => {
            for (let i = 0; i < circle.seats; i++) {
                const angle = (i * 2 * Math.PI) / circle.seats;
                seats.push({
                    id: `${circle.prefix}${i + 1}`,
                    x: centerX + circle.radius * Math.cos(angle),
                    y: centerY + circle.radius * Math.sin(angle),
                    seatNumber: `${circle.prefix}${i + 1}`,
                    circle: circleIndex
                });
            }
        });

        return seats;
    };

    const [seats] = useState(calculateSeatingLayout());

    const handleSeatClick = (seatId) => {
        if (selectedSeats.includes(seatId)) {
            onSeatSelect(selectedSeats.filter(id => id !== seatId));
        } else if (selectedSeats.length < requiredSeats) {
            onSeatSelect([...selectedSeats, seatId]);
        }
    };

    return (
        <div style={styles.container}>
            {/* Central Pool */}
            <div style={styles.pool}>
                <div style={styles.poolInner}>Pool</div>
            </div>

            {/* Seats */}
            {seats.map((seat) => (
                <div
                    key={seat.id}
                    style={{
                        ...styles.seat,
                        left: `${seat.x}px`,
                        top: `${seat.y}px`,
                        backgroundColor: selectedSeats.includes(seat.id) 
                            ? '#2ecc71' 
                            : '#3498db',
                        cursor: selectedSeats.length < requiredSeats || 
                               selectedSeats.includes(seat.id) 
                            ? 'pointer' 
                            : 'not-allowed'
                    }}
                    onClick={() => handleSeatClick(seat.id)}
                >
                    {seat.seatNumber}
                </div>
            ))}

            {/* Selection Info */}
            <div style={styles.info}>
                {selectedSeats.length} / {requiredSeats} seats selected
            </div>
        </div>
    );
};

const styles = {
    container: {
        position: 'relative',
        width: '600px',  // Increased size
        height: '600px', // Increased size
        margin: '2rem auto',
        border: '1px solid #ddd',
        borderRadius: '50%',
        backgroundColor: '#f8f9fa',
    },
    pool: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '160px',
        height: '160px',
        borderRadius: '50%',
        backgroundColor: '#74b9ff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)',
        zIndex: 1,
    },
    poolInner: {
        fontSize: '1.2rem',
        color: 'white',
        textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
    },
    seat: {
        position: 'absolute',
        width: '35px',
        height: '35px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '0.8rem',
        fontWeight: 'bold',
        transform: 'translate(-50%, -50%)',
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        zIndex: 2,
    },
    info: {
        position: 'absolute',
        bottom: '-40px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'white',
        padding: '10px 20px',
        borderRadius: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        fontSize: '0.9rem',
    }
};

export default CircularSeating;