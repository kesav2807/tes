import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import { useCart } from '../context/CartContext';
import { User, MapPin, ShieldCheck, ArrowRight, ArrowLeft, Lock, Award, Truck, ShoppingBag } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useWebControl } from '../context/WebControlContext';

export const Checkout = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { isOnlineSalesEnabled } = useWebControl();
  const { customerInfo, saveCustomerInfo } = useOrder();
  const { cartItems, finalTotal, discountAmount, appliedCoupon } = useCart();

  const [formData, setFormData] = useState({ ...customerInfo });
  const [errors, setErrors] = useState({});

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full name is required';
    if (!formData.phone.trim() || formData.phone.length < 10) errs.phone = 'Valid 10-digit phone number is required';
    if (!formData.address.trim()) errs.address = 'Delivery address is required';
    if (!formData.city.trim()) errs.city = 'City is required';
    if (!formData.district.trim()) errs.district = 'District is required';
    if (!formData.state.trim()) errs.state = 'State is required';
    if (!formData.pincode.trim() || formData.pincode.length < 6) errs.pincode = 'Valid 6-digit Pincode is required';
    
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!isOnlineSalesEnabled) return;
    if (validate()) {
      const updatedInfo = {
        ...formData,
        postalcode: formData.pincode || formData.postalcode || ''
      };
      saveCustomerInfo(updatedInfo);
      navigate('/order-summary');
    }
  };

  return (
    <div className="checkout-page-light" style={{ padding: '1.5rem 0 6rem', background: '#f8fafc', color: '#1e293b', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: '860px' }}>
        
        {/* Back Link */}
        <Link
          to="/cart"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#0f172a', fontWeight: 800, fontSize: '0.88rem', marginBottom: '1rem', background: '#ffffff', border: '1.5px solid #cbd5e1', padding: '0.45rem 0.95rem', borderRadius: '12px', textDecoration: 'none' }}
        >
          <ArrowLeft size={16} /> {language === 'ta' ? 'கார்ட்டிற்கு திரும்பு' : 'Back to Cart'}
        </Link>

        {/* Mobile Quick Cart Summary Pill */}
        <div className="mobile-checkout-summary-pill" style={{ background: '#fff7ed', border: '1.5px solid #fed7aa', borderRadius: '14px', padding: '0.75rem 1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShoppingBag size={18} color="#d90429" />
            <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0f172a' }}>
              {cartItems.length} {language === 'ta' ? 'பொருட்கள் கார்ட்டில் உள்ளது' : 'Items in Cart'}
            </span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontWeight: 900, fontSize: '1rem', color: '#d90429' }}>₹{finalTotal}</span>
            {discountAmount > 0 && (
              <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 800, marginTop: '1px' }}>
                Saved ₹{discountAmount} {appliedCoupon ? `(${appliedCoupon.code})` : ''}
              </div>
            )}
          </div>
        </div>

        {/* Hero Header Banner (Compact Height & Short Text) */}
        <div className="checkout-hero-banner" style={{ background: '#ffffff', padding: '0.85rem 1.15rem', borderRadius: '16px', border: '1.5px solid #e2e8f0', boxShadow: '0 2px 12px rgba(0, 0, 0, 0.03)', marginBottom: '1rem', textAlign: 'center' }}>
          <div className="sparkle-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '0.2rem 0.65rem', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: '0.25rem' }}>
            <ShieldCheck size={13} color="#059669" />
            <span>{language === 'ta' ? 'படி 1: விநியோக விவரங்கள்' : 'STEP 1: DELIVERY INFO'}</span>
          </div>
          <h1 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', margin: '0.1rem 0 0.15rem 0', letterSpacing: '-0.01em' }}>
            {language === 'ta' ? 'விநியோக விவரங்கள்' : 'Delivery Information'}
          </h1>
          <p style={{ fontSize: '0.825rem', color: '#64748b', margin: 0 }}>
            {language === 'ta'
              ? 'வாட்ஸ்அப் விநியோகத்திற்கான உங்கள் முகவரி.'
              : 'Enter your address for direct WhatsApp delivery.'}
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="checkout-form-card" style={{ background: '#ffffff', border: '1.5px solid #e2e8f0', boxShadow: '0 8px 30px rgba(0, 0, 0, 0.04)' }}>
          
          {/* Section 1: Personal Details */}
          <h3 style={{ fontSize: '1.05rem', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1.5px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a', fontWeight: 900 }}>
            <User size={18} color="var(--crimson-red)" />
            {language === 'ta' ? 'தனிப்பட்ட விவரங்கள்' : 'Personal Details'}
          </h3>

          <div className="form-row-2col">
            <div style={{ marginBottom: '0.85rem' }}>
              <label style={{ fontSize: '0.825rem', fontWeight: 800, display: 'block', marginBottom: '0.35rem', color: '#334155' }}>
                {language === 'ta' ? 'முழு பெயர் *' : 'Full Name *'}
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                style={{ width: '100%', padding: '0.75rem 0.95rem', borderRadius: '12px', background: '#f8fafc', border: errors.fullName ? '1.5px solid #ef233c' : '1.5px solid #cbd5e1', color: '#0f172a', fontWeight: 700, fontSize: '0.95rem', outline: 'none' }}
                placeholder="e.g. Manikandan R"
              />
              {errors.fullName && <div style={{ color: '#ef233c', fontSize: '0.75rem', marginTop: '0.25rem', fontWeight: 700 }}>{errors.fullName}</div>}
            </div>

            <div style={{ marginBottom: '0.85rem' }}>
              <label style={{ fontSize: '0.825rem', fontWeight: 800, display: 'block', marginBottom: '0.35rem', color: '#334155' }}>
                {language === 'ta' ? 'தொலைபேசி எண் *' : 'Phone Number *'}
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                style={{ width: '100%', padding: '0.75rem 0.95rem', borderRadius: '12px', background: '#f8fafc', border: errors.phone ? '1.5px solid #ef233c' : '1.5px solid #cbd5e1', color: '#0f172a', fontWeight: 700, fontSize: '0.95rem', outline: 'none' }}
                placeholder="e.g. 9876543210"
              />
              {errors.phone && <div style={{ color: '#ef233c', fontSize: '0.75rem', marginTop: '0.25rem', fontWeight: 700 }}>{errors.phone}</div>}
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.825rem', fontWeight: 800, display: 'block', marginBottom: '0.35rem', color: '#334155' }}>
              {language === 'ta' ? 'மின்னஞ்சல் முகவரி (ஆர்டர் அறிவிப்புகளுக்கு)' : 'Email Address (for order updates)'}
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={{ width: '100%', padding: '0.75rem 0.95rem', borderRadius: '12px', background: '#f8fafc', border: '1.5px solid #cbd5e1', color: '#0f172a', fontWeight: 700, fontSize: '0.95rem', outline: 'none' }}
              placeholder="e.g. mani@example.com"
            />
          </div>

          {/* Section 2: Delivery Address */}
          <h3 style={{ fontSize: '1.05rem', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1.5px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a', fontWeight: 900 }}>
            <MapPin size={18} color="var(--crimson-red)" />
            {language === 'ta' ? 'விநியோக முகவரி' : 'Shipping / Delivery Address'}
          </h3>

          <div style={{ marginBottom: '0.85rem' }}>
            <label style={{ fontSize: '0.825rem', fontWeight: 800, display: 'block', marginBottom: '0.35rem', color: '#334155' }}>
              {language === 'ta' ? 'வீட்டு எண் / தெரு முகவரி *' : 'House No / Street Address *'}
            </label>
            <textarea
              rows="3"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              style={{ width: '100%', padding: '0.75rem 0.95rem', borderRadius: '12px', background: '#f8fafc', border: errors.address ? '1.5px solid #ef233c' : '1.5px solid #cbd5e1', color: '#0f172a', fontWeight: 700, fontSize: '0.95rem', outline: 'none' }}
              placeholder="e.g. Door 42, Fireworks Avenue, Sivakasi Main Road"
            />
            {errors.address && <div style={{ color: '#ef233c', fontSize: '0.75rem', marginTop: '0.25rem', fontWeight: 700 }}>{errors.address}</div>}
          </div>

          <div className="form-row-2col">
            <div style={{ marginBottom: '0.85rem' }}>
              <label style={{ fontSize: '0.825rem', fontWeight: 800, display: 'block', marginBottom: '0.35rem', color: '#334155' }}>
                {language === 'ta' ? 'நகரம் *' : 'City *'}
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                style={{ width: '100%', padding: '0.75rem 0.95rem', borderRadius: '12px', background: '#f8fafc', border: errors.city ? '1.5px solid #ef233c' : '1.5px solid #cbd5e1', color: '#0f172a', fontWeight: 700, fontSize: '0.95rem', outline: 'none' }}
                placeholder="Sivakasi"
              />
              {errors.city && <div style={{ color: '#ef233c', fontSize: '0.75rem', marginTop: '0.25rem', fontWeight: 700 }}>{errors.city}</div>}
            </div>

            <div style={{ marginBottom: '0.85rem' }}>
              <label style={{ fontSize: '0.825rem', fontWeight: 800, display: 'block', marginBottom: '0.35rem', color: '#334155' }}>
                {language === 'ta' ? 'மாவட்டம் *' : 'District *'}
              </label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                style={{ width: '100%', padding: '0.75rem 0.95rem', borderRadius: '12px', background: '#f8fafc', border: errors.district ? '1.5px solid #ef233c' : '1.5px solid #cbd5e1', color: '#0f172a', fontWeight: 700, fontSize: '0.95rem', outline: 'none' }}
                placeholder="Virudhunagar"
              />
              {errors.district && <div style={{ color: '#ef233c', fontSize: '0.75rem', marginTop: '0.25rem', fontWeight: 700 }}>{errors.district}</div>}
            </div>
          </div>

          <div className="form-row-2col">
            <div style={{ marginBottom: '0.85rem' }}>
              <label style={{ fontSize: '0.825rem', fontWeight: 800, display: 'block', marginBottom: '0.35rem', color: '#334155' }}>
                {language === 'ta' ? 'மாநிலம் *' : 'State *'}
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                style={{ width: '100%', padding: '0.75rem 0.95rem', borderRadius: '12px', background: '#f8fafc', border: errors.state ? '1.5px solid #ef233c' : '1.5px solid #cbd5e1', color: '#0f172a', fontWeight: 700, fontSize: '0.95rem', outline: 'none' }}
                placeholder="Tamil Nadu"
              />
              {errors.state && <div style={{ color: '#ef233c', fontSize: '0.75rem', marginTop: '0.25rem', fontWeight: 700 }}>{errors.state}</div>}
            </div>

            <div style={{ marginBottom: '0.85rem' }}>
              <label style={{ fontSize: '0.825rem', fontWeight: 800, display: 'block', marginBottom: '0.35rem', color: '#334155' }}>
                {language === 'ta' ? 'அஞ்சல் குறியீடு (PIN Code) *' : 'PIN Code *'}
              </label>
              <input
                type="text"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                style={{ width: '100%', padding: '0.75rem 0.95rem', borderRadius: '12px', background: '#f8fafc', border: errors.pincode ? '1.5px solid #ef233c' : '1.5px solid #cbd5e1', color: '#0f172a', fontWeight: 700, fontSize: '0.95rem', outline: 'none' }}
                placeholder="626123"
              />
              {errors.pincode && <div style={{ color: '#ef233c', fontSize: '0.75rem', marginTop: '0.25rem', fontWeight: 700 }}>{errors.pincode}</div>}
            </div>
          </div>

          {!isOnlineSalesEnabled && (
            <div style={{ background: '#fff1f2', border: '1.5px solid #fecdd3', color: '#9f1239', padding: '1rem 1.25rem', borderRadius: '16px', marginBottom: '1.25rem', fontWeight: 800, fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Lock size={20} color="#9f1239" />
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 900 }}>
                  {language === 'ta' ? 'ஆன்லைன் ஆர்டர்கள் தற்காலிகமாக நிறுத்தப்பட்டுள்ளன' : 'Online Sales Temporarily Paused'}
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, marginTop: '2px', opacity: 0.9 }}>
                  {language === 'ta' ? 'தற்போது புதிய ஆர்டர்கள் ஏற்றுக்கொள்ளப்படவில்லை.' : 'Administration has currently paused online sales. Place order is disabled.'}
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={!isOnlineSalesEnabled}
            className={`btn-primary ${isOnlineSalesEnabled ? 'pulse-glow' : ''} desktop-submit-btn`}
            style={{
              width: '100%',
              justifyContent: 'center',
              marginTop: '1.25rem',
              padding: '0.9rem 2rem',
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
              ? `${language === 'ta' ? 'ஆர்டர் மதிப்பாய்வுக்கு தொடரவும்' : 'Proceed to Order Review'} (₹${finalTotal})`
              : (language === 'ta' ? 'ஆன்லைன் விற்பனை நிறுத்தப்பட்டது' : 'Online Sales Paused')
            }
            {isOnlineSalesEnabled && <ArrowRight size={18} />}
          </button>
        </form>

        {/* Trust Badges Bar */}
        <div style={{ marginTop: '1.5rem', background: '#ffffff', borderRadius: '18px', padding: '1rem 1.25rem', border: '1.5px solid #e2e8f0', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', fontWeight: 800, color: '#334155' }}>
            <Award size={17} color="var(--crimson-red)" />
            <span>Direct Sivakasi Quality</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', fontWeight: 800, color: '#334155' }}>
            <Lock size={17} color="#059669" />
            <span>Verified Address Checkout</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', fontWeight: 800, color: '#334155' }}>
            <Truck size={17} color="#2563eb" />
            <span>Fast Doorstep Delivery</span>
          </div>
        </div>

      </div>

      {/* Mobile Sticky Form Submit CTA Bar */}
      <div className="mobile-sticky-pay-bar" style={{ background: '#ffffff', borderTop: '1.5px solid #e2e8f0', boxShadow: '0 -4px 20px rgba(0,0,0,0.08)' }}>
        <div className="mobile-sticky-checkout-info">
          <span className="mobile-sticky-checkout-label" style={{ color: '#64748b', fontSize: '0.78rem', fontWeight: 800 }}>Total: ₹{finalTotal}</span>
          <span className="mobile-sticky-title" style={{ color: '#059669', fontSize: '0.72rem', fontWeight: 800 }}>Step 1 of 2</span>
        </div>
        <button
          className="btn-primary mobile-sticky-checkout-btn"
          onClick={handleSubmit}
          disabled={!isOnlineSalesEnabled}
          style={{
            background: isOnlineSalesEnabled ? 'linear-gradient(135deg, #d90429 0%, #b7094c 100%)' : '#94a3b8',
            color: '#ffffff',
            fontWeight: 900,
            borderRadius: '12px',
            padding: '0.75rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            border: 'none',
            cursor: isOnlineSalesEnabled ? 'pointer' : 'not-allowed',
            fontSize: '0.9rem',
            opacity: isOnlineSalesEnabled ? 1 : 0.7
          }}
        >
          {isOnlineSalesEnabled
            ? (language === 'ta' ? 'அடுத்த படி' : 'Next Step')
            : (language === 'ta' ? 'நிறுத்தப்பட்டது' : 'Sales Closed')
          }
          {isOnlineSalesEnabled && <ArrowRight size={16} />}
        </button>
      </div>
    </div>
  );
};
