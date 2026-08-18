import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HeroBanner } from '../components/HeroBanner';
import { BrandPartners } from '../components/BrandPartners';
import { DeepavaliCountdown } from '../components/DeepavaliCountdown';
import { FireworksVideoShowcase } from '../components/FireworksVideoShowcase';
import { OffersProductSection } from '../components/OffersProductSection';
import { ProductCard } from '../components/ProductCard';
import { getProducts, getComboPacks } from '../services/productService';
import { safetyRules } from '../data/safetyGuidelines';
import { useWebControl } from '../context/WebControlContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  ArrowRight, ShieldCheck, Gift, Phone, MessageSquare, Send, Sparkles, 
  FileText, MapPin, Ruler, PhoneCall, Clock, CheckCircle2, Headphones, Truck 
} from 'lucide-react';

export const Home = () => {
  const { phone, whatsapp, formattedWhatsapp, formattedPhone, shopName } = useWebControl();
  const { language, t } = useLanguage();
  const [productList, setProductList] = useState([]);
  const [comboList, setComboList] = useState([]);
  const [loadingCombos, setLoadingCombos] = useState(true);

  const contactPhone = formattedPhone || '917010922428';
  const whatsappNum = formattedWhatsapp || '917010922428';

  useEffect(() => {
    let isMounted = true;

    // Fetch products & live combo packs from /crackers/getcombo-packs API
    Promise.all([
      getProducts().catch(err => { console.warn('Failed products fetch:', err); return []; }),
      getComboPacks().catch(err => { console.warn('Failed combo packs API fetch:', err); return []; })
    ]).then(([productsData, combosData]) => {
      if (!isMounted) return;
      setProductList(productsData || []);
      setComboList(combosData || []);
      setLoadingCombos(false);
    });

    return () => { isMounted = false; };
  }, []);

  // Use API combo packs fetched from /crackers/getcombo-packs as primary source
  const displayCombos = comboList.length > 0 
    ? comboList 
    : productList.slice(0, 8);

  return (
    <div className="home-page">
      {/* Dynamic Hero Banner Carousel */}
      <HeroBanner />

      {/* Brand Partners Showcase */}
      <BrandPartners />

      {/* Deepavali Countdown & Live Offer Banner */}
      <DeepavaliCountdown />

      {/* Fireworks Shorts / Video Reels Showcase */}
      <FireworksVideoShowcase />

      {/* Exclusive Discount Offers Section */}
      <OffersProductSection />

      {/* Live API Combo Packs Section */}
      <section className="combo-packs-section">
        <div className="container">
          <div className="combo-packs-header">
            <span className="sparkle-badge">
              <Gift size={16} /> FESTIVAL SPECIAL HAMPERS
            </span>
            <h2>
              {language === 'ta' ? 'சிறப்பு தீபாவளி காம்போ பேக்குகள்' : 'Sivakasi Special Festive Combo Packs'}
            </h2>
            <p className="combo-packs-sub">
              {language === 'ta'
                ? 'அனைத்து வகை சிவகாசி பட்டாசுகள் அடங்கிய சிறப்பு காம்போ பேக்குகள் நேரடி தொழிற்சாலை தள்ளுபடியில்.'
                : 'Complete celebration boxes with sparklers, flower pots, rockets, and sound crackers at flat discounts.'}
            </p>
          </div>

          <div className="home-offers-products-grid">
            {displayCombos.map(combo => (
              <ProductCard key={combo.id} product={combo} />
            ))}
          </div>
        </div>
      </section>

      {/* Safety Instructions & Contact Support Block */}
      <section className="home-safety-section" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)', padding: '3.5rem 0', borderTop: '1px solid #f1f5f9' }}>
        <div className="container">
          <div className="home-safety-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'stretch' }}>
            
            {/* Left Column: Guidelines & Rules */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <motion.span 
                  className="sparkle-badge" 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '0.45rem', 
                    background: '#fff1f2', 
                    border: '1.5px solid #fecdd3', 
                    padding: '0.4rem 0.95rem', 
                    borderRadius: '9999px', 
                    fontSize: '0.78rem', 
                    fontWeight: 800, 
                    color: 'var(--crimson-red)', 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.04em',
                    boxShadow: '0 2px 10px rgba(217, 4, 41, 0.06)'
                  }}
                >
                  <ShieldCheck size={16} color="var(--crimson-red)" />
                  <span>{language === 'ta' ? '100% பசுமை பட்டாசு பாதுகாப்பு' : 'SAFE CELEBRATIONS'}</span>
                </motion.span>

                <h2 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0f172a', margin: '0.85rem 0 0.6rem 0', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                  {language === 'ta' ? 'பட்டாசு பாதுகாப்பு வழிமுறைகள்' : 'Cracker Safety Guidelines'}
                </h2>

                <p style={{ color: '#475569', fontSize: '0.96rem', lineHeight: 1.6, marginBottom: '2rem', maxWidth: '620px' }}>
                  {language === 'ta'
                    ? 'உங்கள் பாதுகாப்பு எங்களின் முக்கிய முன்னுரிமையாகும். எங்களின் அனைத்து பட்டாசுகளும் CSIR-NEERI சான்றளிக்கப்பட்ட 100% பசுமை பட்டாசுகள் ஆகும்.'
                    : 'Your safety is our top priority. All our products are 100% CSIR-NEERI green certified with low sound and reduced emissions. Please read our safety guidelines.'}
                </p>

                {/* 3 Key Safety Rule Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem', marginBottom: '2.25rem' }}>
                  {safetyRules.slice(0, 3).map((rule, idx) => {
                    const ruleIcons = [
                      <FileText size={22} color="#d90429" />,
                      <MapPin size={22} color="#2563eb" />,
                      <Ruler size={22} color="#d97706" />
                    ];
                    const bgGradients = [
                      'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)',
                      'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                      'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)'
                    ];
                    const borderColors = ['#fecdd3', '#bfdbfe', '#fde68a'];
                    const leftAccents = ['#d90429', '#2563eb', '#d97706'];

                    return (
                      <motion.div
                        key={rule.id}
                        initial={{ opacity: 0, x: -15 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1, duration: 0.3 }}
                        whileHover={{ y: -3, boxShadow: '0 12px 28px rgba(0, 0, 0, 0.06)', borderColor: leftAccents[idx] }}
                        style={{
                          display: 'flex',
                          gap: '1.15rem',
                          alignItems: 'flex-start',
                          background: '#ffffff',
                          padding: '1.15rem 1.35rem',
                          borderRadius: '20px',
                          border: '1.5px solid #e2e8f0',
                          borderLeft: `4px solid ${leftAccents[idx]}`,
                          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.02)',
                          transition: 'all 0.25s ease'
                        }}
                      >
                        <div style={{ 
                          width: '46px', 
                          height: '46px', 
                          borderRadius: '14px', 
                          background: bgGradients[idx], 
                          border: `1px solid ${borderColors[idx]}`,
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          flexShrink: 0,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                        }}>
                          {ruleIcons[idx] || <ShieldCheck size={22} color="#d90429" />}
                        </div>
                        <div style={{ flex: 1 }}>
                          <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.35rem 0' }}>
                            {language === 'ta' ? rule.titleTa || rule.title : rule.title}
                          </h3>
                          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
                            {language === 'ta' ? rule.descriptionTa || rule.description : rule.description}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Full Manual CTA Button */}
              <div style={{ marginTop: '0.5rem' }}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  style={{ display: 'inline-block' }}
                >
                  <Link 
                    to="/safety" 
                    className="btn-primary home-safety-cta-btn" 
                    style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      justify: 'center', 
                      gap: '0.65rem', 
                      padding: '0.95rem 2.25rem', 
                      borderRadius: '16px', 
                      background: 'linear-gradient(135deg, #d90429 0%, #ff4d6d 100%)', 
                      color: '#ffffff', 
                      fontWeight: 900, 
                      fontSize: '0.98rem', 
                      textDecoration: 'none', 
                      boxShadow: '0 10px 28px rgba(217, 4, 41, 0.35)',
                      border: 'none'
                    }}
                  >
                    <span>{language === 'ta' ? 'முழு பாதுகாப்பு வழிகாட்டியைப் படிக்க' : 'Read Full Safety Manual'}</span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.3, ease: 'easeInOut' }}
                      style={{ display: 'inline-flex' }}
                    >
                      <ArrowRight size={19} />
                    </motion.div>
                  </Link>
                </motion.div>
              </div>
            </div>

            {/* Right Column: 24/7 Contact Support Hub Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              style={{ 
                background: '#ffffff', 
                padding: '2.25rem 2rem', 
                borderRadius: '24px', 
                border: '1.5px solid #e2e8f0', 
                boxShadow: '0 10px 32px rgba(0, 0, 0, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                height: '100%',
                boxSizing: 'border-box'
              }}
            >
              <div>
                {/* Support Badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <span style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '0.4rem', 
                    background: '#ecfdf5', 
                    border: '1px solid #a7f3d0', 
                    color: '#059669', 
                    padding: '0.3rem 0.75rem', 
                    borderRadius: '9999px', 
                    fontSize: '0.75rem', 
                    fontWeight: 800,
                    textTransform: 'uppercase'
                  }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 8px #10b981' }}></span>
                    {language === 'ta' ? 'உடனடி ஆதரவு தயார்' : 'LIVE 24/7 SUPPORT'}
                  </span>
                  <Headphones size={20} color="#64748b" />
                </div>

                <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.5rem 0', letterSpacing: '-0.01em' }}>
                  {language === 'ta' ? 'தொடர்புகொள்ள உதவி மையம்' : 'Have Questions? Contact Support'}
                </h3>
                <p style={{ fontSize: '0.86rem', color: '#64748b', margin: '0 0 1.5rem 0', lineHeight: 1.5 }}>
                  {language === 'ta'
                    ? 'எங்கள் சிவகாசி பட்டாசு ஆலோசகர்கள் உங்களுக்கு உதவ தயாராக உள்ளனர்.'
                    : 'Our Sivakasi fireworks experts are available 24/7 to assist with your order & queries.'}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                  {/* Phone Call Card */}
                  <motion.a 
                    href={`tel:+${formattedPhone}`} 
                    whileHover={{ scale: 1.02, x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '1.15rem', 
                      background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)', 
                      padding: '1.15rem 1.25rem', 
                      borderRadius: '18px', 
                      border: '1.5px solid #fecdd3', 
                      textDecoration: 'none', 
                      boxShadow: '0 4px 14px rgba(217, 4, 41, 0.05)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#ffffff', border: '1px solid #fecdd3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 8px rgba(217, 4, 41, 0.1)' }}>
                      <PhoneCall color="#d90429" size={22} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.725rem', color: '#be123c', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {language === 'ta' ? 'தொலைபேசி உதவி' : 'PHONE CALL ASSISTANCE'}
                      </div>
                      <div style={{ fontWeight: 900, fontSize: '1.1rem', color: '#0f172a', marginTop: '2px' }}>
                        +91 {contactPhone.replace(/^91/, '')}
                      </div>
                    </div>
                  </motion.a>

                  {/* WhatsApp Quick Chat Card */}
                  <motion.a 
                    href={`https://wa.me/${whatsappNum}?text=Hi%20${encodeURIComponent(shopName || 'SDS Crackers')},%20I%20want%20to%20enquire%20about%20crackers`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    whileHover={{ scale: 1.02, x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '1.15rem', 
                      background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', 
                      padding: '1.15rem 1.25rem', 
                      borderRadius: '18px', 
                      border: '1.5px solid #bbf7d0', 
                      textDecoration: 'none',
                      boxShadow: '0 4px 14px rgba(22, 163, 74, 0.05)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#ffffff', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 8px rgba(22, 163, 74, 0.1)' }}>
                      <MessageSquare color="#16a34a" size={22} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.725rem', color: '#15803d', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {language === 'ta' ? 'வாட்ஸ்அப் உடனடி சாட்' : 'WHATSAPP QUICK CHAT'}
                      </div>
                      <div style={{ fontWeight: 900, fontSize: '1.05rem', color: '#14532d', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span>{language === 'ta' ? 'வாட்ஸ்அப்பில் தொடர்புகொள்ள' : 'Chat on WhatsApp'}</span>
                        <ArrowRight size={16} color="#16a34a" />
                      </div>
                    </div>
                  </motion.a>

                  {/* Factory Hours & Shipping Notice */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '1rem', 
                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', 
                    padding: '1rem 1.15rem', 
                    borderRadius: '16px', 
                    border: '1.5px solid #e2e8f0' 
                  }}>
                    <Clock size={20} color="#64748b" style={{ flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: '0.78rem', color: '#334155', fontWeight: 800 }}>
                        {language === 'ta' ? 'தொழிற்சாலை நேரம்: காலை 8 - இரவு 9' : 'Factory Hours: 8:00 AM - 9:00 PM'}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '1px' }}>
                        {language === 'ta' ? 'சிவகாசி நேரடி தொழிற்சாலை விநியோகம்' : 'Sivakasi Factory Direct Express Shipping'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>
    </div>
  );
};
