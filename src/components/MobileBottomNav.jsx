import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, Flame, Video, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

export const MobileBottomNav = () => {
  const location = useLocation();
  const { totalItemsCount } = useCart();
  const { t } = useLanguage();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    {
      path: '/',
      label: t('home', 'Home'),
      icon: Home,
    },
    {
      path: '/products',
      label: t('products', 'Products'),
      icon: ShoppingBag,
    },
    {
      path: '/reels',
      label: t('reelsNav', 'Reels'),
      icon: Video,
      badge: 'HOT',
    },
    {
      path: '/offers',
      label: t('offers', 'Offers'),
      icon: Flame,
    },
    {
      path: '/cart',
      label: t('cart', 'Cart'),
      icon: ShoppingCart,
      countBadge: totalItemsCount,
    },
  ];

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Bottom Navigation">
      <div className="mobile-bottom-nav-container">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`mobile-nav-item ${active ? 'active' : ''}`}
            >
              <div className="mobile-nav-icon-wrapper">
                <Icon size={22} strokeWidth={active ? 2.5 : 1.8} color={active ? 'var(--crimson-red)' : '#64748b'} />
                
                {/* Reels HOT Badge Pill */}
                {item.badge && (
                  <span className="mobile-nav-hot-badge">{item.badge}</span>
                )}

                {/* Cart Count Badge */}
                {item.countBadge > 0 && (
                  <span className="mobile-nav-count-badge">{item.countBadge}</span>
                )}
              </div>
              <span className="mobile-nav-label" style={{ color: active ? 'var(--crimson-red)' : '#64748b', fontWeight: active ? 800 : 600 }}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};


