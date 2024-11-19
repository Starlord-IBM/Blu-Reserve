import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import BookSeats from './pages/BookSeats';
import MyBookings from './pages/MyBookings';
import NavBar from './components/NavBar';

function App() {
  // Check if user is logged in
  const isAuthenticated = localStorage.getItem('token') !== null;

  return (
    <BrowserRouter>
      {isAuthenticated && <NavBar />}
      <Routes>
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/book-seats" /> : <Login />} 
        />
        <Route 
          path="/book-seats" 
          element={isAuthenticated ? <BookSeats /> : <Navigate to="/" />} 
        />
        <Route 
          path="/my-bookings" 
          element={isAuthenticated ? <MyBookings /> : <Navigate to="/" />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;