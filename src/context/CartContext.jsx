import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCoupons } from '../services/couponService';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('crackers_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [pillBumpTrigger, setPillBumpTrigger] = useState(0);
  const [flyingParticles, setFlyingParticles] = useState([]);

  useEffect(() => {
    try {
      localStorage.setItem('crackers_cart', JSON.stringify(cartItems));
    } catch (e) {}
  }, [cartItems]);

  // Fetch live API coupons on mount
  useEffect(() => {
    let isMounted = true;
    getCoupons()
      .then(coupons => {
        if (isMounted && Array.isArray(coupons)) {
          setAvailableCoupons(coupons);
        }
      })
      .catch(err => console.warn('Failed to load coupons in CartContext:', err));
    return () => { isMounted = false; };
  }, []);

  const showNotification = (message, type = 'info') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const triggerBump = () => {
    setPillBumpTrigger(Date.now());
  };

  const removeFlyingParticle = (particleId) => {
    setFlyingParticles(prev => prev.filter(p => p.id !== particleId));
  };

  const addToCart = (product, quantity = 1, event = null) => {
    if (event && event.clientX && event.clientY) {
      const particle = {
        id: `${Date.now()}-${Math.random()}`,
        startX: event.clientX,
        startY: event.clientY,
        image: product.image || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=600'
      };
      setFlyingParticles(prev => [...prev, particle]);
    }
    triggerBump();

    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    showNotification(`Added "${product.name}" to cart!`, 'success');
  };

  const updateQuantity = (productId, delta, event = null) => {
    if (delta > 0 && event && event.clientX && event.clientY) {
      const particle = {
        id: `${Date.now()}-${Math.random()}`,
        startX: event.clientX,
        startY: event.clientY,
      };
      setFlyingParticles(prev => [...prev, particle]);
    }
    triggerBump();

    setCartItems(prev =>
      prev
        .map(item => {
          if (item.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (productId) => {
    triggerBump();
    setCartItems(prev => prev.filter(item => item.id !== productId));
    showNotification('Item removed from cart', 'info');
  };

  const clearCart = () => {
    triggerBump();
    setCartItems([]);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const applyCoupon = (couponInput) => {
    if (!couponInput) return false;
    const cleanCode = String(couponInput).trim().toUpperCase();
    
    // 1. Match against API coupons
    const foundApiCoupon = availableCoupons.find(
      c => String(c.code).trim().toUpperCase() === cleanCode
    );

    if (foundApiCoupon) {
      const minOrder = Number(foundApiCoupon.minimumOrderAmount || 0);
      if (minOrder > 0 && subtotal < minOrder) {
        showNotification(`Coupon ${cleanCode} requires min. order of ₹${minOrder}. Add ₹${minOrder - subtotal} more items!`, 'warning');
        return false;
      }

      setAppliedCoupon({
        code: foundApiCoupon.code,
        discountType: foundApiCoupon.discountType,
        discountValue: Number(foundApiCoupon.discountValue || 0),
        minimumOrderAmount: minOrder,
        name: foundApiCoupon.title || foundApiCoupon.code
      });

      const label = foundApiCoupon.discountType === 'percentage' 
        ? `${foundApiCoupon.discountValue}% OFF` 
        : `₹${foundApiCoupon.discountValue} OFF`;
      showNotification(`Coupon ${cleanCode} (${label}) applied!`, 'success');
      return true;
    }

    // 2. Standard Fallbacks
    if (cleanCode === 'FESTIVAL50') {
      setAppliedCoupon({
        code: 'FESTIVAL50',
        discountType: 'percentage',
        discountValue: 50,
        minimumOrderAmount: 0,
        name: '50% Festival Discount'
      });
      showNotification('50% Festival Discount Applied!', 'success');
      return true;
    }

    if (cleanCode === 'FESTIVAL100' || cleanCode === 'SAVE100') {
      setAppliedCoupon({
        code: cleanCode,
        discountType: 'amount',
        discountValue: 100,
        minimumOrderAmount: 0,
        name: '₹100 Coupon Discount'
      });
      showNotification('₹100 Flat Coupon Applied!', 'success');
      return true;
    }

    showNotification(`Invalid Coupon Code "${cleanCode}"`, 'info');
    return false;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showNotification('Coupon removed', 'info');
  };

  // Dynamic discount computation
  let discountAmount = 0;
  if (appliedCoupon && subtotal > 0) {
    const minOrder = Number(appliedCoupon.minimumOrderAmount || 0);
    if (minOrder > 0 && subtotal < minOrder) {
      discountAmount = 0;
    } else if (appliedCoupon.discountType === 'percentage') {
      discountAmount = Math.round((subtotal * (appliedCoupon.discountValue || 0)) / 100);
    } else if (appliedCoupon.discountType === 'amount') {
      discountAmount = Math.min(subtotal, Number(appliedCoupon.discountValue || 0));
    } else if (typeof appliedCoupon.discountAmount === 'number') {
      discountAmount = Math.min(subtotal, appliedCoupon.discountAmount);
    }
  }

  const shippingCharges = subtotal > 1500 || subtotal === 0 ? 0 : 99;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingCharges);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        subtotal,
        totalItemsCount,
        availableCoupons,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        discountAmount,
        shippingCharges,
        finalTotal,
        toastMessage,
        showNotification,
        pillBumpTrigger,
        triggerBump,
        flyingParticles,
        removeFlyingParticle
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
