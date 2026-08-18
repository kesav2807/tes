import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProductById, getProducts } from '../services/productService';
import { getCategories } from '../services/categoryService';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { ProductCard } from '../components/ProductCard';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { Star, ShieldAlert, ShoppingCart, Minus, Plus, ArrowLeft, Check, X, Package, Loader2, Play } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LazyImage } from '../components/LazyImage';

export const ProductDetails = () => {
  const { id } = useParams();
  const { activeTheme, primaryColor, textColor } = useTheme();
  const pdPrimary = activeTheme?.primary_color || primaryColor || '#d90429';
  const pdTextColor = activeTheme?.text_color || textColor || '#ffffff';

  const [product, setProduct] = useState(null);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [categoryDetails, setCategoryDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [quantity, setQuantity] = useState(1);
  const [isJustAdded, setIsJustAdded] = useState(false);
  const { addToCart } = useCart();
  const { t, getText } = useLanguage();

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setActiveMediaIndex(0);

    const loadData = async () => {
      try {
        const fetchedProduct = await getProductById(id);
        const allProds = await getProducts();
        const categories = await getCategories();

        if (isMounted) {
          setProduct(fetchedProduct);

          if (fetchedProduct) {
            if (fetchedProduct.categoryId && categories && categories.length > 0) {
              const matchedCat = categories.find(c => String(c.id) === String(fetchedProduct.categoryId) || String(c.rawId) === String(fetchedProduct.categoryId));
              if (matchedCat) setCategoryDetails(matchedCat);
            }

            const related = allProds
              .filter(p => String(p.id) !== String(fetchedProduct.id) && String(p.rawId) !== String(fetchedProduct.rawId))
              .slice(0, 4);
            setRelatedProducts(related);
          }
        }
      } catch (err) {
        console.error("Error loading product details:", err);
        if (isMounted) {
          setProduct(null);
          setRelatedProducts([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const isOutOfStock = product ? (
    product.inStock === false || 
    (product.stockCount !== null && product.stockCount !== undefined && Number(product.stockCount) <= 0)
  ) : false;

  const handleAddToCart = (e) => {
    if (!product || isOutOfStock) return;
    setIsJustAdded(true);
    addToCart(product, quantity, e);
    setTimeout(() => setIsJustAdded(false), 1200);
  };

  if (isLoading) {
    return <SkeletonLoader type="details" />;
  }

  if (!product) {
    return (
      <div style={{ padding: '5rem 0', textAlign: 'center', minHeight: '60vh', background: '#f8fafc' }}>
        <h2>Product Not Found</h2>
        <Link to="/products" className="btn-primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
          Back to Products
        </Link>
      </div>
    );
  }

  const mediaItems = [];
  if (product.productImages && product.productImages.length > 0) {
    product.productImages.forEach(url => mediaItems.push({ type: 'image', url }));
  } else if (product.image) {
    mediaItems.push({ type: 'image', url: product.image });
  }

  if (product.productVideos && product.productVideos.length > 0) {
    product.productVideos.forEach(url => mediaItems.push({ type: 'video', url }));
  }

  const currentMedia = mediaItems[activeMediaIndex] || mediaItems[0] || { type: 'image', url: product.image };

  return (
    <div className="product-details-page-light" style={{ padding: '2.5rem 0 5rem', background: '#f8fafc', minHeight: '100vh', color: '#1e293b' }}>
      <div className="container">
        <Link 
          to="/products" 
          className="back-link" 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.4rem', 
            color: '#64748b', 
            fontWeight: 700, 
            fontSize: '0.9rem',
            marginBottom: '1.5rem',
            textDecoration: 'none',
            transition: 'color 0.2s ease'
          }}
        >
          <ArrowLeft size={16} color="#64748b" /> {t('products', 'Back to Products')}
        </Link>

        <div 
          style={{ 
            background: '#ffffff', 
            borderRadius: '24px', 
            padding: '2.25rem', 
            border: '1.5px solid #e2e8f0', 
            marginBottom: '3rem', 
            color: '#1e293b',
            boxShadow: '0 6px 24px rgba(0, 0, 0, 0.04)' 
          }} 
          className="product-details-grid"
        >
          <div>
            <div 
              style={{ 
                position: 'relative', 
                borderRadius: '16px', 
                overflow: 'hidden', 
                border: '1.5px solid #e2e8f0', 
                background: '#f8fafc' 
              }} 
              className="product-details-img-area"
            >
              {currentMedia.type === 'video' ? (
                <video 
                  src={currentMedia.url} 
                  controls 
                  autoPlay 
                  loop 
                  muted
                  style={{ width: '100%', height: '420px', objectFit: 'cover' }} 
                />
              ) : (
                <LazyImage 
                  src={currentMedia.url} 
                  alt={getText(product, 'name')} 
                  style={{ width: '100%', height: '420px', objectFit: 'cover' }} 
                />
              )}

              {product.discount > 0 && (
                <span 
                  className="discount-tag" 
                  style={{ 
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    background: pdPrimary,
                    color: pdTextColor,
                    fontWeight: 900,
                    fontSize: '0.85rem', 
                    padding: '0.35rem 0.85rem',
                    borderRadius: '9999px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  {product.discount}% {t('discountOff', 'OFF')}
                </span>
              )}
            </div>

            {mediaItems.length > 1 && (
              <div style={{ display: 'flex', gap: '0.65rem', marginTop: '0.85rem', overflowX: 'auto', paddingBottom: '0.35rem' }}>
                {mediaItems.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveMediaIndex(idx)}
                    style={{
                      border: (activeMediaIndex === idx) ? `2.5px solid ${pdPrimary}` : '1.5px solid #e2e8f0',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      padding: 0,
                      background: '#0f172a',
                      cursor: 'pointer',
                      width: '64px',
                      height: '64px',
                      flexShrink: 0,
                      position: 'relative'
                    }}
                  >
                    {item.type === 'video' ? (
                      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: '#ffffff' }}>
                        <Play size={18} color="#ffffff" fill="#ffffff" />
                        <span style={{ fontSize: '0.6rem', fontWeight: 800, marginTop: '2px' }}>VIDEO</span>
                      </div>
                    ) : (
                      <LazyImage src={item.url} alt={`Thumbnail ${idx+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="product-details-info">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
              <div style={{ fontSize: '0.8rem', color: pdPrimary, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span>{categoryDetails ? `${categoryDetails.icon} ${categoryDetails.name}` : getText(product, 'categoryName')}</span>
              </div>
              {(product.code || product.productCode) && (
                <span style={{ background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', padding: '0.15rem 0.55rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, fontFamily: 'monospace', letterSpacing: '0.02em' }}>
                  Code: {product.code || product.productCode}
                </span>
              )}
            </div>

            <h1 className="product-details-title" style={{ fontSize: '2.1rem', fontWeight: 900, margin: '0.4rem 0 0.85rem', color: '#0f172a', lineHeight: 1.25 }}>
              {getText(product, 'name')}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#d97706', fontWeight: 800, fontSize: '0.925rem' }}>
                <Star size={18} color="#d97706" fill="#d97706" /> {product.rating || 4.8}
              </div>
              <span style={{ color: '#cbd5e1' }}>|</span>
              <span style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>
                {product.reviewsCount || 36} {t('reviews', 'Customer Reviews')}
              </span>
              <span style={{ color: '#cbd5e1' }}>|</span>
              <span style={{ color: !isOutOfStock ? '#16a34a' : '#dc2626', background: !isOutOfStock ? '#dcfce7' : '#fee2e2', border: `1px solid ${!isOutOfStock ? '#bbf7d0' : '#fecdd3'}`, padding: '0.2rem 0.65rem', borderRadius: '9999px', fontWeight: 800, fontSize: '0.785rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                {!isOutOfStock ? <Check size={14} color="#16a34a" /> : <X size={14} color="#dc2626" />}
                {!isOutOfStock ? t('inStock', 'In Stock Direct from Sivakasi') : t('outOfStock', 'Out of Stock')}
                {product.stockCount !== null && product.stockCount !== undefined && (
                  <span> ({product.stockCount} Pcs)</span>
                )}
              </span>
            </div>

            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem', 
                marginBottom: '1.5rem', 
                background: '#ffffff', 
                padding: '1.25rem', 
                borderRadius: '16px', 
                border: '1.5px solid #e2e8f0',
                boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
              }}
            >
              <div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', textDecoration: product.originalPrice > product.price ? 'line-through' : 'none' }}>
                  {t('originalPrice', 'MRP')}: ₹{product.originalPrice}
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: pdPrimary }}>
                  ₹{product.price}
                </div>
              </div>

              {product.discount > 0 && (
                <div style={{ background: '#fff1f2', color: pdPrimary, padding: '0.4rem 0.85rem', borderRadius: '12px', fontWeight: 900, fontSize: '0.9rem', border: '1px solid #fecdd3' }}>
                  {product.discount}% OFF
                </div>
              )}
            </div>

            <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {getText(product, 'description')}
            </p>

            {/* If Combo Pack: Render Itemized Products List */}
            {product.isCombo && Array.isArray(product.comboProducts) && product.comboProducts.length > 0 && (
              <div 
                style={{ 
                  background: '#fff7ed', 
                  padding: '1.25rem', 
                  borderRadius: '16px', 
                  marginBottom: '1.5rem', 
                  border: '1.5px solid #fed7aa' 
                }}
              >
                <h4 style={{ fontSize: '1rem', fontWeight: 900, marginBottom: '0.85rem', color: '#9a3412', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Package size={18} color="#9a3412" /> Included Items in this Combo ({product.comboProducts.length} Varieties)
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {product.comboProducts.map((item, idx) => (
                    <div 
                      key={item.id || idx}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between', 
                        background: '#ffffff', 
                        padding: '0.65rem 0.85rem', 
                        borderRadius: '12px', 
                        border: '1px solid #ffedd5',
                        gap: '0.75rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <LazyImage 
                          src={item.image} 
                          alt={item.name} 
                          style={{ width: '42px', height: '42px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }} 
                        />
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>{item.name}</div>
                          {item.packQuantity && (
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.packQuantity}</div>
                          )}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ background: '#ea580c', color: '#ffffff', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '9999px', display: 'inline-block' }}>
                          Qty: {item.quantity}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Specifications Box */}
            <div 
              style={{ 
                marginBottom: '1.5rem', 
                background: '#f8fafc', 
                padding: '1.25rem 1.35rem', 
                borderRadius: '16px', 
                border: '1.5px solid #e2e8f0' 
              }}
            >
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '0.75rem', color: '#0f172a' }}>
                {t('specifications', 'Product Specifications')}
              </h4>
              <ul className="form-row-2col" style={{ listStyle: 'none', margin: 0, padding: 0, fontSize: '0.875rem' }}>
                {(product.code || product.productCode) && (
                  <li style={{ marginBottom: '0.4rem' }}>
                    <strong style={{ color: '#334155' }}>Product Code: </strong>
                    <span style={{ color: '#0f172a', fontWeight: 800, fontFamily: 'monospace' }}>{product.code || product.productCode}</span>
                  </li>
                )}
                <li style={{ marginBottom: '0.4rem' }}>
                  <strong style={{ color: '#334155' }}>Stock Count: </strong>
                  <span style={{ color: product.inStock !== false ? '#16a34a' : '#dc2626', fontWeight: 800 }}>
                    {product.stockCount !== null && product.stockCount !== undefined ? `${product.stockCount} Pcs Available` : (product.inStock !== false ? 'Available in Stock' : 'Out of Stock')}
                  </span>
                </li>
                {product.packQuantity && (
                  <li style={{ marginBottom: '0.4rem' }}>
                    <strong style={{ color: '#334155' }}>Pack Quantity: </strong>
                    <span style={{ color: '#64748b' }}>{product.packQuantity}</span>
                  </li>
                )}
                {product.height && (
                  <li style={{ marginBottom: '0.4rem' }}>
                    <strong style={{ color: '#334155' }}>Height: </strong>
                    <span style={{ color: '#64748b' }}>{product.height}</span>
                  </li>
                )}
                {product.type && (
                  <li style={{ marginBottom: '0.4rem' }}>
                    <strong style={{ color: '#334155' }}>Type: </strong>
                    <span style={{ color: '#64748b' }}>{product.type}</span>
                  </li>
                )}
                {Object.entries(product.specifications || {}).map(([key, val]) => {
                  if (key.endsWith('Ta') || key === 'packContent' || key === 'height' || key === 'type') return null;
                  const valTa = product.specifications[`${key}Ta`];
                  const displayVal = getText({ [key]: val, [`${key}Ta`]: valTa }, key);
                  return (
                    <li key={key} style={{ marginBottom: '0.4rem' }}>
                      <strong style={{ color: '#334155' }}>{key}: </strong>
                      <span style={{ color: '#64748b' }}>{displayVal}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Safety Alert Box */}
            <div 
              style={{ 
                background: '#fff1f2', 
                border: '1.5px solid #fecdd3', 
                color: '#99001c', 
                padding: '1rem 1.25rem', 
                borderRadius: '16px', 
                marginBottom: '1.75rem', 
                display: 'flex', 
                gap: '0.75rem', 
                alignItems: 'center' 
              }}
            >
              <ShieldAlert size={22} color="#d90429" />
              <div style={{ fontSize: '0.85rem', lineHeight: 1.45 }}>
                <strong style={{ color: '#99001c' }}>{t('safetyInstructions', 'Safety Precautions')}: </strong>
                <span>{getText(product, 'safetyTips')}</span>
              </div>
            </div>

            {/* Quantity & Add to Cart Buttons */}
            <div className="product-actions-group" style={{ display: 'flex', gap: '0.85rem', alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Quantity Selector */}
              <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #cbd5e1', borderRadius: '14px', background: '#f8fafc', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', opacity: isOutOfStock ? 0.5 : 1 }}>
                <motion.button
                  disabled={isOutOfStock}
                  whileHover={isOutOfStock ? {} : { backgroundColor: '#ffe4e6' }}
                  whileTap={isOutOfStock ? {} : { scale: 0.75, rotate: -15 }}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ padding: '0.75rem 1rem', background: '#f1f5f9', border: 'none', color: '#0f172a', cursor: isOutOfStock ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', transition: 'background 0.2s ease' }}
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} color={isOutOfStock ? '#94a3b8' : '#d90429'} strokeWidth={2.5} />
                </motion.button>
                <motion.span 
                  key={quantity}
                  initial={{ scale: 0.7, y: -4 }}
                  animate={{ scale: [0.8, 1.25, 1], y: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ padding: '0 1.15rem', fontWeight: 900, color: '#0f172a', fontSize: '1rem', display: 'inline-block' }}
                >
                  {quantity}
                </motion.span>
                <motion.button
                  disabled={isOutOfStock}
                  whileHover={isOutOfStock ? {} : { backgroundColor: '#ffe4e6' }}
                  whileTap={isOutOfStock ? {} : { scale: 0.75, rotate: 15 }}
                  onClick={() => setQuantity(quantity + 1)}
                  style={{ padding: '0.75rem 1rem', background: '#f1f5f9', border: 'none', color: '#0f172a', cursor: isOutOfStock ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', transition: 'background 0.2s ease' }}
                  aria-label="Increase quantity"
                >
                  <Plus size={16} color={isOutOfStock ? '#94a3b8' : pdPrimary} strokeWidth={2.5} />
                </motion.button>
              </div>

              {/* Add to Cart CTA Button */}
              {isOutOfStock ? (
                <button
                  disabled
                  style={{ 
                    flexGrow: 1, 
                    justifyContent: 'center',
                    background: '#e2e8f0',
                    color: '#94a3b8',
                    padding: '0.85rem 1.75rem',
                    borderRadius: '9999px',
                    fontWeight: 900,
                    fontSize: '0.95rem',
                    border: '1.5px solid #cbd5e1',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'not-allowed',
                    opacity: 0.8
                  }}
                >
                  <X size={20} color="#94a3b8" />
                  <span>{t('outOfStock', 'Out of Stock')}</span>
                </button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.90, rotate: -2 }}
                  className="btn-primary"
                  onClick={handleAddToCart}
                  style={{ 
                    flexGrow: 1, 
                    justifyContent: 'center',
                    background: isJustAdded ? 'linear-gradient(135deg, #15803d 0%, #166534 100%)' : pdPrimary,
                    color: pdTextColor,
                    padding: '0.85rem 1.75rem',
                    borderRadius: '9999px',
                    fontWeight: 900,
                    fontSize: '0.95rem',
                    boxShadow: isJustAdded ? '0 6px 20px rgba(22, 101, 52, 0.4)' : '0 6px 20px rgba(0, 0, 0, 0.2)',
                    border: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                    transition: 'background 0.3s ease, boxShadow 0.3s ease'
                  }}
                >
                  <motion.div
                    animate={isJustAdded ? { scale: [1, 1.25, 1], rotate: [0, -10, 10, 0] } : {}}
                    transition={{ duration: 0.35 }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: pdTextColor }}
                  >
                    {isJustAdded ? <Check size={20} color={pdTextColor} /> : <ShoppingCart size={20} color={pdTextColor} />}
                    <span style={{ color: pdTextColor }}>{isJustAdded ? 'Added to Cart!' : `${t('addToCart', 'Add to Cart')} (₹${product.price * quantity})`}</span>
                  </motion.div>
                </motion.button>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 900, marginBottom: '1.35rem', color: '#0f172a', letterSpacing: '-0.01em' }}>
              {t('relatedProducts', 'Related Products')}
            </h2>
            <div className="responsive-products-grid">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sticky Bottom CTA Bar */}
      <div className="mobile-sticky-product-bar" style={{ background: '#ffffff', borderTop: '1.5px solid #e2e8f0', boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.08)' }}>
        <div className="mobile-sticky-product-info">
          <span className="mobile-sticky-price" style={{ color: '#d90429', fontWeight: 900 }}>₹{product.price * quantity}</span>
          <span className="mobile-sticky-title" style={{ color: '#0f172a', fontWeight: 800 }}>{getText(product, 'name')}</span>
        </div>
        <motion.button
          whileTap={{ scale: 0.94 }}
          className="btn-primary mobile-sticky-buy-btn"
          onClick={(e) => addToCart(product, quantity, e)}
          style={{ background: '#d90429', color: '#ffffff', fontWeight: 900 }}
        >
          <ShoppingCart size={18} /> {t('addToCart', 'Add to Cart')}
        </motion.button>
      </div>
    </div>
  );
};
