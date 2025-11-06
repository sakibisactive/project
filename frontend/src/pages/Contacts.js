import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Contacts.css';

// Icons using Unicode or emoji
const CONTACT_SERVICES = [
  {
    id: 1,
    name: 'DEVELOPER',
    description: 'Find real estate companies and developers',
    icon: '🏢',
    path: '/contacts/developers',
    color: 'developer'
  },
  {
    id: 2,
    name: 'INTERIOR',
    description: 'Connect with interior design companies',
    icon: '🎨',
    path: '/contacts/interior',
    color: 'interior'
  },
  {
    id: 3,
    name: 'LEGAL SERVICE',
    description: 'Get legal assistance for property matters',
    icon: '⚖️',
    path: '/contacts/legal',
    color: 'legal'
  },
  {
    id: 4,
    name: 'MOVING SERVICE',
    description: 'Hire professional moving companies',
    icon: '🚚',
    path: '/contacts/moving',
    color: 'moving'
  },
  {
    id: 5,
    name: 'FIX',
    description: 'Connect with skilled workers (Plumber, Electrician, Sanitary)',
    icon: '🔧',
    path: '/contacts/technicians',
    color: 'fix'
  }
];

const Contacts = () => {
  const navigate = useNavigate();

  // Handle button click - navigate to respective pages
  const handleContactClick = (path) => {
    navigate(path);
  };

  return (
    <div className="contacts-container">
      {/* Header Section */}
      <div className="contacts-header">
        <h1>Our Services</h1>
        <p>Connect with professionals and service providers</p>
      </div>

      {/* 5 Big Buttons at Center */}
      <div className="contacts-buttons-container">
        {CONTACT_SERVICES.map((service) => (
          <button
            key={service.id}
            className={`service-button ${service.color}`}
            onClick={() => handleContactClick(service.path)}
            title={service.description}
          >
            <div className="button-icon">{service.icon}</div>
            <div className="button-name">{service.name}</div>
            <div className="button-description">{service.description}</div>
          </button>
        ))}
      </div>

      {/* Info Section */}
      <div className="contacts-info">
        <p>Click on any service to connect with trusted professionals</p>
      </div>
    </div>
  );
};

export default Contacts;
