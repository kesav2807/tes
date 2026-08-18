import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const FlyingCartParticles = () => {
  const { flyingParticles, removeFlyingParticle } = useCart();

  const targetX = typeof window !== 'undefined' ? window.innerWidth / 2 : 300;
  const targetY = typeof window !== 'undefined' ? window.innerHeight - 70 : 600;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 99999,
        overflow: 'hidden',
      }}
    >
      <AnimatePresence>
        {flyingParticles.map((particle) => {
          const midX = (particle.startX + targetX) / 2 + (particle.startX < targetX ? -50 : 50);
          const midY = Math.min(particle.startY, targetY) - 90;

          return (
            <motion.div
              key={particle.id}
              initial={{
                x: particle.startX,
                y: particle.startY,
                scale: 1,
                opacity: 1,
                rotate: 0,
              }}
              animate={{
                x: [particle.startX, midX, targetX],
                y: [particle.startY, midY, targetY],
                scale: [1, 1.35, 0.45],
                opacity: [1, 0.95, 0],
                rotate: [0, -180, -360],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.75,
                ease: [0.16, 1, 0.3, 1],
              }}
              onAnimationComplete={() => removeFlyingParticle(particle.id)}
              style={{
                position: 'fixed',
                left: 0,
                top: 0,
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #d90429 0%, #ff2e4d 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 20px rgba(217, 4, 41, 0.6), 0 0 15px rgba(255, 46, 77, 0.4)',
                border: '2px solid #ffffff',
              }}
            >
              <ShoppingCart size={18} color="#ffffff" strokeWidth={2.5} />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
