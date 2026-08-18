import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Sparkles, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useWebControl } from '../context/WebControlContext';
import { FireworksCanvas } from './FireworksCanvas';

const MotionLink = motion.create ? motion.create(Link) : motion(Link);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const boxVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.85 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 360, damping: 22 },
  },
};

export const DeepavaliCountdown = () => {
  const { language } = useLanguage();
  const { isCountdownVisible } = useWebControl();

  // Target date for Deepavali Celebration (Nov 8, 2026)
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Set target date for Deepavali
    const targetDate = new Date('2026-11-08T00:00:00').getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  if (!isCountdownVisible) {
    return null;
  }

  const formatTwoDigits = (num) => String(num).padStart(2, '0');

  const daysStr = timeLeft.days > 99 ? String(timeLeft.days) : formatTwoDigits(timeLeft.days);
  const hoursStr = formatTwoDigits(timeLeft.hours);
  const minutesStr = formatTwoDigits(timeLeft.minutes);
  const secondsStr = formatTwoDigits(timeLeft.seconds);

  return (
    <section className="deepavali-countdown-section">
      <div className="container">
        <motion.div
          className="deepavali-countdown-card"
          initial={{ opacity: 0, scale: 0.94, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          style={{ position: 'relative', overflow: 'hidden' }}
        >
          {/* Animated Festive Fireworks Canvas Background */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.65, zIndex: 1 }}>
            <FireworksCanvas />
          </div>

          {/* Card Content Stack */}
          <div style={{ position: 'relative', zIndex: 2 }}>
            {/* Header Tagline */}
            <div className="countdown-header">
              <motion.div
                className="countdown-badge"
                whileHover={{ scale: 1.06 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <motion.span
                  animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.25, 1] }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                  style={{ display: 'inline-flex', alignItems: 'center' }}
                >
                  <Sparkles size={16} color="#ffc107" />
                </motion.span>
                <span>{language === 'ta' ? '🪔 தீபாவளி மெகா விற்பனை' : '🪔 DEEPAVALI GRAND SALE'}</span>
              </motion.div>

              <motion.h2
                className="countdown-title"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15, duration: 0.4 }}
              >
                {language === 'ta' ? 'தீபாவளி கொண்டாட்டத்திற்கு இன்னும்...' : 'Deepavali Festival Starts In'}
              </motion.h2>

              <motion.p
                className="countdown-subtitle"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.25, duration: 0.4 }}
              >
                {language === 'ta'
                  ? 'நேரடி சிவகாசி பட்டாசுகளை 50% வரை தள்ளுபடி விலையில் முன்பதிவு செய்யுங்கள்!'
                  : 'Pre-book Sivakasi factory crackers before stocks run out! Extra 50% festival discount.'}
              </motion.p>
            </div>

            {/* Glowing 4 Digits Countdown Bar */}
            <motion.div
              className="countdown-digits-grid"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {/* 1. DAYS */}
              <motion.div
                className="countdown-box"
                variants={boxVariants}
                whileHover={{
                  scale: 1.08,
                  y: -4,
                  borderColor: '#ffc107',
                  boxShadow: '0 12px 28px rgba(255, 193, 7, 0.45)',
                }}
                whileTap={{ scale: 0.95 }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={daysStr}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.2 }}
                    className="countdown-number"
                  >
                    {daysStr}
                  </motion.div>
                </AnimatePresence>
                <div className="countdown-unit">{language === 'ta' ? 'நாட்கள்' : 'DAYS'}</div>
              </motion.div>

              {/* Separator 1 */}
              <motion.div
                className="countdown-separator"
                animate={{ opacity: [0.35, 1, 0.35] }}
                transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
              >
                :
              </motion.div>

              {/* 2. HOURS */}
              <motion.div
                className="countdown-box"
                variants={boxVariants}
                whileHover={{
                  scale: 1.08,
                  y: -4,
                  borderColor: '#ffc107',
                  boxShadow: '0 12px 28px rgba(255, 193, 7, 0.45)',
                }}
                whileTap={{ scale: 0.95 }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={hoursStr}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.2 }}
                    className="countdown-number"
                  >
                    {hoursStr}
                  </motion.div>
                </AnimatePresence>
                <div className="countdown-unit">{language === 'ta' ? 'மணி' : 'HOURS'}</div>
              </motion.div>

              {/* Separator 2 */}
              <motion.div
                className="countdown-separator"
                animate={{ opacity: [0.35, 1, 0.35] }}
                transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut', delay: 0.2 }}
              >
                :
              </motion.div>

              {/* 3. MINUTES */}
              <motion.div
                className="countdown-box"
                variants={boxVariants}
                whileHover={{
                  scale: 1.08,
                  y: -4,
                  borderColor: '#ffc107',
                  boxShadow: '0 12px 28px rgba(255, 193, 7, 0.45)',
                }}
                whileTap={{ scale: 0.95 }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={minutesStr}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.2 }}
                    className="countdown-number"
                  >
                    {minutesStr}
                  </motion.div>
                </AnimatePresence>
                <div className="countdown-unit">{language === 'ta' ? 'நிமிடம்' : 'MINUTES'}</div>
              </motion.div>

              {/* Separator 3 */}
              <motion.div
                className="countdown-separator"
                animate={{ opacity: [0.35, 1, 0.35] }}
                transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut', delay: 0.4 }}
              >
                :
              </motion.div>

              {/* 4. SECONDS */}
              <motion.div
                className="countdown-box pulse"
                variants={boxVariants}
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ repeat: Infinity, duration: 1, ease: 'easeInOut' }}
                whileHover={{
                  scale: 1.08,
                  y: -4,
                  borderColor: '#ffc107',
                  boxShadow: '0 12px 28px rgba(255, 193, 7, 0.55)',
                }}
                whileTap={{ scale: 0.95 }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={secondsStr}
                    initial={{ opacity: 0.5, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.2 }}
                    transition={{ duration: 0.25 }}
                    className="countdown-number text-gold"
                  >
                    {secondsStr}
                  </motion.div>
                </AnimatePresence>
                <div className="countdown-unit">{language === 'ta' ? 'வினாடி' : 'SECONDS'}</div>
              </motion.div>
            </motion.div>

            {/* Quick CTA Action Link */}
            <div className="countdown-cta-row">
              <MotionLink
                to="/offers"
                className="btn-yellow-hero pulse-glow"
                whileHover={{
                  scale: 1.04,
                  y: -3,
                  boxShadow: '0 14px 35px rgba(255, 152, 0, 0.65)',
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <motion.div
                  animate={{
                    scale: [1, 1.25, 1, 1.3, 1],
                    rotate: [0, -8, 8, -5, 0],
                  }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                  style={{ display: 'inline-flex', alignItems: 'center' }}
                >
                  <Flame size={19} color="#0f172a" fill="#0f172a" />
                </motion.div>
                <span>{language === 'ta' ? 'தீபாவளி சலுகைகளை பெறுக' : 'GRAB DEEPAVALI OFFERS'}</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                  style={{ display: 'inline-flex', alignItems: 'center' }}
                >
                  <ArrowRight size={17} />
                </motion.div>
              </MotionLink>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
