import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, Tag, ArrowRight, Sparkles, Copy, Check } from 'lucide-react';
import { getCoupons } from '../services/couponService';
import { useLanguage } from '../context/LanguageContext';

const MotionLink = motion.create ? motion.create(Link) : motion(Link);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 25, scale: 0.92 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 350, damping: 24 },
  },
};

export const ExclusiveOffers = () => {
  const { language } = useLanguage();
  const [copiedCode, setCopiedCode] = useState(null);
  const [offerList, setOfferList] = useState([]);

  useEffect(() => {
    let isMounted = true;
    getCoupons().then(data => {
      if (isMounted) {
        setOfferList(data || []);
      }
    }).catch(err => {
      console.warn('Failed to fetch coupons for ExclusiveOffers:', err);
    });
    return () => { isMounted = false; };
  }, []);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <section className="exclusive-offers-section">
      <div className="container">
        {/* Section Header */}
        <motion.div
          className="exclusive-offers-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="offers-badge-pill"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{ scale: [1, 1.25, 1], rotate: [0, -8, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
              style={{ display: 'inline-flex' }}
            >
              <Flame size={15} color="#ffc107" fill="#ffc107" />
            </motion.div>
            <span>{language === 'ta' ? 'பண்டிகை சிறப்பு சலுகைகள்' : 'FESTIVAL PROMOTIONS'}</span>
          </motion.div>
          <h2 className="exclusive-offers-title">
            {language === 'ta' ? 'சிறப்பு பண்டிகை தள்ளுபடி சலுகைகள்' : 'Exclusive Festival Deals & Offers'}
          </h2>
          <p className="exclusive-offers-sub">
            {language === 'ta'
              ? 'சிவகாசி பட்டாசுகளுக்கு கூடுதல் தள்ளுபடி பெற பிரத்யேக கூப்பன் கோடுகளைப் பயன்படுத்துங்கள்!'
              : 'Pre-book Sivakasi crackers with instant discount coupon codes & heavy combo discounts!'}
          </p>
        </motion.div>

        {/* Offers Grid */}
        <motion.div
          className="exclusive-offers-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
        >
          {offerList.map((offer) => {
            const isCopied = copiedCode === offer.code;
            return (
              <motion.div
                key={offer.id}
                className="exclusive-offer-card"
                style={{ background: offer.bannerBg }}
                variants={cardVariants}
                whileHover={{
                  y: -6,
                  scale: 1.02,
                  boxShadow: '0 18px 40px rgba(0, 0, 0, 0.22)',
                }}
                transition={{ duration: 0.25 }}
              >
                <div className="offer-card-top">
                  <div className="offer-card-badge">
                    <Sparkles size={14} color="#ffc107" />
                    <span>{language === 'ta' ? offer.titleTa || offer.title : offer.title}</span>
                  </div>
                  <h3 className="offer-card-tagline">
                    {language === 'ta' ? offer.taglineTa || offer.tagline : offer.tagline}
                  </h3>
                  <p className="offer-card-desc">
                    {language === 'ta' ? offer.descriptionTa || offer.description : offer.description}
                  </p>
                </div>

                <div className="offer-card-bottom">
                  {/* Coupon Code Pill */}
                  <motion.button
                    className="offer-code-pill"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCopyCode(offer.code)}
                    title="Click to copy coupon code"
                  >
                    <Tag size={14} color="#ffc107" />
                    <span>CODE: <strong>{offer.code}</strong></span>
                    {isCopied ? <Check size={14} color="#10b981" /> : <Copy size={13} color="rgba(255,255,255,0.7)" />}
                  </motion.button>

                  {/* CTA Button */}
                  <MotionLink
                    to="/offers"
                    className="offer-cta-btn"
                    whileHover={{ scale: 1.05, x: 2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>{language === 'ta' ? offer.ctaTextTa || offer.ctaText : offer.ctaText}</span>
                    <motion.div
                      animate={{ x: [0, 4, 0] }}
                      transition={{ repeat: Infinity, duration: 1.2 }}
                      style={{ display: 'inline-flex' }}
                    >
                      <ArrowRight size={16} />
                    </motion.div>
                  </MotionLink>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
