import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Award, Truck, Tag, Flame } from 'lucide-react';
import { FireworksCanvas } from './FireworksCanvas';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

const MotionLink = motion.create ? motion.create(Link) : motion(Link);

// Stagger animation container for feature pills
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const pillVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.85 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 350, damping: 22 },
  },
};

export const HeroBanner = () => {
  const { totalItemsCount, subtotal } = useCart();
  const { activeTheme, homeBgUrl, primaryColor, secondaryColor, textColor } = useTheme();

  const ribbonBgColor = activeTheme?.primary_color || primaryColor || 'var(--theme-primary, #FFC107)';
  const ribbonTextColor = activeTheme?.text_color || textColor || 'var(--theme-text, #0f172a)';
  const secBgColor = activeTheme?.secondary_color || secondaryColor || 'var(--theme-secondary, #FF5722)';
  const secTextColor = activeTheme?.text_color || textColor || 'var(--theme-text, #ffffff)';
  const titleColor = activeTheme?.title_color || activeTheme?.hero_title_color || '#ffffff';
  const subtitleColor = activeTheme?.subtitle_color || '#e2e8f0';
  
  const defaultBg = `${import.meta.env.BASE_URL}img/home.png`;
  const [bgImage, setBgImage] = useState(defaultBg);

  useEffect(() => {
    if (homeBgUrl) {
      const img = new Image();
      img.src = homeBgUrl;
      img.onload = () => setBgImage(homeBgUrl);
      img.onerror = () => setBgImage(defaultBg);
    } else {
      setBgImage(defaultBg);
    }
  }, [homeBgUrl, defaultBg]);

  const heroStyle = {
    backgroundImage: `url("${bgImage}")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  return (
    <section className="poster-hero-banner" style={heroStyle}>
      <FireworksCanvas />
      <div className="container hero-banner-container">
        {/* Left Content Column */}
        <motion.div
          className="hero-poster-content"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {/* Top Ribbon Badge */}
          <motion.div
            className="hero-ribbon-badge"
            style={{
              background: secBgColor,
              color: secTextColor,
            }}
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
          >
            <motion.span
              animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
              style={{ display: 'inline-flex' }}
            >
              <Sparkles size={16} color={secTextColor} />
            </motion.span>
            <span style={{ color: secTextColor }}>{activeTheme?.banner_text || "LIGHT UP HAPPINESS"}</span>
            <motion.span
              animate={{ rotate: [0, -15, 15, 0], scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut', delay: 0.3 }}
              style={{ display: 'inline-flex' }}
            >
              <Sparkles size={16} color={secTextColor} />
            </motion.span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            className="hero-poster-title"
            style={{ color: titleColor }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {activeTheme?.hero_title ? (
              <span style={{ color: titleColor }}>{activeTheme.hero_title}</span>
            ) : (
              <>CELEBRATE <span className="gold-highlight">EVERY MOMENT</span></>
            )}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="hero-poster-subtitle"
            style={{ color: subtitleColor }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {activeTheme?.hero_subtitle || activeTheme?.description || "Premium Quality Crackers for a Safe & Spectacular Celebration!"}
          </motion.p>

          {/* Animated Feature Badges Row */}
          <motion.div
            className="hero-features-row"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* 1. 100% SAFE */}
            <motion.div
              className="feature-pill"
              style={{
                background: secBgColor,
                color: secTextColor,
                borderColor: ribbonBgColor,
              }}
              variants={pillVariants}
              whileHover={{
                scale: 1.08,
                y: -4,
                boxShadow: `0 8px 22px ${ribbonBgColor}88`,
              }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                style={{ display: 'inline-flex' }}
              >
                <ShieldCheck size={16} color="#ffc107" />
              </motion.div>
              <span style={{ color: secTextColor }}>100% SAFE</span>
            </motion.div>

            {/* 2. PREMIUM QUALITY */}
            <motion.div
              className="feature-pill"
              style={{
                background: secBgColor,
                color: secTextColor,
                borderColor: ribbonBgColor,
              }}
              variants={pillVariants}
              whileHover={{
                scale: 1.08,
                y: -4,
                boxShadow: `0 8px 22px ${ribbonBgColor}88`,
              }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ rotate: [0, -12, 12, 0] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                style={{ display: 'inline-flex' }}
              >
                <Award size={16} color="#ffc107" />
              </motion.div>
              <span style={{ color: secTextColor }}>PREMIUM QUALITY</span>
            </motion.div>

            {/* 3. FAST DELIVERY */}
            <motion.div
              className="feature-pill"
              style={{
                background: secBgColor,
                color: secTextColor,
                borderColor: ribbonBgColor,
              }}
              variants={pillVariants}
              whileHover={{
                scale: 1.08,
                y: -4,
                boxShadow: `0 8px 22px ${ribbonBgColor}88`,
              }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ x: [0, 3, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                style={{ display: 'inline-flex' }}
              >
                <Truck size={16} color="#ffc107" />
              </motion.div>
              <span style={{ color: secTextColor }}>FAST DELIVERY</span>
            </motion.div>

            {/* 4. BEST PRICES */}
            <motion.div
              className="feature-pill"
              style={{
                background: secBgColor,
                color: secTextColor,
                borderColor: ribbonBgColor,
              }}
              variants={pillVariants}
              whileHover={{
                scale: 1.08,
                y: -4,
                boxShadow: `0 8px 22px ${ribbonBgColor}88`,
              }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                style={{ display: 'inline-flex' }}
              >
                <Tag size={16} color="#ffc107" />
              </motion.div>
              <span style={{ color: secTextColor }}>BEST PRICES</span>
            </motion.div>
          </motion.div>

          {/* Animated Hero CTA Buttons */}
          <motion.div
            className="hero-poster-cta"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
          >
            {/* Primary Action: SHOP CRACKERS NOW */}
            <MotionLink
              to="/products"
              className="btn-yellow-hero"
              style={{
                background: 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)',
                color: '#0f172a',
                border: 'none',
              }}
              whileHover={{
                scale: 1.05,
                y: -4,
                boxShadow: '0 14px 35px rgba(255, 193, 7, 0.65)',
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              <motion.span
                animate={{ rotate: [0, -15, 15, 0], scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                style={{ display: 'inline-flex', alignItems: 'center' }}
              >
                <Sparkles size={20} color="var(--crimson-red)" />
              </motion.span>
              <span style={{ color: '#0f172a', fontWeight: 900 }}>SHOP CRACKERS NOW</span>
              <motion.div
                animate={{ x: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                style={{ display: 'inline-flex', alignItems: 'center' }}
              >
                <ArrowRight size={20} color="#0f172a" />
              </motion.div>
            </MotionLink>

            {/* Secondary Action: View Festival Offers */}
            <MotionLink
              to="/offers"
              className="btn-glass-hero"
              style={{
                background: 'rgba(15, 23, 42, 0.65)',
                color: '#ffffff',
                border: '1.8px solid #ffc107',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
              }}
              whileHover={{
                scale: 1.05,
                y: -4,
                boxShadow: '0 10px 28px rgba(255, 193, 7, 0.35)',
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.25, 1, 1.3, 1],
                  rotate: [0, -8, 8, -5, 0],
                }}
                transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                style={{ display: 'inline-flex', alignItems: 'center' }}
              >
                <Flame size={19} color="#ffc107" fill="#ffc107" />
              </motion.div>
              <span style={{ color: '#ffffff', fontWeight: 800 }}>View Festival Offers</span>
            </MotionLink>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
