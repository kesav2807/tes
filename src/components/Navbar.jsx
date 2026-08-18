import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, Heart, Shield, PhoneCall, Menu, X, Globe, Search, 
  ChevronRight, ChevronDown, Home, ShoppingBag, Flame, Video, Package, MessageSquare, Tag, Sparkles, Phone, Gift
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useLanguage } from '../context/LanguageContext';
import { useWebControl } from '../context/WebControlContext';
import { useTheme } from '../context/ThemeContext';

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { totalItemsCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { t, language, setLanguage } = useLanguage();
  const { shopName, logoUrl, phone, whatsapp, formattedWhatsapp, formattedPhone } = useWebControl();
  const { activeTheme, textColor, primaryColor } = useTheme();

  const topBarTextColor = activeTheme?.text_color || textColor || 'var(--theme-text, #ffffff)';
  const topBarBgColor = activeTheme?.primary_color || primaryColor || 'var(--theme-primary, #10b981)';
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: t('home', 'Home'), icon: Home },
    { path: '/products', label: t('products', 'Products'), icon: ShoppingBag },
    { path: '/reels', label: t('reelsNav', 'Reels'), icon: Video },
    { path: '/offers', label: t('offers', 'Offers'), icon: Flame },
    { path: '/safety', label: t('safety', 'Safety'), icon: Shield },
    { path: '/order-tracking', label: t('trackOrder', 'Track Order'), icon: Package },
    { path: '/contact', label: t('contact', 'Contact'), icon: MessageSquare },
  ];

  const drawerNavLinks = [
    {
      path: '/',
      label: language === 'ta' ? 'முகப்பு' : 'Home',
      subtitle: 'Main store homepage',
      icon: Home,
      iconBg: '#ffe4e6',
      iconColor: 'var(--crimson-red)',
      titleColor: 'var(--crimson-red)',
      borderColor: '#fecdd3'
    },
    {
      path: '/products',
      label: language === 'ta' ? 'பொருட்கள்' : 'Products',
      subtitle: 'Full Sivakasi crackers list',
      icon: Sparkles,
      iconBg: '#fef9c3',
      iconColor: '#ca8a04',
      titleColor: 'var(--crimson-red)',
      borderColor: '#fecdd3'
    },
    {
      path: '/reels',
      label: 'Trending Reels',
      subtitle: 'Watch live cracker videos',
      badge: 'HOT',
      badgeBg: 'var(--crimson-red)',
      icon: Flame,
      iconBg: '#ffe4e6',
      iconColor: '#e11d48',
      titleColor: '#0f172a'
    },
    {
      path: '/offers',
      label: language === 'ta' ? 'சலுகைகள்' : 'Offers',
      subtitle: 'Diwali special family boxes',
      badge: '80% OFF',
      badgeBg: '#d97706',
      icon: Tag,
      iconBg: '#fef9c3',
      iconColor: '#ca8a04',
      titleColor: '#0f172a'
    },
    {
      path: '/safety',
      label: language === 'ta' ? 'பாதுகாப்பு' : 'Safety',
      subtitle: '100% Green safe fireworks tips',
      icon: Shield,
      iconBg: '#dcfce7',
      iconColor: '#16a34a',
      titleColor: '#0f172a'
    },
    {
      path: '/order-tracking',
      label: language === 'ta' ? 'ஆர்டர் கண்காணிப்பு' : 'Track Order',
      subtitle: 'Check live parcel status',
      icon: Package,
      iconBg: '#dbeafe',
      iconColor: '#2563eb',
      titleColor: '#0f172a'
    },
    {
      path: '/contact',
      label: language === 'ta' ? 'தொடர்பு' : 'Contact',
      subtitle: '24/7 Sivakasi helpline',
      icon: Phone,
      iconBg: '#f3e8ff',
      iconColor: '#9333ea',
      titleColor: '#0f172a'
    },
    {
      path: '/cart',
      label: language === 'ta' ? 'கூடை' : 'Cart',
      subtitle: 'View items & checkout',
      icon: ShoppingCart,
      iconBg: '#ffe4e6',
      iconColor: '#e11d48',
      titleColor: '#0f172a',
      countBadge: totalItemsCount || 0
    }
  ];

  return (
    <header className="site-header" style={{ position: 'sticky', top: 0, zIndex: 9990, width: '100%' }}>
      {/* Top Banner Ticker Bar */}
      <div className="header-top-bar" style={{ background: topBarBgColor, color: topBarTextColor, padding: '0.45rem 1rem' }}>
        <div className="container header-top-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', color: topBarTextColor }}>
          
          {/* Left: Language Selector Pill (Desktop Web View Only) */}
          <div 
            className="lang-selector-pill-topbar desktop-only"
            style={{
              position: 'relative',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              borderRadius: '9999px',
              padding: '0.25rem 0.75rem',
              color: topBarTextColor,
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            <Globe size={14} color={topBarTextColor} />
            <span style={{ color: topBarTextColor }}>{language === 'ta' ? 'தமிழ் (Tamil)' : 'English'}</span>
            <ChevronDown size={13} color={topBarTextColor} />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: 0,
                cursor: 'pointer',
                background: 'transparent',
                color: '#000000'
              }}
              aria-label="Select Language"
            >
              <option value="ta" style={{ color: '#0f172a' }}>தமிழ் (Tamil)</option>
              <option value="en" style={{ color: '#0f172a' }}>English</option>
            </select>
          </div>

          {/* Center: Promo text */}
          <div className="top-banner-promo" style={{ color: topBarTextColor, fontWeight: 800, fontSize: '0.825rem', textAlign: 'center', letterSpacing: '0.02em' }}>
            <span> {activeTheme?.banner_text || t('promoText', 'DEEPAVALI SALE: UP TO 50% OFF ON ALL COMBOS!')}</span>
          </div>
          
          {/* Right: Safety & Phone links */}
          <div className="top-banner-links desktop-only">
            <Link to="/safety" className="top-link-item yellow-highlight" style={{ color: topBarTextColor, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.35rem', textDecoration: 'none' }}>
              <Shield size={14} color={topBarTextColor} />
              <span style={{ color: topBarTextColor }}>{t('safetyGuide', 'Safety Guide')}</span>
            </Link>
            
            {(phone || formattedPhone) && (
              <a href={`tel:+${formattedPhone || '917010922428'}`} className="top-link-item yellow-highlight" style={{ color: topBarTextColor, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.35rem', textDecoration: 'none' }}>
                <PhoneCall size={14} color={topBarTextColor} />
                <span style={{ color: topBarTextColor }}>+91 {phone || formattedPhone.replace(/^91/, '')}</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar Bar */}
      <nav className="navbar" style={{ background: '#ffffff', borderBottom: '1.5px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)' }}>
        <div className="container navbar-container">
          
          <div className="mobile-only-left">
            <button
              className="mobile-drawer-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={20} color="#0f172a" /> : <Menu size={20} color="#0f172a" />}
            </button>
          </div>

          <Link to="/" className="logo-brand" onClick={() => setMobileMenuOpen(false)}>
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt={shopName || 'Shop Logo'} 
                loading="eager"
                className="logo-brand-img"
                style={{ maxHeight: '42px', width: 'auto', objectFit: 'contain', background: 'transparent', backgroundColor: 'transparent' }}
                onError={(e) => { 
                  e.target.style.display = 'none'; 
                }}
              />
            ) : (
              <div className="logo-brand-icon-box" style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #d90429 0%, #ef233c 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: 900, boxShadow: '0 2px 8px rgba(217, 4, 41, 0.25)' }}>
                <Sparkles size={22} color="#ffffff" />
              </div>
            )}
            <div className="brand-text-wrapper">
              <div className="brand-title" style={{ textTransform: 'capitalize' }}>{shopName || (language === 'ta' ? 'சிவகாசி கிராக்கர்ஸ்' : 'SDS CRACKERS')}</div>
              <div className="brand-subtitle" style={{ color: activeTheme?.primary_color || primaryColor || 'var(--theme-primary, #FF5722)' }}>{t('siteSub', 'SIVAKASI DIRECT STORE')}</div>
            </div>
          </Link>

          <ul className="nav-menu desktop-only-menu">
            {navLinks.map((item) => {
              const active = isActive(item.path);
              const activeNavColor = activeTheme?.primary_color || primaryColor || 'var(--theme-primary, #FF5722)';
              return (
                <li key={item.path}>
                  <Link 
                    to={item.path} 
                    className={`nav-link ${active ? 'active' : ''}`}
                    style={{
                      color: active ? activeNavColor : '#1e293b',
                      fontWeight: active ? 800 : 700,
                      fontSize: '0.95rem',
                      textDecoration: 'none'
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Desktop & Mobile Right Slot */}
          <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {/* Shopping Cart Nav Link (Mobile View Only) */}
            <Link 
              to="/cart" 
              className="action-btn circle-cart-btn mobile-only-btn" 
              title="Shopping Cart" 
              aria-label="View Shopping Cart"
            >
              <ShoppingCart size={19} color="#0f172a" />
              {totalItemsCount > 0 && (
                <span className="badge-count">{totalItemsCount}</span>
              )}
            </Link>

            {/* Shopping Cart Nav Link (Desktop Web View Only) */}
            <Link 
              to="/cart" 
              className="action-btn circle-cart-btn desktop-only-btn" 
              title="Shopping Cart" 
              aria-label="View Shopping Cart"
            >
              <ShoppingCart size={19} color="#0f172a" />
              {totalItemsCount > 0 && (
                <span className="badge-count">{totalItemsCount}</span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu Overlay & Drawer */}
      {mobileMenuOpen && (
        <>
          <div 
            className="mobile-menu-backdrop" 
            onClick={() => setMobileMenuOpen(false)} 
          />

          <div className="mobile-drawer open" style={{ background: '#ffffff', zIndex: 99999, position: 'fixed', top: 0, left: 0, bottom: 0, height: '100dvh', width: '78vw', maxWidth: '300px' }}>
            
            {/* 1. Dark Navy Top Header */}
            <div style={{ background: '#0f172a', padding: '1rem 1.25rem', borderBottom: '2.5px solid #f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
                {logoUrl ? (
                  <img 
                    src={logoUrl} 
                    alt={shopName || 'Shop Logo'} 
                    style={{ maxHeight: '38px', width: 'auto', objectFit: 'contain', borderRadius: '6px' }}
                    onError={(e) => { 
                      e.target.style.display = 'none'; 
                    }}
                  />
                ) : (
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #d90429 0%, #ef233c 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: 900 }}>
                    <Sparkles size={18} color="#ffffff" />
                  </div>
                )}
                <div>
                  <div style={{ color: '#ffffff', fontWeight: 900, fontSize: '1.15rem', lineHeight: 1.1, textTransform: 'capitalize' }}>
                    {shopName || (language === 'ta' ? 'சிவகாசி கிராக்கர்ஸ்' : 'SDS CRACKERS')}
                  </div>
                  <div style={{ color: '#f59e0b', fontWeight: 800, fontSize: '0.55rem', letterSpacing: '0.08em', marginTop: '2px' }}>SIVAKASI DIRECT STORE</div>
                </div>
              </Link>

              <button 
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.15)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={18} color="#ffffff" />
              </button>
            </div>

            {/* 2. Scrollable Body */}
            <div style={{ padding: '0 1.25rem 1.25rem', flex: 1, overflowY: 'auto' }}>
              
              {/* Sticky Top Header Block: Offer Card & Language Switcher Bar */}
              <div 
                style={{ 
                  position: 'sticky', 
                  top: 0, 
                  zIndex: 10, 
                  background: '#ffffff', 
                  paddingTop: '1.25rem', 
                  paddingBottom: '0.65rem',
                  marginBottom: '0.75rem',
                  boxShadow: '0 4px 12px rgba(255, 255, 255, 0.95)'
                }}
              >
                {/* Festive Diwali Offer Card Box */}
                <div style={{ background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 50%, #fef3c7 100%)', border: '1.5px solid #fed7aa', borderRadius: '16px', padding: '1.15rem 1.25rem', marginBottom: '0.85rem', boxShadow: '0 4px 14px var(--crimson-red-light, rgba(217, 4, 41, 0.04))' }}>
                  <span style={{ background: 'var(--crimson-red)', color: '#ffffff', fontSize: '0.7rem', fontWeight: 900, padding: '0.2rem 0.65rem', borderRadius: '9999px', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Gift size={12} /> DIWALI OFFER
                  </span>
                  <h3 style={{ color: '#0f172a', fontSize: '1.05rem', fontWeight: 900, margin: '0.45rem 0 0.2rem 0', lineHeight: 1.25 }}>
                    Direct Sivakasi Factory Sale!
                  </h3>
                  <p style={{ color: '#64748b', fontSize: '0.825rem', margin: 0, lineHeight: 1.45 }}>
                    Save up to 80% OFF Festive Fireworks & Combos
                  </p>
                  <Link to="/offers" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--crimson-red)', fontWeight: 800, fontSize: '0.85rem', display: 'inline-block', marginTop: '0.55rem', textDecoration: 'none' }}>
                    Explore Combos →
                  </Link>
                </div>

                {/* Language Switcher Bar */}
                <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '9999px', padding: '0.35rem 0.5rem 0.35rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Globe size={15} color="#475569" />
                    <span style={{ fontWeight: 800, fontSize: '0.825rem', color: '#334155' }}>Language:</span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <button
                      type="button"
                      onClick={() => setLanguage('ta')}
                      style={{
                        background: language === 'ta' ? 'var(--crimson-red)' : '#ffffff',
                        color: language === 'ta' ? '#ffffff' : '#334155',
                        border: '1px solid #cbd5e1',
                        borderRadius: '9999px',
                        padding: '0.25rem 0.65rem',
                        fontSize: '0.775rem',
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                    >
                      தமிழ்
                    </button>
                    <button
                      type="button"
                      onClick={() => setLanguage('en')}
                      style={{
                        background: language === 'en' ? 'var(--crimson-red)' : '#ffffff',
                        color: language === 'en' ? '#ffffff' : '#334155',
                        border: '1px solid #cbd5e1',
                        borderRadius: '9999px',
                        padding: '0.25rem 0.75rem',
                        fontSize: '0.775rem',
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                    >
                      ENG
                    </button>
                    <button
                      type="button"
                      onClick={() => setLanguage('both')}
                      style={{
                        background: language === 'both' ? 'var(--crimson-red)' : '#ffffff',
                        color: language === 'both' ? '#ffffff' : '#334155',
                        border: '1px solid #cbd5e1',
                        borderRadius: '9999px',
                        padding: '0.25rem 0.65rem',
                        fontSize: '0.775rem',
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                    >
                      இருமொழி
                    </button>
                  </div>
                </div>
              </div>

              {/* Nav Links Cards List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {drawerNavLinks.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      style={{
                        background: '#ffffff',
                        border: item.borderColor ? `1.5px solid ${item.borderColor}` : (active ? '1.5px solid #fecdd3' : '1.5px solid #e2e8f0'),
                        borderRadius: '16px',
                        padding: '0.85rem 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        textDecoration: 'none',
                        boxShadow: active ? '0 4px 14px var(--crimson-red-light, rgba(217, 4, 41, 0.08))' : '0 2px 6px rgba(0,0,0,0.02)',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: item.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Icon size={20} color={item.iconColor} />
                        </div>

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <span style={{ fontWeight: 900, fontSize: '0.95rem', color: item.titleColor || (active ? 'var(--crimson-red)' : '#0f172a') }}>
                              {item.label}
                            </span>
                            {item.badge && (
                              <span style={{ background: item.badgeBg || 'var(--crimson-red)', color: '#ffffff', fontSize: '0.625rem', fontWeight: 900, padding: '0.1rem 0.45rem', borderRadius: '9999px', textTransform: 'uppercase' }}>
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.775rem', color: '#64748b', marginTop: '1px' }}>
                            {item.subtitle}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {item.countBadge > 0 && (
                          <span style={{ background: 'var(--crimson-red)', color: '#ffffff', fontSize: '0.725rem', fontWeight: 900, width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {item.countBadge}
                          </span>
                        )}
                        <ChevronRight size={16} color="#cbd5e1" />
                      </div>
                    </Link>
                  );
                })}
              </div>

            </div>

            {/* 3. Sticky Bottom Action Buttons */}
            <div style={{ padding: '1rem 1.25rem', borderTop: '1.5px solid #e2e8f0', background: '#ffffff', display: 'flex', gap: '0.75rem', zIndex: 10 }}>
              <a href={`tel:+${formattedPhone || '917010922428'}`} style={{ flex: 1, background: '#0f172a', color: '#ffffff', borderRadius: '12px', padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem', textDecoration: 'none', fontWeight: 800, fontSize: '0.9rem', boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)' }}>
                <Phone size={16} color="#ffffff" /> Call Store
              </a>
              <a href={`https://wa.me/${formattedWhatsapp || '919876543210'}?text=Hello%20${encodeURIComponent(shopName || 'SDS Crackers')}`} target="_blank" rel="noopener noreferrer" style={{ flex: 1, background: '#25d366', color: '#ffffff', borderRadius: '12px', padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem', textDecoration: 'none', fontWeight: 800, fontSize: '0.9rem', boxShadow: '0 4px 12px rgba(37, 211, 102, 0.25)' }}>
                <MessageSquare size={16} color="#ffffff" /> WhatsApp
              </a>
            </div>

          </div>
        </>
      )}
    </header>
  );
};




