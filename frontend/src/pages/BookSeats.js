import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CircularSeating from '../components/CircularSeating';
import TimeSelector from '../components/TimeSelector';
import { format } from 'date-fns';
import { getLocations, createBooking } from '../services/api';

const BookSeats = () => {
    const navigate = useNavigate();
    const [locations, setLocations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [bookingDetails, setBookingDetails] = useState({
        location: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        numberOfPeople: 1,
        selectedSeats: [],
        time: '',
        duration: 30
    });

    // Fetch locations when component mounts
    useEffect(() => {
        const fetchLocations = async () => {
            try {
                setIsLoading(true);
                const response = await getLocations();
                setLocations(response.data || []);
                setError(null);
            } catch (err) {
                setError('Failed to fetch locations: ' + (err.message || 'Unknown error'));
                setLocations([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLocations();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateBooking()) return;

        try {
            setIsLoading(true);
            const [hours, minutes] = bookingDetails.time.split(':').map(Number);
            const bookingDate = new Date(bookingDetails.date);
            bookingDate.setHours(hours, minutes, 0);

            const bookingData = {
                location_id: bookingDetails.location,
                seat_ids: bookingDetails.selectedSeats,
                number_of_people: bookingDetails.numberOfPeople,
                booking_date: bookingDate.toISOString(),
                time_slot: {
                    start_time: bookingDate.toISOString(),
                    duration_minutes: bookingDetails.duration
                }
            };

            await createBooking(bookingData);
            navigate('/my-bookings');
        } catch (err) {
            setError('Failed to create booking: ' + (err.message || 'Unknown error'));
        } finally {
            setIsLoading(false);
        }
    };

    const validateBooking = () => {
        if (!bookingDetails.location) {
            setError('Please select a location');
            return false;
        }
        if (!bookingDetails.time) {
            setError('Please select a time');
            return false;
        }
        if (bookingDetails.selectedSeats.length !== bookingDetails.numberOfPeople) {
            setError(`Please select exactly ${bookingDetails.numberOfPeople} seats`);
            return false;
        }

        // Validate if selected time is in the future
        const [hours, minutes] = bookingDetails.time.split(':').map(Number);
        const selectedDateTime = new Date(bookingDetails.date);
        selectedDateTime.setHours(hours, minutes, 0);

        if (selectedDateTime < new Date()) {
            setError('Please select a future time');
            return false;
        }

        return true;
    };

    if (isLoading) {
        return <div style={styles.loading}>Loading...</div>;
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Book Cafeteria Seats</h1>

            {error && (
                <div style={styles.error}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGrid}>
                    {/* Location Selection */}
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Location:</label>
                        <select
                            value={bookingDetails.location}
                            onChange={(e) => setBookingDetails({
                                ...bookingDetails,
                                location: e.target.value,
                                selectedSeats: []
                            })}
                            style={styles.select}
                            required
                        >
                            <option value="">Select Location</option>
                            {locations && locations.map(loc => (
                                <option key={loc.id} value={loc.id}>
                                    {loc.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Date Selection */}
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Date:</label>
                        <input
                            type="date"
                            value={bookingDetails.date}
                            min={format(new Date(), 'yyyy-MM-dd')}
                            onChange={(e) => setBookingDetails({
                                ...bookingDetails,
                                date: e.target.value,
                                selectedSeats: []
                            })}
                            style={styles.input}
                            required
                        />
                    </div>

                    {/* Number of People Selection */}
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Number of People:</label>
                        <select
                            value={bookingDetails.numberOfPeople}
                            onChange={(e) => setBookingDetails({
                                ...bookingDetails,
                                numberOfPeople: parseInt(e.target.value),
                                selectedSeats: []
                            })}
                            style={styles.select}
                            required
                        >
                            {[...Array(20)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>
                                    {i + 1} {i === 0 ? 'person' : 'people'}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Time Selection */}
                {bookingDetails.location && bookingDetails.date && (
                    <div style={styles.timeSection}>
                        <h2 style={styles.sectionTitle}>Select Time</h2>
                        <TimeSelector
                            selectedTime={bookingDetails.time}
                            selectedDuration={bookingDetails.duration}
                            onTimeChange={(time) => setBookingDetails({
                                ...bookingDetails,
                                time
                            })}
                            onDurationChange={(duration) => setBookingDetails({
                                ...bookingDetails,
                                duration
                            })}
                        />
                    </div>
                )}

                {/* Seat Selection */}
                {bookingDetails.time && (
                    <div style={styles.seatingSection}>
                        <h2 style={styles.sectionTitle}>Select Your Seats</h2>
                        <p style={styles.instruction}>
                            Please select {bookingDetails.numberOfPeople} seats
                        </p>
                        
                        <CircularSeating
                            selectedSeats={bookingDetails.selectedSeats}
                            onSeatSelect={(seats) => setBookingDetails({
                                ...bookingDetails,
                                selectedSeats: seats
                            })}
                            requiredSeats={bookingDetails.numberOfPeople}
                        />

                        <div style={styles.selectedSeats}>
                            <h3 style={styles.subTitle}>Selected Seats</h3>
                            <div style={styles.seatList}>
                                {bookingDetails.selectedSeats.length > 0 ? (
                                    bookingDetails.selectedSeats.map((seatId) => (
                                        <span key={seatId} style={styles.seatTag}>
                                            {seatId}
                                        </span>
                                    ))
                                ) : (
                                    <p>No seats selected</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                        ...styles.submitButton,
                        opacity: isLoading ? 0.7 : 1
                    }}
                >
                    {isLoading ? 'Processing...' : 'Confirm Booking'}
                </button>
            </form>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem',
    },
    title: {
        textAlign: 'center',
        color: '#2c3e50',
        marginBottom: '2rem',
    },
    form: {
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    formGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    label: {
        color: '#2c3e50',
        fontWeight: 'bold',
    },
    select: {
        padding: '0.75rem',
        borderRadius: '4px',
        border: '1px solid #ddd',
        fontSize: '1rem',
    },
    input: {
        padding: '0.75rem',
        borderRadius: '4px',
        border: '1px solid #ddd',
        fontSize: '1rem',
    },
    timeSection: {
        marginBottom: '2rem',
    },
    seatingSection: {
        marginBottom: '2rem',
    },
    sectionTitle: {
        color: '#2c3e50',
        marginBottom: '1rem',
        textAlign: 'center',
    },
    instruction: {
        textAlign: 'center',
        color: '#7f8c8d',
        marginBottom: '1rem',
    },
    selectedSeats: {
        marginTop: '2rem',
        textAlign: 'center',
    },
    subTitle: {
        color: '#2c3e50',
        marginBottom: '1rem',
    },
    seatList: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        justifyContent: 'center',
    },
    seatTag: {
        backgroundColor: '#2ecc71',
        color: 'white',
        padding: '0.5rem 1rem',
        borderRadius: '20px',
        fontSize: '0.9rem',
    },
    submitButton: {
        width: '100%',
        padding: '1rem',
        backgroundColor: '#2ecc71',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    },
    error: {
        backgroundColor: '#ff7675',
        color: 'white',
        padding: '1rem',
        borderRadius: '4px',
        marginBottom: '1rem',
        textAlign: 'center',
    },
    loading: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px',
        fontSize: '1.2rem',
        color: '#666',
    },
};

export default BookSeats;