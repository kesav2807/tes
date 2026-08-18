import React from 'react';
import { useLocation } from 'react-router-dom';
import { useWebControl } from '../context/WebControlContext';

export const FloatingSocialMenu = () => {
  const location = useLocation();
  const { formattedWhatsapp, formattedPhone, phone, whatsapp, instagramLink, facebookLink, youtubeLink, shopName } = useWebControl();

  const phoneNum = phone || whatsapp || '9876543210';
  const cleanPhone = String(phoneNum).replace(/\D/g, '');

  // Hide floating social widget on Reels page to avoid blocking reel controls
  if (location.pathname === '/reels') {
    return null;
  }

  return (
    <div className="floating-social-widget" aria-label="Quick Social & Call Contact">
      <div className="social-pill-container">
        <div className="social-items-list">
          {/* 1. Instagram */}
          <a
            href={instagramLink || "https://www.instagram.com"}
            target="_blank"
            rel="noopener noreferrer"
            className="social-pill-btn inst-btn"
            title="Instagram"
            aria-label="Instagram"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>

          {/* 2. WhatsApp */}
          <a
            href={`https://wa.me/${formattedWhatsapp || '919876543210'}?text=Hi%20${encodeURIComponent(shopName || 'SDS Crackers')},%20I%20have%20an%20enquiry`}
            target="_blank"
            rel="noopener noreferrer"
            className="social-pill-btn whatsapp-btn"
            title="WhatsApp Chat"
            aria-label="WhatsApp"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
          </a>

          {/* 3. Facebook */}
          <a
            href={facebookLink || "https://www.facebook.com"}
            target="_blank"
            rel="noopener noreferrer"
            className="social-pill-btn facebook-btn"
            title="Facebook"
            aria-label="Facebook"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
            </svg>
          </a>

          {/* 4. Phone / Call */}
          <a
            href={`tel:+${formattedPhone || '917010922428'}`}
            className="social-pill-btn phone-btn"
            title="Call Us Now"
            aria-label="Call Us"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
          </a>

          {/* 5. YouTube */}
          <a
            href="https://www.youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-pill-btn youtube-btn"
            title="YouTube Channel"
            aria-label="YouTube"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
              <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#ffffff"></polygon>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};
