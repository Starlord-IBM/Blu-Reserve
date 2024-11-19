import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaChair, FaCalendar, FaSignOutAlt, FaUser } from 'react-icons/fa';

const NavBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>
        <Link to="/home" style={styles.logoLink}>
          <FaHome style={styles.logoIcon} />
          <span>Blu-Reserve</span>
        </Link>
      </div>
      
      <div style={styles.links}>
        <Link to="/home" style={styles.link}>
          <FaHome style={styles.icon} />
          <span>Home</span>
        </Link>
        
        <Link to="/book-seats" style={styles.link}>
          <FaChair style={styles.icon} />
          <span>Book Seats</span>
        </Link>
        
        <Link to="/my-bookings" style={styles.link}>
          <FaCalendar style={styles.icon} />
          <span>My Bookings</span>
        </Link>

        <button onClick={handleLogout} style={styles.logoutButton}>
          <FaSignOutAlt style={styles.icon} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#2c3e50',
    color: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  logoLink: {
    color: 'white',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  logoIcon: {
    fontSize: '1.8rem',
  },
  links: {
    display: 'flex',
    gap: '2rem',
    alignItems: 'center',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    transition: 'background-color 0.3s',
    ':hover': {
      backgroundColor: '#34495e',
    },
  },
  icon: {
    fontSize: '1.2rem',
  },
  logoutButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    fontSize: '1rem',
    ':hover': {
      backgroundColor: '#c0392b',
    },
  },
};

export default NavBar;