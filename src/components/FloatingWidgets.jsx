import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Instagram, Facebook, Youtube, Phone, MessageSquare, 
  ChevronDown, ChevronUp 
} from 'lucide-react';
import { FloatingCartPill } from './FloatingCartPill';
import { FlyingCartParticles } from './FlyingCartParticles';
import { useWebControl } from '../context/WebControlContext';

export const FloatingWidgets = () => {
  const location = useLocation();
  const [socialExpanded, setSocialExpanded] = useState(false);
  const { formattedWhatsapp, formattedPhone, phone, whatsapp, instagramLink, facebookLink, shopName } = useWebControl();

  const phoneNum = phone || whatsapp || '9876543210';
  const cleanPhone = String(phoneNum).replace(/\D/g, '');

  // Hide widgets on reels, cart, and checkout flow pages
  const hideCartPillPaths = ['/reels', '/cart', '/checkout', '/order-summary', '/payment-success', '/payment-failed', '/order-confirmation'];
  const isHideCartPill = hideCartPillPaths.some(path => location.pathname.startsWith(path));

  return (
    <>
      {/* 1. Flying Particles Layer */}
      <FlyingCartParticles />

      {/* 2. Animated Floating View Cart Pill Bar */}
      <FloatingCartPill />

      {/* 2. Floating Vertical Social Media Bar */}
      {!isHideCartPill && (
        <div className="floating-social-vertical-bar">
          {socialExpanded && (
            <>
              {/* Instagram */}
              <a 
                href={instagramLink || "https://instagram.com"} 
                target="_blank" 
                rel="noopener noreferrer"
                title="Instagram"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%,#d6249f 60%,#285AEB 90%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: '0 3px 8px rgba(214, 36, 159, 0.3)'
                }}
              >
                <Instagram size={20} color="#ffffff" />
              </a>

              {/* WhatsApp */}
              <a 
                href={`https://wa.me/${formattedWhatsapp || '919876543210'}?text=Hello%20${encodeURIComponent(shopName || 'SDS Crackers')}`} 
                target="_blank" 
                rel="noopener noreferrer"
                title="WhatsApp"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: '#25d366',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: '0 3px 8px rgba(37, 211, 102, 0.3)'
                }}
              >
                <MessageSquare size={19} color="#ffffff" />
              </a>

              {/* Facebook */}
              <a 
                href={facebookLink || "https://facebook.com"} 
                target="_blank" 
                rel="noopener noreferrer"
                title="Facebook"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: '#1877f2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: '0 3px 8px rgba(24, 119, 242, 0.3)'
                }}
              >
                <Facebook size={20} color="#ffffff" />
              </a>

              {/* Phone Call */}
              <a 
                href={`tel:+${formattedPhone || '917010922428'}`}
                title="Call Support"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: '0 3px 8px rgba(15, 23, 42, 0.3)'
                }}
              >
                <Phone size={18} color="#ffffff" />
              </a>

              {/* YouTube */}
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                title="YouTube Showcase"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: '#ff0000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: '0 3px 8px rgba(255, 0, 0, 0.3)'
                }}
              >
                <Youtube size={20} color="#ffffff" />
              </a>
            </>
          )}

          {/* Expand / Collapse Arrow Toggle Button */}
          <button
            type="button"
            onClick={() => setSocialExpanded(!socialExpanded)}
            title={socialExpanded ? "Collapse Social Bar" : "Expand Social Bar"}
            aria-label="Toggle Social Bar"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
            }}
          >
            {socialExpanded ? <ChevronDown size={18} color="#0f172a" /> : <ChevronUp size={18} color="#0f172a" />}
          </button>
        </div>
      )}
    </>
  );
};

