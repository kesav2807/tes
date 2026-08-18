import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import { useLanguage } from '../context/LanguageContext';
import { useWebControl } from '../context/WebControlContext';
import { 
  Search, Truck, AlertCircle, MapPin, Package, Eye, X, 
  Copy, Check, Clock, ShieldCheck, Phone, MessageSquare, 
  ChevronRight, RefreshCw, Box, Calendar, CreditCard, Sparkles
} from 'lucide-react';

const formatTrackingTimestamp = (rawTime) => {
  if (!rawTime) return '';
  let str = String(rawTime).trim();
  
  const lower = str.toLowerCase();
  if (['processing', 'upcoming', 'completed', 'just now', 'in progress', 'pending'].includes(lower)) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Fix mashed timestamp e.g. "2026-07-3118:22:31" -> "2026-07-31 18:22:31"
  if (/^\d{4}-\d{2}-\d{2}\d{2}:\d{2}:\d{2}/.test(str)) {
    str = str.slice(0, 10) + ' ' + str.slice(10);
  }
  str = str.replace('T', ' ');

  try {
    const parseable = str.includes(' ') ? str.replace(' ', 'T') : str;
    const d = new Date(parseable);
    if (!isNaN(d.getTime())) {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const seconds = String(d.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
  } catch (e) {}

  return str;
};

export const OrderTracking = () => {
  const { language } = useLanguage();
  const { formattedWhatsapp, shopName, phone: shopPhone, formattedPhone } = useWebControl();
  const [searchParams, setSearchParams] = useSearchParams();
  const { currentOrder, fetchTrackingOrder } = useOrder();

  const urlOrderId = (
    searchParams.get('orderId') || 
    searchParams.get('order_no') || 
    searchParams.get('orderNo') || 
    searchParams.get('id') || 
    ''
  ).trim();

  const initialId = urlOrderId || currentOrder?.orderNo || currentOrder?.orderId || '';

  const [inputOrderId, setInputOrderId] = useState(initialId);
  const [activeOrder, setActiveOrder] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isProductsModalOpen, setIsProductsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [recentOrdersList, setRecentOrdersList] = useState([]);

  // Load recent orders from localStorage
  useEffect(() => {
    try {
      const historyRaw = localStorage.getItem('sds_order_history');
      if (historyRaw) {
        const parsed = JSON.parse(historyRaw);
        if (Array.isArray(parsed)) {
          setRecentOrdersList(parsed.slice(0, 5));
        }
      }
    } catch (e) {
      console.warn('Could not parse order history:', e);
    }
  }, [currentOrder]);

  const executeTrackingSearch = async (targetId) => {
    if (!targetId || !targetId.trim()) return;
    const cleanId = targetId.trim();

    setLoading(true);
    setErrorMsg(null);

    const res = await fetchTrackingOrder(cleanId);

    if (res.success && res.order) {
      setActiveOrder(res.order);
    } else if (
      currentOrder && 
      (String(currentOrder.orderNo).toLowerCase() === cleanId.toLowerCase() || 
       String(currentOrder.orderId).toLowerCase() === cleanId.toLowerCase())
    ) {
      setActiveOrder(currentOrder);
    } else {
      let cachedMatch = null;
      try {
        const cached = localStorage.getItem('sds_recent_order');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && (String(parsed.orderNo).toLowerCase() === cleanId.toLowerCase() || String(parsed.orderId).toLowerCase() === cleanId.toLowerCase())) {
            cachedMatch = parsed;
          }
        }
        if (!cachedMatch) {
          const historyRaw = localStorage.getItem('sds_order_history');
          if (historyRaw) {
            const historyArr = JSON.parse(historyRaw);
            if (Array.isArray(historyArr)) {
              cachedMatch = historyArr.find(o => 
                String(o.orderNo || '').toLowerCase() === cleanId.toLowerCase() || 
                String(o.orderId || '').toLowerCase() === cleanId.toLowerCase()
              );
            }
          }
        }
      } catch (e) {}

      if (cachedMatch) {
        setActiveOrder(cachedMatch);
      } else {
        setActiveOrder(null);
        setErrorMsg(res.message || (language === 'ta' 
          ? `#${cleanId} க்கான நேரடி கண்காணிப்பு விபரங்கள் காணப்படவில்லை. ஆர்டர் ஐடியை சரிபார்க்கவும்.`
          : `No tracking record found for #${cleanId}. Please check your Order ID or contact support.`));
      }
    }
    setLoading(false);
  };

  const handleFormSubmit = (e) => {
    if (e) e.preventDefault();
    if (!inputOrderId.trim()) return;
    setSearchParams({ order_no: inputOrderId.trim() });
    executeTrackingSearch(inputOrderId.trim());
  };

  const handleQuickSelectOrder = (idVal) => {
    setInputOrderId(idVal);
    setSearchParams({ order_no: idVal });
    executeTrackingSearch(idVal);
  };

  const handleCopyOrderId = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (initialId) {
      setInputOrderId(initialId);
      executeTrackingSearch(initialId);
    }
  }, [urlOrderId]);

  const supportPhone = shopPhone || formattedPhone || '7010922428';
  const whatsappNumber = formattedWhatsapp || '919876543210';

  return (
    <div className="order-tracking-page-light" style={{ padding: '1.25rem 0 4.5rem', background: '#f8fafc', minHeight: '100vh', color: '#1e293b' }}>
      <div className="container" style={{ maxWidth: '880px', padding: '0 0.85rem' }}>
        
        {/* React Native App Style Top Hero Card */}
        <div 
          className="tracking-hero-banner" 
          style={{ 
            background: 'linear-gradient(135deg, #ffffff 0%, #fffdf5 45%, #fef3c7 100%)', 
            border: '1.5px solid #fef08a', 
            borderRadius: '24px', 
            padding: '1.35rem 1.25rem', 
            marginBottom: '1.25rem', 
            boxShadow: '0 8px 24px rgba(217, 4, 41, 0.05)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Subtle Accent Glow */}
          <div style={{ position: 'absolute', right: '-15px', top: '-15px', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.12)', pointerEvents: 'none' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ flex: '1 1 280px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#059669', borderRadius: '9999px', padding: '0.25rem 0.75rem', fontSize: '0.725rem', fontWeight: 800, marginBottom: '0.4rem' }}>
                <Truck size={13} color="#059669" />
                <span>{language === 'ta' ? 'நேரடி ஷிப்மென்ட் கண்காணிப்பு' : 'Live Express Tracking'}</span>
              </div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', margin: '0.15rem 0 0.3rem 0', lineHeight: 1.25, letterSpacing: '-0.02em' }}>
                {language === 'ta' ? 'பட்டாசு ஆர்டர் டிராக்கிங்' : 'Track Your Order Status'}
              </h1>
              <p style={{ color: '#475569', fontSize: '0.85rem', margin: 0, lineHeight: 1.45 }}>
                {language === 'ta'
                  ? 'உங்கள் ஆர்டர் ஐடியை (எ.கா. ORD-20260724 அல்லது CRK49102) உள்ளிட்டு நேரடி டெலிவரி நிலையை அறிந்து கொள்ளுங்கள்.'
                  : 'Enter your Order ID (e.g. ORD-20260724 or CRK49102) to view real-time delivery status and items.'}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.65rem' }}>
              <div style={{ background: '#ffffff', padding: '0.55rem 0.85rem', borderRadius: '16px', border: '1.5px solid #fef08a', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                <div style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--crimson-red, #d90429)', lineHeight: 1.1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                  <Sparkles size={13} color="#d90429" />
                  <span>SIVAKASI</span>
                </div>
                <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginTop: '2px' }}>
                  {language === 'ta' ? 'நேரடி அனுப்புதல்' : 'Direct Dispatch'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* React Native Mobile App Search Bar */}
        <div style={{ background: '#ffffff', padding: '1.15rem', borderRadius: '22px', border: '1.5px solid #e2e8f0', marginBottom: '1.25rem', boxShadow: '0 4px 18px rgba(0,0,0,0.03)' }}>
          <form onSubmit={handleFormSubmit} style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: '1 1 200px' }}>
              <Search style={{ position: 'absolute', left: '0.95rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} size={18} />
              <input
                type="text"
                placeholder={language === 'ta' ? 'ஆர்டர் ஐடியை உள்ளிடுக (எ.கா. CRK49102)' : 'Enter Order ID e.g. ORD-20260724 or CRK49102'}
                value={inputOrderId}
                onChange={(e) => setInputOrderId(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '0.8rem 2.5rem 0.8rem 2.7rem', 
                  borderRadius: '9999px', 
                  border: '1.5px solid #cbd5e1', 
                  textTransform: 'uppercase', 
                  fontSize: '0.9rem', 
                  fontWeight: 700, 
                  color: '#0f172a', 
                  background: '#f8fafc', 
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s'
                }}
              />
              {inputOrderId && (
                <button
                  type="button"
                  onClick={() => { setInputOrderId(''); setErrorMsg(null); setActiveOrder(null); }}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: '#e2e8f0',
                    border: 'none',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#64748b'
                  }}
                  title="Clear input"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            <button 
              type="submit" 
              disabled={loading || !inputOrderId.trim()} 
              style={{ 
                padding: '0.8rem 1.6rem', 
                height: '46px', 
                fontSize: '0.9rem', 
                fontWeight: 800, 
                cursor: loading || !inputOrderId.trim() ? 'not-allowed' : 'pointer', 
                opacity: loading || !inputOrderId.trim() ? 0.7 : 1,
                flex: '0 0 auto',
                borderRadius: '9999px',
                background: 'linear-gradient(135deg, #d90429 0%, #ef233c 100%)',
                color: '#ffffff',
                border: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
                boxShadow: '0 4px 14px rgba(217, 4, 41, 0.25)'
              }}
            >
              {loading ? (
                <>
                  <RefreshCw size={15} style={{ animation: 'spin 1s linear infinite' }} />
                  <span>{language === 'ta' ? 'தேடுகிறது...' : 'Searching...'}</span>
                </>
              ) : (
                <>
                  <Truck size={15} />
                  <span>{language === 'ta' ? 'ஆர்டரைக் கண்டுபிடி' : 'Track Order'}</span>
                </>
              )}
            </button>
          </form>

          {/* Touch-Friendly Horizontal Scrollable Recent Order Chips */}
          {recentOrdersList.length > 0 && (
            <div style={{ marginTop: '0.85rem', paddingTop: '0.75rem', borderTop: '1px dashed #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'nowrap' }}>
              <span style={{ fontSize: '0.725rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', flexShrink: 0 }}>
                {language === 'ta' ? 'சமீபத்தியது:' : 'Recent:'}
              </span>
              <div className="recent-chips-scroll">
                {recentOrdersList.map((ord, idx) => {
                  const oId = ord.orderId || ord.orderNo;
                  if (!oId) return null;
                  const isCurrent = activeOrder && (activeOrder.orderId === oId || activeOrder.orderNo === oId);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleQuickSelectOrder(oId)}
                      style={{
                        background: isCurrent ? '#d90429' : '#ffffff',
                        color: isCurrent ? '#ffffff' : '#334155',
                        border: isCurrent ? '1px solid #d90429' : '1px solid #cbd5e1',
                        borderRadius: '9999px',
                        padding: '0.2rem 0.7rem',
                        fontSize: '0.725rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        flexShrink: 0,
                        boxShadow: isCurrent ? '0 2px 8px rgba(217, 4, 41, 0.25)' : 'none',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      #{oId}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div style={{ background: '#fff1f2', border: '1.5px solid #fecdd3', color: '#9f1239', padding: '1.15rem', borderRadius: '20px', textAlign: 'center', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.65rem', fontWeight: 700, boxShadow: '0 4px 16px rgba(225, 29, 72, 0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.9rem' }}>
              <AlertCircle size={20} color="#d90429" />
              <span>{errorMsg}</span>
            </div>
            <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <a
                href={`https://wa.me/${whatsappNumber}?text=Hello%20${encodeURIComponent(shopName || 'SDS Crackers')},%20I%20need%20help%20tracking%20my%20order%20ID:%20${encodeURIComponent(inputOrderId)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '0.8rem', color: '#15803d', background: '#dcfce7', border: '1px solid #86efac', padding: '0.35rem 0.9rem', borderRadius: '9999px', textDecoration: 'none', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
              >
                <MessageSquare size={13} />
                <span>{language === 'ta' ? 'வாட்ஸ்அப் உதவி' : 'WhatsApp Help'}</span>
              </a>
              <a
                href={`tel:${supportPhone}`}
                style={{ fontSize: '0.8rem', color: '#1e40af', background: '#dbeafe', border: '1px solid #93c5fd', padding: '0.35rem 0.9rem', borderRadius: '9999px', textDecoration: 'none', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
              >
                <Phone size={13} />
                <span>{language === 'ta' ? 'அழைக்கவும்' : 'Call Store'}</span>
              </a>
            </div>
          </div>
        )}

        {/* DEFAULT VIEW: Shown when no order active */}
        {!activeOrder && !errorMsg && !loading && (
          <div style={{ background: '#ffffff', borderRadius: '22px', border: '1.5px solid #e2e8f0', padding: '1.75rem 1.25rem', textAlign: 'center', marginBottom: '1.75rem', boxShadow: '0 4px 18px rgba(0,0,0,0.03)' }}>
            <div style={{ width: '58px', height: '58px', borderRadius: '50%', background: '#fffdf5', border: '2px solid #fef08a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--crimson-red, #d90429)' }}>
              <Package size={28} />
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.4rem' }}>
              {language === 'ta' ? 'உங்கள் ஆர்டரை எப்போது வேண்டுமானாலும் கண்காணிக்கலாம்' : 'Track Your Fireworks Order Anytime'}
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.85rem', maxWidth: '520px', margin: '0 auto 1.25rem', lineHeight: 1.45 }}>
              {language === 'ta'
                ? 'உங்கள் ஆர்டர் எண் (ORD-20260724 அல்லது CRK...) உள்ளிட்டு சிவகாசி கிடங்கில் இருந்து நேரடி அனுப்புதல் மற்றும் டெலிவரி நிலையை பார்க்கவும்.'
                : 'Enter your Order ID above or pick a recent order to trace Sivakasi dispatch, courier handover, and expected delivery date.'}
            </p>

            {/* Feature Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.85rem', marginTop: '1.25rem' }}>
              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#059669', fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                  <Truck size={16} />
                  <span>{language === 'ta' ? 'சிவகாசி நேரடி அனுப்பீடு' : 'Sivakasi Direct Dispatch'}</span>
                </div>
                <div style={{ fontSize: '0.775rem', color: '#64748b', lineHeight: 1.4 }}>
                  {language === 'ta' ? 'பட்டாசுகள் சிவகாசி கிடங்கிலிருந்து பாதுகாப்பாக அனுப்பப்படும்.' : 'Orders dispatched safely directly from registered Sivakasi hubs.'}
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--crimson-red, #d90429)', fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                  <ShieldCheck size={16} />
                  <span>{language === 'ta' ? '100% பாதுகாப்பான பேக்கிங்' : '100% Safety Guarantee'}</span>
                </div>
                <div style={{ fontSize: '0.775rem', color: '#64748b', lineHeight: 1.4 }}>
                  {language === 'ta' ? 'தரமான நீர்ப்புகா பேக்கிங் மற்றும் பாதுகாப்பான டெலிவரி.' : 'Waterproof heavy-duty packaging adhering to safety regulations.'}
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2563eb', fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                  <MessageSquare size={16} />
                  <span>{language === 'ta' ? 'வாட்ஸ்அப் ஆதரவு' : 'Instant WhatsApp Help'}</span>
                </div>
                <div style={{ fontSize: '0.775rem', color: '#64748b', lineHeight: 1.4 }}>
                  {language === 'ta' ? 'ஆர்டர் டிராக்கிங் உதவிகளுக்கு வாட்ஸ்அப்பில் தொடர்பு கொள்ளலாம்.' : 'Reach our store staff instantly for dispatch status and courier queries.'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* REACT NATIVE APP STYLE TRACKING CARD */}
        {activeOrder && (
          <div className="tracking-order-card" style={{ background: '#ffffff', padding: '1.5rem 1.25rem', borderRadius: '22px', border: '1.5px solid #e2e8f0', boxShadow: '0 6px 26px rgba(0,0,0,0.04)', marginBottom: '1.75rem' }}>
            
            {/* Header Summary */}
            <div className="tracking-order-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '1.15rem', borderBottom: '1.5px solid #e2e8f0', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.725rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {language === 'ta' ? 'ஆர்டர் ஐடி' : 'TRACKING ORDER ID'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.2rem 0 0.45rem' }}>
                  <h2 style={{ fontSize: '1.5rem', color: 'var(--crimson-red, #d90429)', fontWeight: 900, margin: 0, lineHeight: 1 }}>
                    #{activeOrder.orderId || activeOrder.orderNo}
                  </h2>
                  <button
                    type="button"
                    onClick={() => handleCopyOrderId(activeOrder.orderId || activeOrder.orderNo)}
                    style={{
                      background: copied ? '#dcfce7' : '#f1f5f9',
                      color: copied ? '#15803d' : '#64748b',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                    title="Copy Order ID"
                  >
                    {copied ? <Check size={12} color="#15803d" /> : <Copy size={12} />}
                    <span>{copied ? (language === 'ta' ? 'நகலெடுக்கப்பட்டது!' : 'Copied!') : (language === 'ta' ? 'நகலெடு' : 'Copy')}</span>
                  </button>
                </div>

                {/* Status Badges Row */}
                <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '0.2rem 0.65rem', borderRadius: '9999px', fontSize: '0.725rem', fontWeight: 800, textTransform: 'uppercase' }}>
                    Status: {activeOrder.orderStatus || 'Confirmed'}
                  </span>
                  <span style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '0.2rem 0.65rem', borderRadius: '9999px', fontSize: '0.725rem', fontWeight: 800, textTransform: 'uppercase' }}>
                    Payment: {activeOrder.paymentStatus || 'Verified'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsProductsModalOpen(true)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      background: 'linear-gradient(135deg, #d90429 0%, #ef233c 100%)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '9999px',
                      padding: '0.3rem 0.85rem',
                      fontSize: '0.725rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(217, 4, 41, 0.25)'
                    }}
                  >
                    <Eye size={13} />
                    <span>{language === 'ta' ? 'பொருட்கள்' : 'View Products'}</span>
                    {activeOrder.items?.length > 0 && (
                      <span style={{ background: '#ffffff', color: '#d90429', borderRadius: '50%', width: '17px', height: '17px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.675rem', fontWeight: 900 }}>
                        {activeOrder.items.length}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Last Update Info */}
              <div className="tracking-last-update" style={{ minWidth: '130px' }}>
                <div style={{ fontSize: '0.725rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Clock size={12} color="#64748b" />
                  <span>{language === 'ta' ? 'கடைசி புதுப்பிப்பு' : 'LAST UPDATE'}</span>
                </div>
                <div style={{ fontWeight: 900, color: '#059669', fontSize: '0.95rem', marginTop: '0.15rem' }}>
                  {formatTrackingTimestamp(activeOrder.updatedAt || activeOrder.createdAt || activeOrder.orderDate || 'Just now')}
                </div>
              </div>
            </div>

            {/* REACT NATIVE STYLE TIMELINE */}
            <div style={{ marginBottom: '1.75rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0f172a', marginBottom: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Truck size={17} color="var(--crimson-red, #d90429)" />
                <span>{language === 'ta' ? 'டெலிவரி முன்னேற்ற நிலைகள்' : 'Shipment Progress Timeline'}</span>
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {(() => {
                  const historyArr = activeOrder.trackingHistory || [
                    { title: 'Order Placed', time: activeOrder.createdAt || activeOrder.orderDate || 'Just now', completed: true, desc: 'Your order was successfully placed.' },
                    { title: 'Order Confirmed', time: 'Processing', completed: activeOrder.orderStatus !== 'Pending', desc: 'Payment and order details verified.' },
                    { title: 'Processing & Packing', time: 'Upcoming', completed: false, desc: 'Safety packaging and quality inspection.' },
                    { title: 'Ready / Dispatched', time: 'Upcoming', completed: false, desc: 'Dispatched with courier partner.' },
                    { title: 'Completed / Delivered', time: 'Upcoming', completed: false, desc: 'Delivered to your address.' }
                  ];

                  return historyArr.map((step, idx) => {
                    const isCompleted = step.completed;
                    const currentStepNum = activeOrder.currentStep || 1;
                    const isActive = !isCompleted && currentStepNum === idx + 1;
                    
                    const formattedTime = formatTrackingTimestamp(step.time);

                    return (
                      <div key={idx} style={{ display: 'flex', alignItems: 'stretch', gap: '1rem' }}>
                        {/* Vertically Locked Column for Connector Line & Circle Node */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '36px', flexShrink: 0 }}>
                          {/* Line segment above circle */}
                          <div 
                            style={{ 
                              width: '3px', 
                              height: '14px', 
                              background: idx === 0 ? 'transparent' : (isCompleted ? '#d90429' : '#e2e8f0'),
                              borderRadius: '9999px'
                            }} 
                          />

                          {/* Node Circle */}
                          <div 
                            style={{ 
                              width: '36px', 
                              height: '36px', 
                              borderRadius: '50%', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center', 
                              fontWeight: 900,
                              fontSize: '0.85rem',
                              flexShrink: 0,
                              background: isCompleted 
                                ? '#d90429' 
                                : isActive 
                                ? '#ffffff' 
                                : '#ffffff',
                              color: isCompleted 
                                ? '#ffffff' 
                                : isActive 
                                ? '#d90429' 
                                : '#64748b',
                              border: isCompleted 
                                ? '2px solid #d90429' 
                                : isActive 
                                ? '2.5px solid #d90429' 
                                : '2px solid #cbd5e1',
                              boxShadow: isActive 
                                ? '0 0 0 5px rgba(217, 4, 41, 0.2)' 
                                : isCompleted 
                                ? '0 2px 8px rgba(217, 4, 41, 0.25)' 
                                : '0 2px 6px rgba(0,0,0,0.03)',
                              transition: 'all 0.2s ease',
                              zIndex: 2
                            }}
                          >
                            {isCompleted ? <Check size={18} strokeWidth={3} color="#ffffff" /> : idx + 1}
                          </div>

                          {/* Line segment below circle */}
                          <div 
                            style={{ 
                              width: '3px', 
                              flex: 1, 
                              minHeight: '22px', 
                              background: idx === historyArr.length - 1 ? 'transparent' : (isCompleted && historyArr[idx + 1]?.completed ? '#d90429' : '#e2e8f0'),
                              borderRadius: '9999px'
                            }} 
                          />
                        </div>

                        {/* Content Card */}
                        <div style={{ flex: 1, paddingBottom: idx === historyArr.length - 1 ? '0' : '1.15rem' }}>
                          <div 
                            style={{ 
                              background: isCompleted || isActive ? '#fffdf5' : '#ffffff', 
                              padding: '0.85rem 1rem', 
                              borderRadius: '16px', 
                              border: isActive ? '1.5px solid #fef08a' : '1px solid #e2e8f0',
                              boxShadow: isActive ? '0 4px 16px rgba(245, 158, 11, 0.08)' : 'none'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' }}>
                              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: isCompleted || isActive ? '#0f172a' : '#64748b', margin: 0 }}>
                                {step.title}
                              </h4>
                              {formattedTime && (
                                <span 
                                  style={{ 
                                    fontSize: '0.725rem', 
                                    color: isCompleted ? '#059669' : isActive ? 'var(--crimson-red, #d90429)' : '#94a3b8', 
                                    fontWeight: 800, 
                                    background: isCompleted ? '#ecfdf5' : isActive ? '#fff1f2' : '#f8fafc', 
                                    border: isCompleted ? '1px solid #a7f3d0' : '1px solid #f1f5f9',
                                    padding: '0.18rem 0.6rem', 
                                    borderRadius: '9999px' 
                                  }}
                                >
                                  {formattedTime}
                                </span>
                              )}
                            </div>
                            <p style={{ fontSize: '0.825rem', color: '#475569', margin: '0.3rem 0 0 0', lineHeight: 1.45 }}>
                              {step.desc}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            {/* Destination Address Info Box */}
            <div style={{ background: '#f8fafc', padding: '1.15rem 1.25rem', borderRadius: '18px', border: '1.5px solid #e2e8f0', marginTop: '1.5rem' }}>
              <div style={{ fontSize: '0.725rem', fontWeight: 900, color: 'var(--crimson-red, #d90429)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.45rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <MapPin size={14} color="var(--crimson-red, #d90429)" /> 
                <span>{language === 'ta' ? 'டெலிவரி முகவரி' : 'DESTINATION DELIVERY ADDRESS'}</span>
              </div>
              <div style={{ fontSize: '0.9rem', color: '#0f172a', lineHeight: 1.5 }}>
                <strong style={{ fontSize: '0.975rem', color: '#0f172a', fontWeight: 800 }}>
                  {activeOrder.customerName || 'Valued Customer'}
                </strong> 
                {activeOrder.phone ? <span style={{ color: '#475569', marginLeft: '0.35rem' }}>({activeOrder.phone})</span> : ''}
                <br />
                <span style={{ color: '#475569', display: 'block', marginTop: '0.2rem' }}>
                  {[activeOrder.address, activeOrder.city, activeOrder.district, activeOrder.state].filter(Boolean).join(', ')} 
                  {activeOrder.pincode ? ` - ${activeOrder.pincode}` : ''}
                </span>
              </div>
            </div>

            {/* Store Support Action Buttons */}
            <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1.15rem', borderTop: '1.5px dashed #e2e8f0' }}>
              <div style={{ fontSize: '0.825rem', color: '#64748b', fontWeight: 700 }}>
                {language === 'ta' ? 'ஆர்டர் பற்றி சந்தேகமா? எங்கள் சேவையைத் தொடர்பு கொள்ளவும்.' : 'Have questions regarding your delivery status?'}
              </div>
              <div className="mobile-support-btns" style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                <a
                  href={`https://wa.me/${whatsappNumber}?text=Hello%20${encodeURIComponent(shopName || 'SDS Crackers')},%20I%20am%20checking%20status%20for%20Order%20ID:%20${encodeURIComponent(activeOrder.orderId || activeOrder.orderNo)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: '#16a34a',
                    color: '#ffffff',
                    padding: '0.55rem 1.1rem',
                    borderRadius: '14px',
                    textDecoration: 'none',
                    fontWeight: 800,
                    fontSize: '0.825rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    boxShadow: '0 4px 12px rgba(22, 163, 74, 0.25)'
                  }}
                >
                  <MessageSquare size={15} />
                  <span>{language === 'ta' ? 'வாட்ஸ்அப்பில் கேளுங்கள்' : 'WhatsApp Support'}</span>
                </a>
                <a
                  href={`tel:${supportPhone}`}
                  style={{
                    background: '#0f172a',
                    color: '#ffffff',
                    padding: '0.55rem 1.1rem',
                    borderRadius: '14px',
                    textDecoration: 'none',
                    fontWeight: 800,
                    fontSize: '0.825rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <Phone size={15} />
                  <span>{language === 'ta' ? 'அழைக்க' : 'Call Store'}</span>
                </a>
              </div>
            </div>

          </div>
        )}

        {/* REACT NATIVE APP STYLE BOTTOM SHEET MODAL */}
        {isProductsModalOpen && activeOrder && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(6px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: '1rem',
            }}
            onClick={() => setIsProductsModalOpen(false)}
          >
            <div
              className="mobile-app-bottom-sheet"
              style={{
                background: '#ffffff',
                borderRadius: '24px',
                width: '100%',
                maxWidth: '560px',
                maxHeight: '85vh',
                overflowY: 'auto',
                boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
                padding: '1.25rem 1.5rem',
                position: 'relative'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Native App Drag Handle Pill */}
              <div style={{ width: '38px', height: '4px', background: '#cbd5e1', borderRadius: '9999px', margin: '0 auto 0.85rem' }} />

              {/* Modal Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.15rem', paddingBottom: '0.75rem', borderBottom: '1.5px solid #f1f5f9' }}>
                <div>
                  <div style={{ fontSize: '0.725rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {language === 'ta' ? 'ஆர்டர் செய்யப்பட்ட பொருட்கள்' : 'ORDERED PRODUCTS LIST'}
                  </div>
                  <h3 style={{ fontSize: '1.3rem', color: 'var(--crimson-red, #d90429)', fontWeight: 900, margin: '0.1rem 0 0 0' }}>
                    #{activeOrder.orderId || activeOrder.orderNo}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsProductsModalOpen(false)}
                  style={{
                    background: '#f1f5f9',
                    border: 'none',
                    borderRadius: '50%',
                    width: '34px',
                    height: '34px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#64748b'
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Items List */}
              {(() => {
                const modalItems = activeOrder.items || [];
                const calcTotal = modalItems.reduce((sum, item) => {
                  const uPrice = item.price || item.unit_price || 0;
                  const qty = item.quantity || 1;
                  return sum + (item.total_price || (uPrice * qty));
                }, 0);
                const modalTotal = activeOrder.totalAmount || activeOrder.payable_amount || calcTotal;

                if (modalItems.length === 0) {
                  return (
                    <div style={{ padding: '1.75rem 1rem', textAlign: 'center', color: '#64748b', fontWeight: 700 }}>
                      <Box size={32} color="#94a3b8" style={{ marginBottom: '0.4rem' }} />
                      <div style={{ fontSize: '0.9rem' }}>{language === 'ta' ? 'இந்த ஆர்டருக்கான பொருட்கள் விபரம் காணப்படவில்லை.' : 'No detailed item breakdown recorded for this order ID.'}</div>
                    </div>
                  );
                }

                return (
                  <div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.15rem' }}>
                      {modalItems.map((item, idx) => {
                        const itemName = item.name || item.product_name || `Product #${item.product_id || idx + 1}`;
                        const itemQty = item.quantity || 1;
                        const itemPrice = item.price || item.unit_price || 0;
                        const itemTotal = item.total_price || (itemPrice * itemQty);
                        const itemImage = item.image || item.image_url || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=400';

                        return (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', background: '#f8fafc', padding: '0.75rem 0.85rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: '1 1 auto', minWidth: 0 }}>
                              <img src={itemImage} alt={itemName} loading="lazy" decoding="async" style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover', border: '1px solid #cbd5e1', flexShrink: 0 }} />
                              <div style={{ minWidth: 0, flex: 1 }}>
                                <div style={{ fontWeight: 800, fontSize: '0.875rem', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {itemName}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, marginTop: '2px' }}>
                                  Qty: <span style={{ color: '#0f172a', fontWeight: 800 }}>{itemQty}</span> {itemPrice > 0 ? `× ₹${itemPrice}` : ''}
                                </div>
                              </div>
                            </div>
                            {itemTotal > 0 && (
                              <div style={{ fontWeight: 900, fontSize: '0.95rem', color: 'var(--crimson-red, #d90429)', flexShrink: 0 }}>
                                ₹{itemTotal}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Summary Footer */}
                    <div style={{ background: '#fffdf5', padding: '0.85rem 1.15rem', borderRadius: '16px', border: '1.5px solid #fef08a', marginBottom: '1.15rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.825rem', color: '#475569', fontWeight: 700 }}>
                        <span>{language === 'ta' ? 'பொருட்களின் எண்ணிக்கை' : 'Total Items'}:</span>
                        <span>{modalItems.length}</span>
                      </div>
                      {modalTotal > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 900, color: 'var(--crimson-red, #d90429)', paddingTop: '0.45rem', borderTop: '1.5px dashed #fef08a' }}>
                          <span>{language === 'ta' ? 'மொத்தத் தொகை' : 'Total Amount'}:</span>
                          <span>₹{modalTotal}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              <button
                type="button"
                onClick={() => setIsProductsModalOpen(false)}
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  borderRadius: '16px',
                  background: '#0f172a',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.925rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)'
                }}
              >
                {language === 'ta' ? 'மூடு' : 'Close Details'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
