import React, { useState, useEffect } from 'react';
import { getCoupons } from '../services/couponService';
import { getProducts, getOffers } from '../services/productService';
import { ProductCard } from '../components/ProductCard';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { Flame, Copy, Check, Clock, Tag, Sparkles } from 'lucide-react';

export const Offers = () => {
  const { language } = useLanguage();
  const { showNotification } = useCart();
  const [copiedCode, setCopiedCode] = useState(null);
  const [productList, setProductList] = useState([]);
  const [offersProductList, setOffersProductList] = useState([]);
  const [couponsList, setCouponsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      getCoupons().catch(err => { console.warn('Coupons fetch error:', err); return []; }),
      getOffers().catch(err => { console.warn('Offers fetch error:', err); return []; }),
      getProducts().catch(err => { console.warn('Products fetch error:', err); return []; })
    ]).then(([couponsData, offersData, productsData]) => {
      if (!isMounted) return;
      setCouponsList(couponsData || []);
      setOffersProductList(offersData || []);
      setProductList(productsData || []);
      setLoading(false);
    });

    return () => { isMounted = false; };
  }, []);

  const displayProducts = offersProductList.length > 0
    ? offersProductList
    : (productList.filter(p => (p.discount || 0) > 0 || p.originalPrice > p.price).length > 0
        ? productList.filter(p => (p.discount || 0) > 0 || p.originalPrice > p.price)
        : productList);

  const handleCopyCoupon = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showNotification(`Coupon code ${code} copied to clipboard!`, 'info');
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="offers-page-light" style={{ padding: '2.5rem 0 5rem', background: '#f8fafc', minHeight: '100vh', color: '#1e293b' }}>
      <div className="container">
        
        {/* Light Festive Header Banner */}
        <div className="offers-hero-banner" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #fffdf5 50%, #fef3c7 100%)', border: '1.5px solid #fef08a', borderRadius: '20px', padding: '2rem 2.25rem', marginBottom: '2.5rem', boxShadow: '0 4px 24px rgba(217, 4, 41, 0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
            <div>
              <div className="sparkle-badge" style={{ marginBottom: '0.65rem' }}>
                <Flame size={14} color="var(--crimson-red)" />
                <span>{language === 'ta' ? 'சிறப்பு திருவிழா தள்ளுபடிகள்' : 'Festival Deals & Promo Codes'}</span>
              </div>
              <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0f172a', margin: '0.35rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Flame size={32} color="#ea580c" />
                <span>{language === 'ta' ? 'தீபாவளி சலுகைகள் & கூப்பன்கள்' : 'Diwali Mega Offers & Coupons'}</span>
              </h1>
              <p style={{ color: '#475569', fontSize: '0.95rem', maxWidth: '620px', margin: 0, lineHeight: 1.5 }}>
                {language === 'ta'
                  ? 'சிவகாசி பட்டாசுகளுக்கான சிறப்புக் கூப்பன்களைப் பயன்படுத்தி கார்ட்டில் கூடுதல் தள்ளுபடி பெறுங்கள்.'
                  : 'Apply verified promo codes and festival coupons at checkout to unlock factory-direct discounts.'}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.85rem' }}>
              <div style={{ background: '#ffffff', padding: '0.75rem 1.15rem', borderRadius: '16px', border: '1.5px solid #fef08a', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#d90429' }}>UP TO 80%</div>
                <div style={{ fontSize: '0.725rem', color: '#0f172a', fontWeight: 800, textTransform: 'uppercase', marginTop: '2px' }}>
                  {language === 'ta' ? 'கூடுதல் தள்ளுபடி' : 'Max Off Today'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Coupons Grid Section (API Data from /getcoupons) */}
        {loading ? (
          <SkeletonLoader type="categories" />
        ) : couponsList.length > 0 && (
          <div style={{ marginBottom: '3.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <Tag size={20} color="var(--crimson-red)" />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                {language === 'ta' ? 'செயலில் உள்ள கூப்பன் கோடுகள்' : 'Active Coupon Codes'}
              </h2>
            </div>

            <div className="offers-coupons-grid">
              {couponsList.map((offer) => (
                <div key={offer.id} className="coupon-ticket-card">
                  <div className="coupon-ticket-top">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span className="coupon-badge">{offer.discountDisplay}</span>
                      <span className="coupon-min-tag">
                        Min. Order ₹{offer.minimum_order_amount || offer.minSpend || 0}
                      </span>
                    </div>

                    <h3 className="coupon-code-text">{offer.code}</h3>
                    <p className="coupon-desc-text">
                      {language === 'ta' ? offer.descriptionTa || offer.description : (offer.description || offer.name || 'Festival special offer')}
                    </p>
                  </div>

                  <div className="coupon-ticket-bottom">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>
                      <Clock size={13} /> Valid for Festive Season
                    </div>

                    <button
                      onClick={() => handleCopyCoupon(offer.code)}
                      style={{
                        background: copiedCode === offer.code ? '#16a34a' : 'var(--crimson-red)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '9999px',
                        padding: '0.4rem 0.85rem',
                        fontWeight: 800,
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        transition: 'background 0.2s ease'
                      }}
                    >
                      {copiedCode === offer.code ? <Check size={14} /> : <Copy size={14} />}
                      <span>{copiedCode === offer.code ? 'COPIED!' : 'COPY'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Discounted Crackers Grid Section (API Data from /crackers/getoffers) */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.01em', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Flame size={24} color="#ea580c" />
              <span>{language === 'ta' ? 'அதிக சலுகை கொண்ட பட்டாசுகள்' : 'Top Discounted Crackers'}</span>
            </h2>
            {offersProductList.length > 0 && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: '#dcfce7', color: '#166534', fontSize: '0.75rem', fontWeight: 700, padding: '0.3rem 0.75rem', borderRadius: '9999px', border: '1px solid #bbf7d0' }}>
                <Sparkles size={12} />
                <span>{language === 'ta' ? 'நேரலை சலுகை பட்டாசுகள்' : 'Live API Offers'}</span>
              </div>
            )}
          </div>

          {loading ? (
            <SkeletonLoader type="grid" count={6} />
          ) : (
            <div className="responsive-products-grid">
              {displayProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

