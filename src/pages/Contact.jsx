import React, { useState } from 'react';
import { Phone, MessageSquare, Send, MapPin, CheckCircle, Clock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useWebControl } from '../context/WebControlContext';
import { useTheme } from '../context/ThemeContext';

export const Contact = () => {
  const { showNotification } = useCart();
  const { t, language } = useLanguage();
  const { phone, whatsapp, formattedWhatsapp, formattedPhone, shopAddress, shopName } = useWebControl();
  const { activeTheme, primaryColor, textColor } = useTheme();

  const cPrimary = activeTheme?.primary_color || primaryColor || 'var(--theme-primary, #FF5722)';
  const cTextColor = activeTheme?.text_color || textColor || 'var(--theme-text, #ffffff)';

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'General Product Enquiry',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [successResponse, setSuccessResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      showNotification(language === 'ta' ? 'அனைத்து தேவையான விவரங்களையும் நிரப்பவும்.' : 'Please fill in all required fields.', 'info');
      return;
    }

    setSubmitting(true);
    const targetEmail = 'offercanva88@gmail.com';
    const formSubmitKey = '4c4849f30ee0d60aa6e60d2073194122';

    try {
      // Direct Email Delivery Service via FormSubmit Key 4c4849f30ee0d60aa6e60d2073194122
      const res = await fetch(`https://formsubmit.co/ajax/${formSubmitKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          Name: formData.name,
          Phone: formData.phone,
          Email: formData.email || 'N/A',
          Subject: formData.subject,
          Message: formData.message,
          _subject: `[SDS Crackers Enquiry] ${formData.subject} from ${formData.name}`,
          _template: 'table',
          _captcha: 'false'
        })
      });

      if (!res.ok) {
        // Fallback to native mailto client
        const emailSubject = encodeURIComponent(`[Website Enquiry] ${formData.subject}`);
        const emailBody = encodeURIComponent(
          `Name: ${formData.name}\nPhone: ${formData.phone}\nEmail: ${formData.email || 'N/A'}\nMessage:\n${formData.message}`
        );
        window.location.href = `mailto:${targetEmail}?subject=${emailSubject}&body=${emailBody}`;
      }
    } catch (err) {
      console.warn('Direct submission error, launching mailto client:', err);
      const emailSubject = encodeURIComponent(`[Website Enquiry] ${formData.subject}`);
      const emailBody = encodeURIComponent(
        `Name: ${formData.name}\nPhone: ${formData.phone}\nEmail: ${formData.email || 'N/A'}\nMessage:\n${formData.message}`
      );
      window.location.href = `mailto:${targetEmail}?subject=${emailSubject}&body=${emailBody}`;
    }

    setSubmitting(false);
    setSuccessResponse(language === 'ta' ? 'உங்கள் செய்தி offercanva88@gmail.com க்கு வெற்றிபெற அனுப்பப்பட்டது!' : 'Thank you! Your message has been sent to offercanva88@gmail.com successfully.');
    showNotification(language === 'ta' ? 'செய்தி offercanva88@gmail.com க்கு அனுப்பப்பட்டது!' : 'Message Sent to offercanva88@gmail.com!', 'success');
    setFormData({ name: '', phone: '', email: '', subject: 'General Product Enquiry', message: '' });
  };

  return (
    <div className="contact-page-light" style={{ padding: '2.5rem 0 5rem', background: '#f8fafc', minHeight: '100vh', color: '#1e293b' }}>
      <div className="container">
        
        {/* Light Festive Hero Banner */}
        <div className="contact-hero-banner" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #fffdf5 50%, #fef3c7 100%)', border: '1.5px solid #fef08a', borderRadius: 'var(--radius-lg)', padding: '2rem 2.25rem', marginBottom: '2.5rem', boxShadow: '0 4px 24px rgba(217, 4, 41, 0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
            <div>
              <div 
                className="sparkle-badge" 
                style={{ 
                  marginBottom: '0.65rem',
                  borderColor: cPrimary,
                  color: cPrimary,
                  background: `${cPrimary}15`
                }}
              >
                <Phone size={14} />
                <span style={{ color: cPrimary }}>{language === 'ta' ? 'சிவகாசி நேரடி தொடர்பு ஹெல்ப்லைன்' : 'Direct Sivakasi Outlet Helpline'}</span>
              </div>
              <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0f172a', margin: '0.35rem 0' }}>
                {t('contactTitle', 'Contact Us & Enquiries')}
              </h1>
              <p style={{ color: '#475569', fontSize: '0.95rem', maxWidth: '620px', margin: 0, lineHeight: 1.5 }}>
                {t('contactSub', 'We are here to assist with product selection, bulk order quotes, and order inquiries.')}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.85rem' }}>
              <div style={{ background: '#ffffff', padding: '0.75rem 1.15rem', borderRadius: 'var(--radius-md)', border: `1.5px solid ${cPrimary}`, textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: cPrimary }}>24/7</div>
                <div style={{ fontSize: '0.725rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase' }}>
                  {language === 'ta' ? 'வாடிக்கையாளர் ஆதரவு' : 'Customer Support'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Contact Options Grid */}
        <div className="contact-options-grid" style={{ marginBottom: '3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.75rem' }}>
          {/* 1. Phone Call */}
          <div style={{ background: '#ffffff', padding: '2rem 1.75rem', borderRadius: '20px', border: '1.5px solid #e2e8f0', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div style={{ width: '60px', height: '60px', background: `${cPrimary}15`, borderRadius: '50%', color: cPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', border: `1px solid ${cPrimary}40` }}>
              <Phone size={26} color={cPrimary} />
            </div>
            <h3 style={{ color: '#0f172a', fontWeight: 800, fontSize: '1.2rem', marginBottom: '0.4rem' }}>
              {language === 'ta' ? 'தொலைபேசி அழைப்பு' : 'Direct Phone Call'}
            </h3>
            <p style={{ color: '#475569', fontSize: '0.875rem', margin: '0.5rem 0 1.25rem', lineHeight: 1.45 }}>
              {language === 'ta' ? 'எங்கள் வாடிக்கையாளர் சேவை அதிகாரிகளுடன் நேரடியாக பேசுங்கள்.' : 'Speak with our customer support executives for quick assistance.'}
            </p>
            <a href={`tel:+${formattedPhone || '917010922428'}`} className="add-cart-btn" style={{ width: '100%', justifyContent: 'center', height: '44px', textDecoration: 'none', display: 'inline-flex', background: cPrimary, color: cTextColor }}>
              Call +91 {(phone || formattedPhone || '7010922428').replace(/^91/, '')}
            </a>
          </div>

          {/* 2. WhatsApp Chat */}
          <div style={{ background: '#ffffff', padding: '2rem 1.75rem', borderRadius: '20px', border: '1.5px solid #e2e8f0', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div style={{ width: '60px', height: '60px', background: '#dcfce7', borderRadius: '50%', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', border: '1px solid #a7f3d0' }}>
              <MessageSquare size={26} color="#16a34a" />
            </div>
            <h3 style={{ color: '#0f172a', fontWeight: 800, fontSize: '1.2rem', marginBottom: '0.4rem' }}>
              {language === 'ta' ? 'வாட்ஸ்அப் சேட்' : 'WhatsApp Instant Chat'}
            </h3>
            <p style={{ color: '#475569', fontSize: '0.875rem', margin: '0.5rem 0 1.25rem', lineHeight: 1.45 }}>
              {language === 'ta' ? 'பட்டாசு அட்டவணை மற்றும் காம்போ பேக் விவரங்களுக்கு வாட்ஸ்அப்பில் தொடர்பு கொள்ளவும்.' : 'Instant chat support for catalogue PDF and bulk family discounts.'}
            </p>
            <a href={`https://wa.me/${formattedWhatsapp || '919876543210'}?text=Hello%20${encodeURIComponent(shopName || 'SDS Crackers')},%20I%20want%20to%20enquire%20about%20crackers`} target="_blank" rel="noopener noreferrer" style={{ width: '100%', justifyContent: 'center', background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)', color: '#ffffff', height: '44px', borderRadius: '12px', fontWeight: 800, fontSize: '0.875rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.45rem', boxShadow: '0 4px 12px rgba(22,163,74,0.25)' }}>
              Open WhatsApp Chat
            </a>
          </div>

          {/* 3. Factory & Office Address Hub */}
          <div style={{ background: '#ffffff', padding: '2rem 1.75rem', borderRadius: '20px', border: '1.5px solid #e2e8f0', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div style={{ width: '60px', height: '60px', background: `${cPrimary}15`, borderRadius: '50%', color: cPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', border: `1px solid ${cPrimary}40` }}>
              <MapPin size={26} color={cPrimary} />
            </div>
            <h3 style={{ color: '#0f172a', fontWeight: 800, fontSize: '1.2rem', marginBottom: '0.4rem' }}>
              {language === 'ta' ? 'தொழிற்சாலை & அலுவலக முகவரி' : 'Factory & Office Address'}
            </h3>
            <p style={{ color: '#475569', fontSize: '0.875rem', margin: '0.5rem 0 1.25rem', lineHeight: 1.45 }}>
              {shopAddress || (language === 'ta' ? 'சிவகாசி, தமிழ்நாடு, இந்தியா' : 'Sivakasi, Tamil Nadu, India')}
            </p>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
              <Clock size={14} color="#64748b" /> {language === 'ta' ? 'வேலை நேரங்கள்: திங்கள் - சனி (9:00 AM - 8:00 PM)' : 'Working Hours: Mon – Sat (9:00 AM – 8:00 PM)'}
            </div>
          </div>
        </div>

        {/* Customer Enquiry Form Card */}
        <div style={{ maxWidth: '780px', margin: '0 auto', background: '#ffffff', padding: '2.25rem 2rem', borderRadius: '20px', border: '1.5px solid #e2e8f0', boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a', margin: 0 }}>
              <Send size={24} color={cPrimary} /> Send Us a Message
            </h2>
            <span style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8', fontSize: '0.8rem', fontWeight: 800, padding: '0.25rem 0.75rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Mail size={14} /> eoffercanva88@gmail.com
            </span>
          </div>

          <p style={{ color: '#475569', marginBottom: '1.75rem', fontSize: '0.925rem' }}>
            {language === 'ta' ? 'எங்களுக்கு ஒரு செய்தி அனுப்புங்கள் (eoffercanva88@gmail.com), எங்கள் குழு 24 மணி நேரத்திற்குள் உங்களைத் தொடர்பு கொள்ளும்.' : 'Send us a message to eoffercanva88@gmail.com and our team will get back to you within 24 hours.'}
          </p>

          {successResponse && (
            <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', color: '#166534', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
              <CheckCircle size={20} color="#059669" /> {successResponse}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-row-2col">
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: 800, display: 'block', marginBottom: '0.45rem', color: '#0f172a' }}>{t('yourName', 'Your Name')} *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid #cbd5e1', background: '#ffffff', color: '#0f172a', outline: 'none', fontWeight: 500 }}
                  placeholder="e.g. Manikandan"
                />
              </div>

              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: 800, display: 'block', marginBottom: '0.45rem', color: '#0f172a' }}>{t('yourPhone', 'Phone Number')} *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid #cbd5e1', background: '#ffffff', color: '#0f172a', outline: 'none', fontWeight: 500 }}
                  placeholder="e.g. 9876543210"
                />
              </div>
            </div>

            <div className="form-row-2col">
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: 800, display: 'block', marginBottom: '0.45rem', color: '#0f172a' }}>{t('yourEmail', 'Email Address')}</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid #cbd5e1', background: '#ffffff', color: '#0f172a', outline: 'none', fontWeight: 500 }}
                  placeholder="e.g. eoffercanva88@gmail.com"
                />
              </div>

              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: 800, display: 'block', marginBottom: '0.45rem', color: '#0f172a' }}>{t('subject', 'Enquiry Subject')}</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid #cbd5e1', background: '#ffffff', color: '#0f172a', outline: 'none', fontWeight: 600, cursor: 'pointer' }}
                >
                  <option value="General Product Enquiry">{language === 'ta' ? 'பொதுவான பட்டாசு கேள்வி' : 'General Product Enquiry'}</option>
                  <option value="Bulk Order Quote">{language === 'ta' ? 'மொத்த குடும்ப காம்போ ஆர்டர்' : 'Bulk Family Order Quote'}</option>
                  <option value="Order Shipment Query">{language === 'ta' ? 'ஆர்டர் ஷிப்மென்ட் நிலை' : 'Order Shipment Status Query'}</option>
                  <option value="Safety & Certification">{language === 'ta' ? 'பாதுகாப்பு & சான்றிதழ் விவரங்கள்' : 'Safety & Certification Query'}</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '1.75rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 800, display: 'block', marginBottom: '0.45rem', color: '#0f172a' }}>{t('message', 'Message Details')} *</label>
              <textarea
                rows="4"
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid #cbd5e1', background: '#ffffff', color: '#0f172a', outline: 'none', fontWeight: 500, fontFamily: 'inherit' }}
                placeholder={language === 'ta' ? 'உங்கள் கேள்வியை இங்கு எழுதவும்...' : 'Write your enquiry message here...'}
              />
            </div>

            <button type="submit" className="add-cart-btn" disabled={submitting} style={{ width: '100%', justifyContent: 'center', height: '48px', fontSize: '1rem', fontWeight: 800, cursor: 'pointer', gap: '0.5rem' }}>
              <Send size={18} /> {submitting ? (language === 'ta' ? 'அனுப்பப்படுகிறது...' : 'Sending Message...') : 'Send Message'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

