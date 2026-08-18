import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Star, Eye, Minus, Plus, Check, X, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { LazyImage } from './LazyImage';

export const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { cartItems, addToCart, updateQuantity } = useCart();
  const { activeTheme, primaryColor, secondaryColor, textColor } = useTheme();
  const { t, getText } = useLanguage();
  const [isJustAdded, setIsJustAdded] = React.useState(false);

  const ribbonBgColor = activeTheme?.primary_color || primaryColor || 'var(--theme-primary, #FFC107)';
  const secBgColor = activeTheme?.secondary_color || secondaryColor || 'var(--theme-secondary, #6366f1)';
  const secTextColor = activeTheme?.text_color || textColor || 'var(--theme-text, #ffffff)';

  const cartItem = cartItems.find(item => item.id === product.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const handleDecrease = (e) => {
    e.stopPropagation();
    updateQuantity(product.id, -1, e);
  };

  const handleIncrease = (e) => {
    e.stopPropagation();
    updateQuantity(product.id, 1, e);
  };

  const displayCode = product.code || product.productCode || (product.id ? `#${product.id}` : '');
  const hasStockCount = product.stockCount !== null && product.stockCount !== undefined;
  const isOutOfStock = product.inStock === false || (hasStockCount && Number(product.stockCount) <= 0);

  const handleAdd = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    setIsJustAdded(true);
    addToCart(product, 1, e);
    setTimeout(() => setIsJustAdded(false), 1100);
  };

  return (
    <motion.div
      className="product-card"
      style={{
        borderColor: ribbonBgColor,
      }}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      whileHover={{ y: -5, transition: { duration: 0.22, ease: 'easeOut' } }}
      transition={{ duration: 0.3 }}
    >
      <div className="product-image-area">
        <LazyImage src={product.image} alt={product.name} style={{ width: '100%', height: '100%' }} />
        {product.discount > 0 && (
          <motion.div
            className="discount-tag"
            style={{
              background: ribbonBgColor,
              color: secTextColor,
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {product.discount}% OFF
          </motion.div>
        )}
      </div>

      <div className="product-content">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.35rem', marginBottom: '0.25rem' }}>
          <div className="product-category-tag" style={{ margin: 0 }}>{getText(product, 'categoryName')}</div>
          {displayCode && (
            <span
              className="product-code-pill"
              style={{
                background: '#f1f5f9',
                color: '#334155',
                fontSize: '0.7rem',
                fontWeight: 800,
                padding: '0.12rem 0.45rem',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontFamily: 'monospace',
                letterSpacing: '0.02em',
                whiteSpace: 'nowrap'
              }}
              title={`Product Code: ${displayCode}`}
            >
              Code: {displayCode}
            </span>
          )}
        </div>

        <Link to={`/product/${product.id}`} className="product-title">
          {getText(product, 'name')}
        </Link>

        <div className="price-row">
          <span className="current-price" style={{ color: ribbonBgColor }}>₹{product.price}</span>
          {product.originalPrice > product.price && (
            <span className="original-price">₹{product.originalPrice}</span>
          )}
        </div>

        <div className="stock-status" style={{ color: !isOutOfStock ? '#16a34a' : '#dc2626', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', fontWeight: 700, margin: '0.3rem 0' }}>
          {!isOutOfStock ? (
            <>
              <Check size={14} color="#16a34a" /> 
              <span style={{ color: '#16a34a' }}>{t('inStock', 'In Stock')}</span>
              {hasStockCount && (
                <span style={{ fontSize: '0.74rem', color: '#475569', fontWeight: 800 }}>({product.stockCount} Pcs)</span>
              )}
            </>
          ) : (
            <>
              <X size={14} color="#dc2626" /> 
              <span style={{ color: '#dc2626' }}>{t('outOfStock', 'Out of Stock')}</span>
              {hasStockCount && (
                <span style={{ fontSize: '0.74rem', color: '#dc2626', fontWeight: 800 }}>({product.stockCount} Pcs)</span>
              )}
            </>
          )}
        </div>

        <div className="product-card-actions">
          <AnimatePresence mode="wait">
            {isOutOfStock ? (
              <button
                key="out-of-stock-btn"
                disabled
                className="add-cart-btn disabled-btn"
                style={{
                  background: '#f1f5f9',
                  color: '#94a3b8',
                  border: '1.5px solid #cbd5e1',
                  cursor: 'not-allowed',
                  opacity: 0.8,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  padding: '0.5rem 0.85rem',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '0.85rem'
                }}
              >
                <X size={15} color="#94a3b8" />
                <span>{t('outOfStock', 'Out of Stock')}</span>
              </button>
            ) : quantityInCart > 0 ? (
              <motion.div
                key="qty-controls"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.2 }}
                className="card-qty-control-pill"
              >
                <motion.button
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.7, rotate: -15 }}
                  onClick={handleDecrease}
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} color={ribbonBgColor} strokeWidth={2.5} />
                </motion.button>

                <AnimatePresence mode="wait">
                  <motion.span
                    key={quantityInCart}
                    initial={{ scale: 0.5, y: -6 }}
                    animate={{ scale: [0.7, 1.3, 1], y: 0 }}
                    exit={{ scale: 0.5, y: 6 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="qty-number"
                  >
                    {quantityInCart}
                  </motion.span>
                </AnimatePresence>

                <motion.button
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.7, rotate: 15 }}
                  onClick={handleIncrease}
                  aria-label="Increase quantity"
                >
                  <Plus size={14} color={ribbonBgColor} strokeWidth={2.5} />
                </motion.button>
              </motion.div>
            ) : (
              <motion.button
                key="add-btn"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.88, rotate: -2 }}
                className={`add-cart-btn ${isJustAdded ? 'btn-touch-active' : ''}`}
                style={{
                  background: ribbonBgColor,
                  color: secTextColor,
                }}
                onClick={handleAdd}
              >
                <motion.div 
                  animate={isJustAdded ? { rotate: [0, -15, 15, -10, 10, 0], scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.35 }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', color: secTextColor }}
                >
                  {isJustAdded ? <Check size={16} color={secTextColor} /> : <ShoppingCart size={15} color={secTextColor} />}
                  <span style={{ color: secTextColor }}>{isJustAdded ? 'Added!' : 'Add to Cart'}</span>
                </motion.div>
              </motion.button>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className="view-details-btn"
            onClick={() => navigate(`/product/${product.id}`)}
            title="View Details"
          >
            <Eye size={17} color="#475569" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
