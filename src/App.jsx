import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { OrderProvider } from './context/OrderContext';
import { WebControlProvider } from './context/WebControlContext';

import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { FloatingWidgets } from './components/FloatingWidgets';
import { PageLoader } from './components/PageLoader';

// Dynamic page imports with React.lazy for Code Splitting
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Categories = lazy(() => import('./pages/Categories').then(m => ({ default: m.Categories })));
const Products = lazy(() => import('./pages/Products').then(m => ({ default: m.Products })));
const ProductDetails = lazy(() => import('./pages/ProductDetails').then(m => ({ default: m.ProductDetails })));
const Wishlist = lazy(() => import('./pages/Wishlist').then(m => ({ default: m.Wishlist })));
const Cart = lazy(() => import('./pages/Cart').then(m => ({ default: m.Cart })));
const Checkout = lazy(() => import('./pages/Checkout').then(m => ({ default: m.Checkout })));
const OrderSummary = lazy(() => import('./pages/OrderSummary').then(m => ({ default: m.OrderSummary })));
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess').then(m => ({ default: m.PaymentSuccess })));
const PaymentFailed = lazy(() => import('./pages/PaymentFailed').then(m => ({ default: m.PaymentFailed })));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation').then(m => ({ default: m.OrderConfirmation })));
const OrderTracking = lazy(() => import('./pages/OrderTracking').then(m => ({ default: m.OrderTracking })));
const Offers = lazy(() => import('./pages/Offers').then(m => ({ default: m.Offers })));
const Safety = lazy(() => import('./pages/Safety').then(m => ({ default: m.Safety })));
const Contact = lazy(() => import('./pages/Contact').then(m => ({ default: m.Contact })));
const Reels = lazy(() => import('./pages/Reels').then(m => ({ default: m.Reels })));

// Scroll to Top on route navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export default function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <WebControlProvider>
          <CartProvider>
            <WishlistProvider>
              <OrderProvider>
                <BrowserRouter 
                  basename={import.meta.env.BASE_URL}
                  future={{
                    v7_startTransition: true,
                    v7_relativeSplatPath: true,
                  }}
                >
                  <ScrollToTop />
                  <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                    <Navbar />
                    <main style={{ flexGrow: 1 }}>
                      <Suspense fallback={<PageLoader />}>
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/categories" element={<Categories />} />
                          <Route path="/products" element={<Products />} />
                          <Route path="/product/:id" element={<ProductDetails />} />
                          <Route path="/wishlist" element={<Wishlist />} />
                          <Route path="/cart" element={<Cart />} />
                          <Route path="/checkout" element={<Checkout />} />
                          <Route path="/order-summary" element={<OrderSummary />} />
                          <Route path="/payment-success" element={<PaymentSuccess />} />
                          <Route path="/payment-failed" element={<PaymentFailed />} />
                          <Route path="/order-confirmation" element={<OrderConfirmation />} />
                          <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
                          <Route path="/order-tracking" element={<OrderTracking />} />
                          <Route path="/offers" element={<Offers />} />
                          <Route path="/safety" element={<Safety />} />
                          <Route path="/contact" element={<Contact />} />
                          <Route path="/enquiry" element={<Contact />} />
                          <Route path="/reels" element={<Reels />} />
                          <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                      </Suspense>
                    </main>
                    <Toast />
                    <FloatingWidgets />
                    <MobileBottomNav />
                    <Footer />
                  </div>
                </BrowserRouter>
              </OrderProvider>
            </WishlistProvider>
          </CartProvider>
        </WebControlProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
