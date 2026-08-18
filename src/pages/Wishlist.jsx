import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/ProductCard';
import { Heart, ShoppingBag } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Wishlist = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { t } = useLanguage();

  const handleMoveAllToCart = () => {
    wishlistItems.forEach(item => {
      addToCart(item, 1);
      removeFromWishlist(item.id);
    });
  };

  return (
    <div className="wishlist-page-light" style={{ padding: '2.5rem 0 5rem', background: '#f8fafc', color: '#1e293b', minHeight: '100vh' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div>
            <span className="sparkle-badge"><Heart size={14} /> YOUR SAVED ITEMS</span>
            <h1 style={{ fontSize: '2.2rem', marginTop: '0.4rem', color: '#0f172a', fontWeight: 900 }}>{t('wishlist', 'My Wishlist')} ({wishlistItems.length})</h1>
          </div>

          {wishlistItems.length > 0 && (
            <button className="btn-primary" onClick={handleMoveAllToCart}>
              <ShoppingBag size={18} /> {t('addToCart', 'Move All Items to Cart')}
            </button>
          )}
        </div>

        {wishlistItems.length === 0 ? (
          <div style={{ background: 'var(--light-card)', padding: '4rem 2rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', border: '1px solid var(--light-border)', color: 'var(--text-dark)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <Heart size={54} color="#94a3b8" />
            </div>
            <h3 style={{ color: 'var(--text-dark)' }}>{t('wishlist', 'Your Wishlist is Empty')}</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Explore our cracker catalogue and save your favorite items for festival celebration.</p>
            <Link to="/products" className="btn-primary">{t('products', 'Explore Products Catalogue')}</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.75rem' }}>
            {wishlistItems.map(item => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
