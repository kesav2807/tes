import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

export const FloatingCartPill = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItemsCount, subtotal, pillBumpTrigger } = useCart();
  const { t } = useLanguage();
  const controls = useAnimation();
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  // Hide floating cart pill when cart is empty or when on cart/checkout/product details pages
  const hidePaths = ['/cart', '/checkout', '/order-summary', '/payment-success', '/payment-failed', '/order-confirmation', '/reels', '/product'];
  const isHidePage = hidePaths.some(path => location.pathname.startsWith(path));

  // IntersectionObserver to detect when footer is in view and hide floating cart pill so it never blocks footer text
  useEffect(() => {
    const checkObserver = () => {
      const footerEl = document.querySelector('.site-footer');
      if (!footerEl) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsFooterVisible(entry.isIntersecting);
        },
        { threshold: 0.05 } // Hide pill as soon as footer top appears
      );

      observer.observe(footerEl);
      return () => observer.disconnect();
    };

    const timer = setTimeout(checkObserver, 300);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Trigger bounce animation when items are added or quantity changes
  useEffect(() => {
    if (pillBumpTrigger > 0 && totalItemsCount > 0) {
      controls.start({
        scale: [1, 1.12, 0.96, 1.04, 1],
        y: [0, -8, 2, -3, 0],
        transition: { duration: 0.45, ease: 'easeOut' }
      });
    }
  }, [pillBumpTrigger, totalItemsCount, controls]);

  return (
    <AnimatePresence>
      {totalItemsCount > 0 && !isHidePage && !isFooterVisible && (
        <div
          style={{
            position: 'fixed',
            left: '50%',
            bottom: '76px',
            transform: 'translateX(-50%)',
            zIndex: 9850,
            pointerEvents: 'auto',
          }}
        >
          <motion.div
            className="floating-cart-pill-animated"
            initial={{ y: 70, opacity: 0, scale: 0.85 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 70, opacity: 0, scale: 0.85 }}
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 380, damping: 24 }}
            onClick={() => navigate('/cart')}
            role="button"
            tabIndex={0}
            title={t('viewCart', 'View Cart')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              background: '#ffffff',
              border: '2.5px solid #d90429',
              borderRadius: '9999px',
              padding: '0.4rem 1.35rem 0.4rem 1.05rem',
              minWidth: '220px',
              maxWidth: '90vw',
              boxShadow: '0 10px 28px rgba(217, 4, 41, 0.3), 0 4px 12px rgba(0, 0, 0, 0.08)',
              cursor: 'pointer',
              userSelect: 'none',
              WebkitUserSelect: 'none',
            }}
          >
            {/* Left: Cart Icon with Red Badge + Cart Label */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <motion.div
                  animate={controls}
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <ShoppingCart size={22} color="#d90429" strokeWidth={2.4} />
                </motion.div>

                {/* Badge animation */}
                <AnimatePresence mode="wait">
                  <motion.span
                    key={totalItemsCount}
                    initial={{ scale: 0.5, rotate: -20 }}
                    animate={{ scale: [1, 1.45, 1], rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.35, ease: 'backOut' }}
                    style={{
                      position: 'absolute',
                      top: '-7px',
                      right: '-9px',
                      background: '#d90429',
                      color: '#ffffff',
                      fontSize: '0.65rem',
                      fontWeight: 900,
                      minWidth: '17px',
                      height: '17px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1.8px solid #ffffff',
                      boxShadow: '0 2px 6px rgba(217, 4, 41, 0.4)',
                    }}
                  >
                    {totalItemsCount}
                  </motion.span>
                </AnimatePresence>
              </div>

              <span
                style={{
                  color: '#d90429',
                  fontWeight: 800,
                  fontSize: '0.62rem',
                  marginTop: '1px',
                  lineHeight: 1,
                  letterSpacing: '0.01em',
                }}
              >
                {t('cart', 'Cart')}
              </span>
            </div>

            {/* Middle: Stacked "view cart" & "₹ [amount]" */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                lineHeight: 1.1,
                alignItems: 'flex-start',
                justifyContent: 'center',
              }}
            >
              <span
                style={{
                  color: '#d90429',
                  fontWeight: 800,
                  fontSize: '0.78rem',
                  letterSpacing: '-0.01em',
                }}
              >
                {t('viewCartLower', 'view cart')}
              </span>

              {/* Price bump animation */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={subtotal}
                  initial={{ opacity: 0.8, scale: 0.92 }}
                  animate={{ opacity: 1, scale: [1, 1.18, 1] }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  style={{
                    color: '#d90429',
                    fontWeight: 900,
                    fontSize: '1.25rem',
                    letterSpacing: '-0.03em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                  }}
                >
                  <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>₹</span>
                  <span>{subtotal}</span>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right: Arrow > */}
            <motion.div
              animate={{ x: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.25, ease: 'easeInOut' }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <ChevronRight size={24} color="#d90429" strokeWidth={3.2} />
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
