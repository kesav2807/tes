import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Tag, Sparkles, ShieldCheck, Truck, Award, ArrowLeft, FileText, Lock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useWebControl } from '../context/WebControlContext';
import { LazyImage } from '../components/LazyImage';

export const Cart = () => {
  const navigate = useNavigate();
  const { language, t, getText } = useLanguage();
  const { isOnlineSalesEnabled } = useWebControl();
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    subtotal,
    availableCoupons,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    discountAmount,
    shippingCharges,
    finalTotal
  } = useCart();

  const [couponInput, setCouponInput] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyCoupon(couponInput.trim());
    }
  };

  return (
    <div className="cart-page-light" style={{ padding: '2rem 0 5rem', background: '#f8fafc', color: '#1e293b', minHeight: '100vh' }}>
      <div className="container">
        
        {/* Festive Hero Banner */}
        <div className="cart-hero-banner" style={{ background: '#ffffff', padding: '1.75rem 2rem', borderRadius: '20px', border: '1.5px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
            <div>
              <div className="sparkle-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#fff1f2', border: '1px solid #fecdd3', padding: '0.35rem 0.85rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--crimson-red)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.65rem' }}>
                <Sparkles size={14} color="var(--crimson-red)" />
                <span>{language === 'ta' ? 'நேரடி சிவகாசி பட்டாசுகள்' : '100% Direct Sivakasi Crackers'}</span>
              </div>
              <h1 className="cart-hero-title" style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <ShoppingCart size={28} color="var(--crimson-red)" />
                {t('shoppingCart', 'Your Shopping Cart')}
              </h1>
              <p className="cart-hero-subtitle" style={{ fontSize: '0.9rem', color: '#64748b', margin: '0.35rem 0 0 0' }}>
                {language === 'ta'
                  ? 'உங்கள் பட்டாசு ஆர்டரை மதிப்பாய்வு செய்து உடனே முன்பதிவு செய்யுங்கள்.'
                  : 'Review your selected Sivakasi factory crackers before proceeding to instant checkout.'}
              </p>
            </div>

            {cartItems.length > 0 && (
              <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
                <div style={{ background: '#f8fafc', padding: '0.75rem 1.25rem', borderRadius: '14px', border: '1.5px solid #e2e8f0', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', lineHeight: 1.1 }}>{cartItems.length}</div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginTop: '2px' }}>
                    {language === 'ta' ? 'பொருட்கள்' : 'Selected Items'}
                  </div>
                </div>
                <div style={{ background: '#fff1f2', padding: '0.75rem 1.25rem', borderRadius: '14px', border: '1.5px solid #fecdd3', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#d90429', lineHeight: 1.1 }}>₹{finalTotal}</div>
                  <div style={{ fontSize: '0.7rem', color: '#d90429', fontWeight: 800, textTransform: 'uppercase', marginTop: '2px' }}>
                    {language === 'ta' ? 'மொத்த தொகை' : 'Grand Total'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {!isOnlineSalesEnabled && (
          <div style={{ background: '#fff1f2', border: '1.5px solid #fecdd3', color: '#9f1239', padding: '1rem 1.25rem', borderRadius: '16px', marginBottom: '1.5rem', fontWeight: 800, fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Lock size={20} />
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 900 }}>
                {language === 'ta' ? 'ஆன்லைன் ஆர்டர்கள் தற்காலிகமாக நிறுத்தப்பட்டுள்ளன' : 'Online Sales Temporarily Closed'}
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, marginTop: '2px', opacity: 0.9 }}>
                {language === 'ta' ? 'தற்போது புதிய ஆர்டர்கள் ஏற்றுக்கொள்ளப்படவில்லை.' : 'Administration has currently paused online orders. You can browse products, but checkout is disabled.'}
              </div>
            </div>
          </div>
        )}

        {cartItems.length === 0 ? (
          <div style={{ background: '#ffffff', padding: '4rem 2rem', borderRadius: '24px', textAlign: 'center', border: '1.5px solid #e2e8f0', boxShadow: '0 8px 30px rgba(0,0,0,0.03)', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}><ShoppingCart size={64} color="#e2e8f0" /></div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.5rem' }}>{t('emptyCart', 'Your Cart is Currently Empty')}</h3>
            <p style={{ color: '#64748b', marginBottom: '1.85rem', fontSize: '0.95rem', lineHeight: 1.5 }}>
              {language === 'ta'
                ? 'எங்கள் பட்டாசு அட்டவணையை பார்த்து உங்கள் பிடித்தமான பட்டாசுகளை கார்டில் சேர்க்கவும்.'
                : 'Look through our crackers catalogue and add your favorite festival crackers to your cart.'}
            </p>
            <Link to="/products" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem', padding: '0.85rem 2rem', borderRadius: '14px', fontSize: '0.95rem', fontWeight: 800 }}>
              {t('continueShopping', 'Browse Catalogue Now')} <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="cart-layout-grid">
            {/* Items List Card */}
            <div style={{ background: '#ffffff', borderRadius: '20px', padding: '1.5rem', border: '1.5px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)' }}>
              
              {/* Desktop Table View */}
              <div className="cart-table-wrapper desktop-only-cart-table">
                <table className="cart-table" style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
                  <thead>
                    <tr style={{ background: '#f8fafc' }}>
                      <th style={{ padding: '0.85rem 1rem', borderRadius: '10px 0 0 10px', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: 800 }}>{t('products', 'Product')}</th>
                      <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: 800 }}>{t('price', 'Price')}</th>
                      <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: 800 }}>{t('qty', 'Quantity')}</th>
                      <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: 800 }}>{t('subtotal', 'Subtotal')}</th>
                      <th style={{ padding: '0.85rem 1rem', borderRadius: '0 10px 10px 0', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: 800, textAlign: 'center' }}>{t('remove', 'Action')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item, idx) => (
                      <tr key={item.id} style={{ borderBottom: idx < cartItems.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                        <td style={{ padding: '1.15rem 1rem' }}>
                          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <LazyImage src={item.image} alt={getText(item, 'name')} style={{ width: '64px', height: '64px', borderRadius: '12px', objectFit: 'cover', border: '1px solid #e2e8f0' }} />
                            <div>
                              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a', marginBottom: '2px' }}>{getText(item, 'name')}</div>
                              {item.discount > 0 && (
                                <span style={{ display: 'inline-block', fontSize: '0.7rem', color: '#059669', background: '#ecfdf5', padding: '0.15rem 0.5rem', borderRadius: '6px', fontWeight: 800, border: '1px solid #a7f3d0' }}>
                                  {item.discount}% {t('discountOff', 'OFF')}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '1.15rem 1rem', fontWeight: 700, color: '#334155', fontSize: '0.95rem' }}>₹{item.price}</td>
                        <td style={{ padding: '1.15rem 1rem' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '10px', overflow: 'hidden' }}>
                            <button onClick={() => updateQuantity(item.id, -1)} style={{ padding: '0.4rem 0.75rem', background: 'transparent', border: 'none', color: '#0f172a', cursor: 'pointer', display: 'flex', alignItems: 'center' }} aria-label="Decrease quantity">
                              <Minus size={13} strokeWidth={2.8} />
                            </button>
                            <span style={{ padding: '0 0.6rem', fontWeight: 900, color: '#0f172a', fontSize: '0.9rem' }}>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} style={{ padding: '0.4rem 0.75rem', background: 'transparent', border: 'none', color: '#0f172a', cursor: 'pointer', display: 'flex', alignItems: 'center' }} aria-label="Increase quantity">
                              <Plus size={13} strokeWidth={2.8} />
                            </button>
                          </div>
                        </td>
                        <td style={{ padding: '1.15rem 1rem', fontWeight: 900, color: 'var(--crimson-red)', fontSize: '1.05rem' }}>₹{item.price * item.quantity}</td>
                        <td style={{ padding: '1.15rem 1rem', textAlign: 'center' }}>
                          <button 
                            onClick={() => removeFromCart(item.id)} 
                            style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#fff1f2', border: '1px solid #fecdd3', color: '#ef233c', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s ease' }} 
                            aria-label="Remove item"
                            title="Remove from Cart"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card List View */}
              <div className="mobile-cart-cards-list">
                {cartItems.map(item => (
                  <div key={item.id} className="mobile-cart-card" style={{ background: '#ffffff', borderRadius: '16px', padding: '1rem', border: '1.5px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', display: 'flex', gap: '0.85rem' }}>
                    <LazyImage src={item.image} alt={getText(item, 'name')} className="mobile-cart-card-img" style={{ width: '74px', height: '74px', borderRadius: '12px', objectFit: 'cover', border: '1px solid #e2e8f0' }} />
                    <div className="mobile-cart-card-details" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div className="mobile-cart-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                        <span className="mobile-cart-card-title" style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a', lineHeight: 1.25 }}>{getText(item, 'name')}</span>
                        <button onClick={() => removeFromCart(item.id)} className="mobile-cart-card-remove" style={{ background: '#fff1f2', border: '1px solid #fecdd3', color: '#ef233c', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }} aria-label="Remove item">
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="mobile-cart-card-price" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#334155' }}>₹{item.price}</span>
                        {item.discount > 0 && <span className="mobile-cart-card-discount" style={{ fontSize: '0.7rem', color: '#059669', background: '#ecfdf5', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 800 }}>{item.discount}% OFF</span>}
                      </div>
                      <div className="mobile-cart-card-footer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.65rem' }}>
                        <div className="quantity-control-pill" style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '8px' }}>
                          <button onClick={() => updateQuantity(item.id, -1)} aria-label="Decrease quantity" style={{ padding: '0.3rem 0.6rem', border: 'none', background: 'transparent', cursor: 'pointer' }}><Minus size={13} strokeWidth={2.5} /></button>
                          <span style={{ fontWeight: 900, fontSize: '0.85rem', padding: '0 0.4rem' }}>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} aria-label="Increase quantity" style={{ padding: '0.3rem 0.6rem', border: 'none', background: 'transparent', cursor: 'pointer' }}><Plus size={13} strokeWidth={2.5} /></button>
                        </div>
                        <div className="mobile-cart-card-subtotal" style={{ fontWeight: 900, color: 'var(--crimson-red)', fontSize: '1rem' }}>₹{item.price * item.quantity}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1.5px solid #e2e8f0' }}>
                <Link to="/products" className="btn-secondary" style={{ background: '#f8fafc', color: '#0f172a', border: '1.5px solid #cbd5e1', fontSize: '0.88rem', fontWeight: 800, padding: '0.65rem 1.25rem', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}>
                  <ArrowLeft size={16} /> {t('continueShopping', 'Continue Shopping')}
                </Link>
              </div>
            </div>

            {/* Order Summary & Coupon Column */}
            <div>
              {/* Order Summary Card */}
              <div className="summary-card" style={{ background: '#ffffff', borderRadius: '20px', padding: '1.5rem', border: '1.5px solid #e2e8f0', boxShadow: '0 6px 25px rgba(0, 0, 0, 0.04)', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1.5px solid #f1f5f9', color: '#0f172a', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={20} /> {t('cartSummary', 'Cart Order Summary')}
                </h3>

                <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.92rem' }}>
                  <span style={{ color: '#64748b', fontWeight: 600 }}>{t('subtotal', 'Items Subtotal')}</span>
                  <span style={{ fontWeight: 800, color: '#0f172a' }}>₹{subtotal}</span>
                </div>

                {appliedCoupon && (
                  <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.92rem', color: '#059669' }}>
                    <span style={{ fontWeight: 700 }}>{t('discount', 'Discount Coupon')} ({appliedCoupon.code})</span>
                    <span style={{ fontWeight: 900 }}>-₹{discountAmount}</span>
                  </div>
                )}

                <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.92rem' }}>
                  <span style={{ color: '#64748b', fontWeight: 600 }}>{t('deliveryFee', 'Safe Delivery Charges')}</span>
                  <span style={{ fontWeight: 800, color: '#059669' }}>{shippingCharges === 0 ? t('freeDelivery', 'FREE') : `₹${shippingCharges}`}</span>
                </div>

                <div className="summary-total" style={{ borderTop: '2px dashed #cbd5e1', paddingTop: '1rem', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#0f172a', fontWeight: 900, fontSize: '1.05rem' }}>{t('grandTotal', 'Total Payable Amount')}</span>
                  <span style={{ color: '#d90429', fontWeight: 900, fontSize: '1.4rem', letterSpacing: '-0.02em' }}>₹{finalTotal}</span>
                </div>

                <button
                  className={`btn-primary ${isOnlineSalesEnabled ? 'pulse-glow' : ''} desktop-checkout-btn`}
                  onClick={() => {
                    if (isOnlineSalesEnabled) {
                      navigate('/checkout');
                    }
                  }}
                  disabled={!isOnlineSalesEnabled}
                  style={{
                    width: '100%',
                    marginTop: '1.5rem',
                    justifyContent: 'center',
                    padding: '0.9rem 1.5rem',
                    borderRadius: '14px',
                    fontSize: '1rem',
                    fontWeight: 900,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: isOnlineSalesEnabled ? 'linear-gradient(135deg, #d90429 0%, #b7094c 100%)' : '#94a3b8',
                    boxShadow: isOnlineSalesEnabled ? '0 8px 24px rgba(217, 4, 41, 0.35)' : 'none',
                    border: 'none',
                    color: '#ffffff',
                    cursor: isOnlineSalesEnabled ? 'pointer' : 'not-allowed',
                    opacity: isOnlineSalesEnabled ? 1 : 0.7
                  }}
                >
                  {isOnlineSalesEnabled
                    ? t('proceedToCheckout', 'Proceed to Checkout')
                    : (language === 'ta' ? 'ஆன்லைன் விற்பனை நிறுத்தப்பட்டது' : 'Online Sales Temporarily Paused')
                  }
                  {isOnlineSalesEnabled && <ArrowRight size={18} />}
                </button>
              </div>

              {/* Coupon Applicator Card */}
              <div className="summary-card" style={{ background: '#ffffff', borderRadius: '20px', padding: '1.35rem', border: '1.5px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.03)' }}>
                <h4 style={{ fontSize: '0.92rem', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#0f172a', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                  <Tag size={16} color="var(--crimson-red)" /> {t('offers', 'Apply Festival Coupon Code')}
                </h4>

                {appliedCoupon ? (
                  <div style={{ background: '#ecfdf5', padding: '0.85rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1.5px solid #a7f3d0' }}>
                    <div>
                      <div style={{ fontWeight: 900, color: '#059669', fontSize: '0.85rem' }}>{appliedCoupon.code} APPLIED</div>
                      {discountAmount > 0 ? (
                        <div style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 600 }}>Saved ₹{discountAmount} on this order</div>
                      ) : (
                        <div style={{ fontSize: '0.75rem', color: '#b91c1c', fontWeight: 700 }}>
                          Min order ₹{appliedCoupon.minimumOrderAmount} required (Add ₹{appliedCoupon.minimumOrderAmount - subtotal} more items)
                        </div>
                      )}
                    </div>
                    <button onClick={removeCoupon} style={{ color: '#ef233c', background: '#fff1f2', border: '1px solid #fecdd3', padding: '0.35rem 0.75rem', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer' }}>{t('remove', 'Remove')}</button>
                  </div>
                ) : (
                  <div>
                    <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '0.5rem', marginBottom: availableCoupons.length > 0 ? '1rem' : 0 }}>
                      <input
                        type="text"
                        placeholder="e.g. DIWALI2027 or FESTIVAL50"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        style={{ flexGrow: 1, padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1.5px solid #cbd5e1', textTransform: 'uppercase', background: '#f8fafc', color: '#0f172a', fontWeight: 700, fontSize: '0.85rem', outline: 'none' }}
                      />
                      <button type="submit" className="btn-primary" style={{ padding: '0.65rem 1.15rem', fontSize: '0.85rem', fontWeight: 800, borderRadius: '10px', background: '#0f172a', color: '#ffffff', border: 'none', cursor: 'pointer' }}>
                        Apply
                      </button>
                    </form>

                    {availableCoupons.length > 0 && (
                      <div style={{ borderTop: '1.5px dashed #e2e8f0', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Tag size={13} /> Available API Offers & Coupons:
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                          {availableCoupons.map(c => (
                            <div key={c.id || c.code} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(135deg, #ffffff 0%, #fff1f2 100%)', border: '1.5px solid #fecdd3', padding: '0.65rem 0.85rem', borderRadius: '14px', boxShadow: '0 2px 8px rgba(217, 4, 41, 0.04)' }}>
                              <div>
                                <span style={{ fontWeight: 900, color: '#d90429', fontSize: '0.9rem', letterSpacing: '0.06em', fontFamily: 'monospace' }}>{c.code}</span>
                                <div style={{ fontSize: '0.75rem', color: '#1e293b', fontWeight: 700, marginTop: '2px' }}>
                                  {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `FLAT ₹${c.discountValue} OFF`}{c.minimumOrderAmount > 0 ? ` (Min ₹${c.minimumOrderAmount})` : ''}
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => applyCoupon(c.code)}
                                style={{ background: 'linear-gradient(135deg, #d90429 0%, #ef233c 100%)', color: '#ffffff', border: 'none', padding: '0.4rem 1rem', borderRadius: '9999px', fontSize: '0.775rem', fontWeight: 800, cursor: 'pointer', boxShadow: '0 3px 10px rgba(217, 4, 41, 0.25)' }}
                              >
                                Apply
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Trust Features Row */}
              <div style={{ marginTop: '1.5rem', background: '#ffffff', borderRadius: '16px', padding: '1rem', border: '1.5px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.82rem', fontWeight: 800, color: '#334155' }}>
                  <Award size={18} color="var(--crimson-red)" />
                  <span>100% Direct Sivakasi Factory Quality</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.82rem', fontWeight: 800, color: '#334155' }}>
                  <ShieldCheck size={18} color="#059669" />
                  <span>100% Safe & Encrypted Payment</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.82rem', fontWeight: 800, color: '#334155' }}>
                  <Truck size={18} color="#2563eb" />
                  <span>Fast Doorstep Delivery Eligible</span>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* Mobile Sticky Bottom Checkout CTA Bar */}
      {cartItems.length > 0 && (
        <div className="mobile-sticky-checkout-bar" style={{ background: '#ffffff', borderTop: '1.5px solid #e2e8f0', boxShadow: '0 -4px 20px rgba(0,0,0,0.08)' }}>
          <div className="mobile-sticky-checkout-info">
            <span className="mobile-sticky-checkout-label" style={{ color: '#64748b', fontSize: '0.78rem', fontWeight: 800 }}>{t('grandTotal', 'Total Payable')}:</span>
            <span className="mobile-sticky-checkout-price" style={{ color: '#d90429', fontSize: '1.25rem', fontWeight: 900 }}>₹{finalTotal}</span>
          </div>
          <button
            className="btn-primary mobile-sticky-checkout-btn"
            onClick={() => navigate('/checkout')}
            style={{ background: 'linear-gradient(135deg, #d90429 0%, #b7094c 100%)', color: '#ffffff', fontWeight: 900, borderRadius: '12px', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', border: 'none' }}
          >
            {t('proceedToCheckout', 'Checkout')} <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

