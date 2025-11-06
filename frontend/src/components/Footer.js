import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => (
  <footer className="footer-container">
    <div className="footer-content">
      <div className="footer-brand">
        <h3>GHORBARI</h3>
        <p>&copy; {new Date().getFullYear()} Ghorbari. All rights reserved.</p>
      </div>
      <div className="footer-links">
        <Link to="/">Home</Link>
        <Link to="/properties">Properties</Link>
        <Link to="/rentals">Rentals</Link>
        <Link to="/faq">FAQ</Link>
        <Link to="/contact">Contact</Link>
      </div>
      <div className="footer-social">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
      </div>
    </div>
  </footer>
);

export default Footer;