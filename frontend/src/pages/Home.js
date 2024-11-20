import React from 'react';
import { Link } from 'react-router-dom';
import { FaChair, FaUsers, FaCalendar, FaClock, FaCoins } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div style={styles.container}>
      <div style={styles.welcome}>
        <h1 style={styles.welcomeTitle}>Welcome to Blu-Reserve, {user?.username}!</h1>
        <p style={styles.welcomeSubtitle}>Your premium cafeteria seat booking system</p>
        <div style={styles.balance}>
          <FaCoins style={styles.coinIcon} />
          <span>Balance: {user?.blu_dollars} Blu Dollars</span>
        </div>
      </div>

      <div style={styles.featuresGrid}>
        <div style={styles.featureCard}>
          <FaChair style={styles.icon} />
          <h3 style={styles.cardTitle}>Quick Booking</h3>
          <p style={styles.cardDescription}>Book your preferred seats instantly</p>
          <Link to="/book-seats" style={styles.button}>Book Now</Link>
        </div>

        <div style={styles.featureCard}>
          <FaUsers style={styles.icon} />
          <h3 style={styles.cardTitle}>Group Booking</h3>
          <p style={styles.cardDescription}>Book for groups up to 20 people</p>
          <Link to="/book-seats" style={styles.button}>Book for Group</Link>
        </div>

        <div style={styles.featureCard}>
          <FaCalendar style={styles.icon} />
          <h3 style={styles.cardTitle}>My Bookings</h3>
          <p style={styles.cardDescription}>View and manage your bookings</p>
          <Link to="/my-bookings" style={styles.button}>View Bookings</Link>
        </div>

        <div style={styles.featureCard}>
          <FaClock style={styles.icon} />
          <h3 style={styles.cardTitle}>Flexible Timing</h3>
          <p style={styles.cardDescription}>Multiple time slots available</p>
          <Link to="/book-seats" style={styles.button}>Check Times</Link>
        </div>
      </div>

      <div style={styles.quickStats}>
        <div style={styles.statCard}>
          <h4 style={styles.statTitle}>Available Seats</h4>
          <p style={styles.statValue}>50+</p>
        </div>
        <div style={styles.statCard}>
          <h4 style={styles.statTitle}>Operating Hours</h4>
          <p style={styles.statValue}>9 AM - 9 PM</p>
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
    minHeight: '90vh',
    backgroundColor: '#f8f9fa',
  },
  welcome: {
    textAlign: 'center',
    marginBottom: '3rem',
    padding: '2rem',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  welcomeTitle: {
    color: '#2c3e50',
    fontSize: '2.5rem',
    marginBottom: '0.5rem',
  },
  welcomeSubtitle: {
    color: '#7f8c8d',
    fontSize: '1.2rem',
    marginBottom: '1rem',
  },
  balance: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    color: '#2c3e50',
    fontSize: '1.2rem',
    fontWeight: 'bold',
  },
  coinIcon: {
    color: '#f1c40f',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
    marginBottom: '3rem',
  },
  featureCard: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '12px',
    textAlign: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
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
  cardTitle: {
    color: '#2c3e50',
    fontSize: '1.5rem',
    marginBottom: '1rem',
  },
  cardDescription: {
    color: '#7f8c8d',
    marginBottom: '1.5rem',
    lineHeight: '1.5',
  },
  button: {
    display: 'inline-block',
    padding: '0.8rem 1.5rem',
    backgroundColor: '#3498db',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    ':hover': {
      backgroundColor: '#2980b9',
      transform: 'translateY(-2px)',
    },
  },
  quickStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '2rem',
    marginTop: '3rem',
  },
  statCard: {
    backgroundColor: '#2c3e50',
    padding: '1.5rem',
    borderRadius: '12px',
    textAlign: 'center',
    color: 'white',
  },
  statTitle: {
    fontSize: '1.1rem',
    marginBottom: '0.5rem',
    opacity: 0.9,
  },
  statValue: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
  }
};

export default Home;