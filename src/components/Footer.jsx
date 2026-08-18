import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, Truck, Clock, Award, Phone, Mail, MapPin, 
  MessageSquare, Heart, Instagram, Facebook, Youtube, Sparkles, CheckCircle2, Banknote
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useWebControl } from '../context/WebControlContext';
import { useTheme } from '../context/ThemeContext';

export const Footer = () => {
  const { language, t } = useLanguage();
  const { 
    shopName, shopNameTa, logoUrl, shopAddress, shopAddressTa, phone, whatsapp, email, 
    description, descriptionTa, copyrightNotice, facebookLink, instagramLink, youtubeLink,
    formattedWhatsapp, footerData
  } = useWebControl();
  const { activeTheme, secondaryColor, primaryColor } = useTheme();

  // Primary Color from API / Theme for Footer Background
  const targetFooter = Array.isArray(footerData) ? footerData[0] : (footerData?.data ? (Array.isArray(footerData.data) ? footerData.data[0] : footerData.data) : footerData);
  const footerPrimary = activeTheme?.primary_color || targetFooter?.primary_color || targetFooter?.footer_primary_color || primaryColor || 'var(--theme-primary, #FFC107)';
  const footerSecondary = activeTheme?.secondary_color || targetFooter?.secondary_color || secondaryColor || 'var(--theme-secondary, #d90429)';

  const currentYear = new Date().getFullYear();
  const displayBrandName = (language === 'ta' && shopNameTa ? shopNameTa : shopName) || 'SDS CRACKERS SIVAKASI';
  const displayAddress = (language === 'ta' && shopAddressTa ? shopAddressTa : shopAddress) || 'Sivakasi Main Road, Sivakasi, Tamil Nadu 626123';
  const displayDescription = (language === 'ta' && descriptionTa ? descriptionTa : description) || 'Buy 100% genuine CSIR-NEERI certified green crackers, sparklers, flower pots, rockets, and festive combo packs online directly from Sivakasi factory outlet.';

  const formattedSupportPhone = phone || '7010922428';
  const whatsappNo = formattedWhatsapp || '919876543210';

  return (
    <footer className="site-footer" style={{ background: footerPrimary, color: '#ffffff' }}>
      {/* Festive Glowing Gradient Accent Bar */}
      <div style={{ height: '4px', background: `linear-gradient(90deg, ${footerPrimary} 0%, ${footerSecondary} 50%, ${footerPrimary} 100%)` }} />

      <div className="container site-footer-container">
        
        {/* 1. Feature Highlights Bar */}
        <div className="site-footer-features-grid">
          <div className="site-footer-feature-card" style={{ background: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.18)' }}>
            <Award size={22} color="#f59e0b" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ color: '#ffffff', fontSize: '0.875rem', fontWeight: 800 }}>100% Green Crackers</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.88)' }}>CSIR-NEERI Certified Safe</div>
            </div>
          </div>

          <div className="site-footer-feature-card" style={{ background: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.18)' }}>
            <Truck size={22} color="#4ade80" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ color: '#ffffff', fontSize: '0.875rem', fontWeight: 800 }}>Direct Sivakasi Shipping</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.88)' }}>Fast Factory Doorstep Express</div>
            </div>
          </div>

          <div className="site-footer-feature-card" style={{ background: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.18)' }}>
            <Clock size={22} color="#ff4d4d" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ color: '#ffffff', fontSize: '0.875rem', fontWeight: 800 }}>Live Order Tracking</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.88)' }}>Real-time shipment status</div>
            </div>
          </div>

          <div className="site-footer-feature-card" style={{ background: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.18)' }}>
            <ShieldCheck size={22} color="#60a5fa" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ color: '#ffffff', fontSize: '0.875rem', fontWeight: 800 }}>Safe Waterproof Packing</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.88)' }}>Heavy protective lining</div>
            </div>
          </div>
        </div>

        {/* 2. Main Footer Navigation Columns */}
        <div className="site-footer-nav-grid">
          {/* Brand Info Column */}
          <div className="site-footer-col site-footer-col-brand">
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', marginBottom: '0.85rem' }}>
              <div style={{ background: '#ffffff', padding: '4px 8px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '40px', minHeight: '40px', boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
                {logoUrl ? (
                  <img 
                    src={logoUrl} 
                    alt={displayBrandName} 
                    style={{ height: '34px', width: 'auto', objectFit: 'contain' }} 
                    onError={(e) => { e.target.style.display = 'none'; }} 
                  />
                ) : (
                  <Sparkles size={22} color={footerSecondary} />
                )}
              </div>
              <div>
                <div style={{ fontWeight: 900, fontSize: '1.2rem', color: '#ffffff', lineHeight: 1.1, letterSpacing: '-0.01em' }}>{displayBrandName}</div>
                <div style={{ fontSize: '0.65rem', color: '#f59e0b', letterSpacing: '0.12em', fontWeight: 800, marginTop: '3px' }}>SIVAKASI FACTORY OUTLET</div>
              </div>
            </Link>

            <p style={{ fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '1.15rem', color: 'rgba(255, 255, 255, 0.92)' }}>
              {displayDescription}
            </p>

            {/* Social Media Links */}
            <div style={{ display: 'flex', gap: '0.55rem', alignItems: 'center' }}>
              {instagramLink && (
                <a href={instagramLink} target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%,#d6249f 60%,#285AEB 90%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
                  <Instagram size={16} />
                </a>
              )}
              <a href={`https://wa.me/${whatsappNo}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Support" style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
                <MessageSquare size={15} />
              </a>
              {facebookLink && (
                <a href={facebookLink} target="_blank" rel="noopener noreferrer" aria-label="Facebook" style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#1877f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
                  <Facebook size={16} />
                </a>
              )}
              {youtubeLink && (
                <a href={youtubeLink} target="_blank" rel="noopener noreferrer" aria-label="YouTube" style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ff0000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
                  <Youtube size={16} />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="site-footer-col site-footer-col-links">
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 800, marginBottom: '0.85rem', marginTop: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {language === 'ta' ? 'விரைவு இணைப்புகள்' : 'Quick Navigation'}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
              <li><Link to="/" className="footer-hover-link">{language === 'ta' ? 'முகப்பு' : 'Home'}</Link></li>
              <li><Link to="/products" className="footer-hover-link">{language === 'ta' ? 'பட்டாசுகள் பட்டியல்' : 'Crackers Catalogue'}</Link></li>
              <li><Link to="/offers" className="footer-hover-link">{language === 'ta' ? 'சலுகைகள் & காம்போக்கள்' : 'Festival Offers & Combos'}</Link></li>
              <li><Link to="/reels" className="footer-hover-link">{language === 'ta' ? 'வீடியோ ரீல்ஸ்' : 'Video Reels'}</Link></li>
              <li><Link to="/safety" className="footer-hover-link">{language === 'ta' ? 'பாதுகாப்பு வழிகாட்டி' : 'Safety Checklist'}</Link></li>
            </ul>
          </div>

          {/* Customer Care Column */}
          <div className="site-footer-col site-footer-col-care">
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 800, marginBottom: '0.85rem', marginTop: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {language === 'ta' ? 'வாடிக்கையாளர் சேவை' : 'Customer Care'}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
              <li><Link to="/cart" className="footer-hover-link">{language === 'ta' ? 'கார்ட்டைப் பார்க்க' : 'View Shopping Cart'}</Link></li>
              <li><Link to="/order-tracking" className="footer-hover-link" style={{ color: '#f59e0b', fontWeight: 800 }}>{language === 'ta' ? 'நேரடி ஆர்டர் டிராக்கிங்' : 'Track Order Status'}</Link></li>
              <li><Link to="/contact" className="footer-hover-link">{language === 'ta' ? 'தொடர்பு கொள்ள' : 'Contact Support'}</Link></li>
              <li>
                <a href={`https://wa.me/${whatsappNo}`} target="_blank" rel="noopener noreferrer" className="footer-hover-link" style={{ color: '#4ade80', fontWeight: 800 }}>
                  <MessageSquare size={14} /> {language === 'ta' ? 'வாட்ஸ்அப் உதவி' : 'WhatsApp Instant Help'}
                </a>
              </li>
            </ul>
          </div>

          {/* Store Outlet Contact Column */}
          <div className="site-footer-col site-footer-col-contact">
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 800, marginBottom: '0.85rem', marginTop: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {language === 'ta' ? 'கடை முகவரி' : 'Store Contact'}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.92)' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem', lineHeight: 1.4 }}>
                <MapPin size={16} color="#ff4d4d" style={{ flexShrink: 0, marginTop: '2px' }} /> 
                <span style={{ color: 'rgba(255, 255, 255, 0.92)' }}>{displayAddress}</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <Phone size={15} color="#4ade80" style={{ flexShrink: 0 }} /> 
                <a href={`tel:${formattedSupportPhone}`} style={{ color: '#ffffff', textDecoration: 'none', fontWeight: 800 }}>+91 {formattedSupportPhone}</a>
              </li>
              {email && (
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                  <Mail size={15} color="#60a5fa" style={{ flexShrink: 0 }} /> 
                  <span style={{ color: 'rgba(255, 255, 255, 0.92)' }}>{email}</span>
                </li>
              )}
              <li style={{ marginTop: '0.35rem' }}>
                <span style={{ background: 'rgba(245, 158, 11, 0.2)', border: '1px solid rgba(245, 158, 11, 0.4)', color: '#f59e0b', padding: '0.25rem 0.65rem', borderRadius: '9999px', fontSize: '0.725rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                  <CheckCircle2 size={13} />
                  <span>Licensed Sivakasi Outlet</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* 3. Bottom Bar */}
        <div className="site-footer-bottom-bar" style={{ borderColor: 'rgba(255, 255, 255, 0.16)', color: 'rgba(255, 255, 255, 0.92)' }}>
          <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.92)', fontWeight: 600 }}>
            {copyrightNotice || `© ${currentYear} ${displayBrandName}. All Rights Reserved.`}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {/* COD Cash on Delivery */}
            <div style={{ background: '#ffffff', color: '#0f172a', padding: '0.25rem 0.6rem', borderRadius: '7px', fontSize: '0.725rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.35rem', boxShadow: '0 2px 6px rgba(0,0,0,0.18)' }}>
              <Banknote size={14} color="#059669" />
              <span>COD</span>
            </div>

            {/* Google Pay GPay */}
            <div style={{ background: '#ffffff', color: '#1e293b', padding: '0.25rem 0.6rem', borderRadius: '7px', fontSize: '0.725rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.35rem', boxShadow: '0 2px 6px rgba(0,0,0,0.18)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              <span>GPay</span>
            </div>

            {/* PhonePe */}
            <div style={{ background: '#ffffff', color: '#5f259f', padding: '0.25rem 0.6rem', borderRadius: '7px', fontSize: '0.725rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.35rem', boxShadow: '0 2px 6px rgba(0,0,0,0.18)' }}>
              <div style={{ background: '#5f259f', color: '#ffffff', borderRadius: '50%', width: '15px', height: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.55rem', fontWeight: 900, flexShrink: 0 }}>
                पे
              </div>
              <span>PhonePe</span>
            </div>

            {/* BHIM UPI */}
            <div style={{ background: '#ffffff', color: '#0f172a', padding: '0.25rem 0.6rem', borderRadius: '7px', fontSize: '0.725rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.35rem', boxShadow: '0 2px 6px rgba(0,0,0,0.18)' }}>
              <span style={{ color: '#0083ca', fontWeight: 900, fontStyle: 'italic', fontSize: '0.75rem', letterSpacing: '-0.02em' }}>UPI</span>
            </div>

            {/* Visa & Credit/Debit Cards */}
            <div style={{ background: '#ffffff', color: '#1e293b', padding: '0.25rem 0.6rem', borderRadius: '7px', fontSize: '0.725rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.35rem', boxShadow: '0 2px 6px rgba(0,0,0,0.18)' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                <line x1="1" y1="10" x2="23" y2="10"></line>
              </svg>
              <span>Cards</span>
            </div>

            <span style={{ color: 'rgba(255,255,255,0.3)', margin: '0 0.1rem' }}>|</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#ffffff', fontWeight: 800 }}>
              Crafted with <Heart size={13} color="#ff4d4d" fill="#ff4d4d" /> for Diwali
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
