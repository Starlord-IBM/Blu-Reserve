
// import React from 'react';

// const SeatMap = ({ seats, selectedSeats, onSeatSelect }) => {
//     const arrangeSeatsInCircles = () => {
//         const centerX = 400; // Center point X
//         const centerY = 400; // Center point Y
//         const poolRadius = 100; // Pool radius

//         // Define three concentric circles
//         const circles = [
//             { radius: poolRadius + 80, seats: 24 },  // Inner circle
//             { radius: poolRadius + 160, seats: 32 }, // Middle circle
//             { radius: poolRadius + 240, seats: 40 }  // Outer circle
//         ];

//         let arrangedSeats = [];
//         let seatIndex = 0;

//         circles.forEach((circle, circleIndex) => {
//             for (let i = 0; i < circle.seats && seatIndex < seats.length; i++) {
//                 const angle = (i * 2 * Math.PI) / circle.seats;
//                 const x = centerX + circle.radius * Math.cos(angle);
//                 const y = centerY + circle.radius * Math.sin(angle);
                
//                 if (seatIndex < seats.length) {
//                     arrangedSeats.push({
//                         ...seats[seatIndex],
//                         x,
//                         y
//                     });
//                     seatIndex++;
//                 }
//             }
//         });

//         return arrangedSeats;
//     };

//     const handleSeatClick = (seatId) => {
//         const seat = seats.find(s => s.id === seatId);
//         if (seat && seat.status === "available") {
//             onSeatSelect(seatId);
//         }
//     };

//     const arrangedSeats = arrangeSeatsInCircles();

//     return (
//         <div style={styles.container}>
//             {/* Pool in center */}
//             <div style={styles.pool}>
//                 <div style={styles.poolInner}>Pool</div>
//             </div>

//             {/* Seats arranged in circles */}
//             {arrangedSeats.map((seat) => {
//                 const isSelected = selectedSeats.includes(seat.id);
//                 const isUnavailable = seat.status === "unavailable";

//                 return (
//                     <div
//                         key={seat.id}
//                         style={{
//                             ...styles.seat,
//                             left: `${seat.x}px`,
//                             top: `${seat.y}px`,
//                             backgroundColor: isSelected ? '#2ecc71' : 
//                                            isUnavailable ? '#95a5a6' : '#3498db',
//                             cursor: isUnavailable ? 'not-allowed' : 'pointer',
//                             transform: 'translate(-50%, -50%)'
//                         }}
//                         onClick={() => handleSeatClick(seat.id)}
//                     >
//                         {seat.seat_number}
//                     </div>
//                 );
//             })}

//             {/* Legend */}
//             <div style={styles.legend}>
//                 <div style={styles.legendItem}>
//                     <div style={{...styles.legendBox, backgroundColor: '#3498db'}}></div>
//                     <span>Available</span>
//                 </div>
//                 <div style={styles.legendItem}>
//                     <div style={{...styles.legendBox, backgroundColor: '#2ecc71'}}></div>
//                     <span>Selected</span>
//                 </div>
//                 <div style={styles.legendItem}>
//                     <div style={{...styles.legendBox, backgroundColor: '#95a5a6'}}></div>
//                     <span>Unavailable</span>
//                 </div>
//             </div>
//         </div>
//     );
// };

// const styles = {
//     legend: {
//         position: 'absolute',
//         bottom: '-60px', // Moved further down
//         left: '50%',
//         transform: 'translateX(-50%)',
//         display: 'flex',
//         gap: '20px',
//         padding: '10px 20px',
//         backgroundColor: 'white',
//         borderRadius: '8px',
//         boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//         zIndex: 3, // Ensure legend stays on top
//     },
//     container: {
//         position: 'relative',
//         width: '800px',
//         height: '800px',
//         margin: '0 auto 80px', // Added bottom margin to account for legend
//         backgroundColor: '#f8f9fa',
//         borderRadius: '8px',
//         overflow: 'visible', // Changed from 'hidden' to show legend
//     },
//     pool: {
//         position: 'absolute',
//         top: '50%',
//         left: '50%',
//         transform: 'translate(-50%, -50%)',
//         width: '200px',
//         height: '200px',
//         backgroundColor: '#74b9ff',
//         borderRadius: '50%',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         zIndex: 1,
//         boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)',
//     },
//     poolInner: {
//         color: 'white',
//         fontSize: '1.5rem',
//         fontWeight: 'bold',
//     },
//     seat: {
//         position: 'absolute',
//         width: '40px',
//         height: '40px',
//         borderRadius: '8px',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         color: 'white',
//         fontWeight: 'bold',
//         fontSize: '0.8rem',
//         transition: 'all 0.3s ease',
//         boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//         zIndex: 2,
//     },
//     legendItem: {
//         display: 'flex',
//         alignItems: 'center',
//         gap: '8px',
//     },
//     legendBox: {
//         width: '20px',
//         height: '20px',
//         borderRadius: '4px',
//     }
// };

// export default SeatMap;

import React from 'react';

const SeatMap = ({ seats, selectedSeats, onSeatSelect }) => {
    const arrangeSeatsInCircles = () => {
        const centerX = 400;
        const centerY = 400;
        const poolRadius = 100;

        const circles = [
            { radius: poolRadius + 80, seats: 24 },
            { radius: poolRadius + 160, seats: 32 },
            { radius: poolRadius + 240, seats: 40 }
        ];

        let arrangedSeats = [];
        let seatIndex = 0;

        circles.forEach((circle) => {
            for (let i = 0; i < circle.seats && seatIndex < seats.length; i++) {
                const angle = (i * 2 * Math.PI) / circle.seats;
                const x = centerX + circle.radius * Math.cos(angle);
                const y = centerY + circle.radius * Math.sin(angle);
                
                if (seatIndex < seats.length) {
                    arrangedSeats.push({
                        ...seats[seatIndex],
                        x,
                        y
                    });
                    seatIndex++;
                }
            }
        });

        return arrangedSeats;
    };

    const handleSeatClick = (seatId) => {
        const seat = seats.find(s => s.id === seatId);
        if (seat && seat.status === "available") {
            onSeatSelect(seatId);
        }
    };

    const formatSeatNumber = (seatNumber) => {
        // Extract the seat number portion
        const match = seatNumber.match(/[ABC]\d+/);
        return match ? match[0] : seatNumber;
    };

    const arrangedSeats = arrangeSeatsInCircles();

    return (
        <div style={styles.container}>
            {/* Pool in center */}
            <div style={styles.pool}>
                <div style={styles.poolInner}>Pool</div>
            </div>

            {/* Seats arranged in circles */}
            {arrangedSeats.map((seat) => {
                const isSelected = selectedSeats.includes(seat.id);
                const isUnavailable = seat.status === "unavailable";

                return (
                    <div
                        key={seat.id}
                        style={{
                            ...styles.seat,
                            left: `${seat.x}px`,
                            top: `${seat.y}px`,
                            backgroundColor: isSelected ? '#2ecc71' : 
                                           isUnavailable ? '#95a5a6' : '#3498db',
                            cursor: isUnavailable ? 'not-allowed' : 'pointer',
                            transform: 'translate(-50%, -50%)'
                        }}
                        onClick={() => handleSeatClick(seat.id)}
                    >
                        {formatSeatNumber(seat.seat_number)}
                    </div>
                );
            })}

            {/* Legend */}
            <div style={styles.legend}>
                <div style={styles.legendItem}>
                    <div style={{...styles.legendBox, backgroundColor: '#3498db'}}></div>
                    <span>Available</span>
                </div>
                <div style={styles.legendItem}>
                    <div style={{...styles.legendBox, backgroundColor: '#2ecc71'}}></div>
                    <span>Selected</span>
                </div>
                <div style={styles.legendItem}>
                    <div style={{...styles.legendBox, backgroundColor: '#95a5a6'}}></div>
                    <span>Unavailable</span>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        position: 'relative',
        width: '800px',
        height: '800px',
        margin: '0 auto 80px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        overflow: 'visible',
    },
    pool: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '200px',
        height: '200px',
        backgroundColor: '#74b9ff',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)',
    },
    poolInner: {
        color: 'white',
        fontSize: '1.5rem',
        fontWeight: 'bold',
    },
    seat: {
        position: 'absolute',
        width: '40px',
        height: '40px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '0.8rem',
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        zIndex: 2,
    },
    legend: {
        position: 'absolute',
        bottom: '-60px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '20px',
        padding: '10px 20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        zIndex: 3,
    },
    legendItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    legendBox: {
        width: '20px',
        height: '20px',
        borderRadius: '4px',
    }
};

export default SeatMap;