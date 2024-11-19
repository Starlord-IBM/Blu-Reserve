import React from 'react';
import { Link } from 'react-router-dom';
import { FaChair, FaUsers, FaCalendar, FaClock } from 'react-icons/fa';

const Home = () => {
  const userName = localStorage.getItem('userName') || 'User';

  return (
    <div style={styles.container}>
      <div style={styles.welcome}>
        <h1>Welcome to Blu-Reserve, {userName}!</h1>
        <p>Your premium cafeteria seat booking system</p>
      </div>

      <div style={styles.featuresGrid}>
        <div style={styles.featureCard}>
          <FaChair style={styles.icon} />
          <h3>Easy Booking</h3>
          <p>Book your preferred seats in our spacious cafeteria</p>
          <Link to="/book-seats" style={styles.button}>Book Now</Link>
        </div>

        <div style={styles.featureCard}>
          <FaUsers style={styles.icon} />
          <h3>Group Booking</h3>
          <p>Book for groups up to 20 people</p>
          <Link to="/book-seats" style={styles.button}>Book for Group</Link>
        </div>

        <div style={styles.featureCard}>
          <FaCalendar style={styles.icon} />
          <h3>My Bookings</h3>
          <p>View and manage your bookings</p>
          <Link to="/my-bookings" style={styles.button}>View Bookings</Link>
        </div>

        <div style={styles.featureCard}>
          <FaClock style={styles.icon} />
          <h3>Flexible Timing</h3>
          <p>Choose from various time slots</p>
          <Link to="/book-seats" style={styles.button}>Check Times</Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  welcome: {
    textAlign: 'center',
    marginBottom: '3rem',
    color: '#2c3e50',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
    padding: '1rem',
  },
  featureCard: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease',
    ':hover': {
      transform: 'translateY(-5px)',
    },
  },
  icon: {
    fontSize: '3rem',
    color: '#3498db',
    marginBottom: '1rem',
  },
  button: {
    display: 'inline-block',
    padding: '0.8rem 1.5rem',
    backgroundColor: '#3498db',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
    marginTop: '1rem',
    transition: 'background-color 0.3s',
    ':hover': {
      backgroundColor: '#2980b9',
    },
  },
};

export default Home;