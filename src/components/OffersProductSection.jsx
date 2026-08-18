import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Flame, ArrowRight } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { SkeletonLoader } from './SkeletonLoader';
import { getProducts, getOffers } from '../services/productService';
import { useLanguage } from '../context/LanguageContext';

export const OffersProductSection = () => {
  const { language } = useLanguage();
  const [productList, setProductList] = useState([]);
  const [offersList, setOffersList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    Promise.all([getOffers(), getProducts()])
      .then(([offersData, productsData]) => {
        if (!isMounted) return;
        if (Array.isArray(offersData) && offersData.length > 0) {
          setOffersList(offersData);
        }
        if (Array.isArray(productsData)) {
          setProductList(productsData);
        }
      })
      .catch(err => {
        console.warn('Failed fetching offers/products API:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Use API offers if available, otherwise filter discounted products
  const offerProducts = offersList.length > 0
    ? offersList
    : productList.filter(p => (p.discount || 0) > 0).slice(0, 10);
  const displayProducts = offerProducts.length > 0 ? offerProducts : productList.slice(0, 10);

  return (
    <section className="home-offers-products-section">
      <div className="container">
        {/* Section Header */}
        <div className="home-offers-header">
          <div className="home-offers-left">
            <div className="offers-mini-badge">
              <Flame size={14} color="#d90429" />
              <span>{language === 'ta' ? 'சலுகைகள்' : 'OFFERS'}</span>
            </div>
            <h2 className="home-offers-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Flame size={24} color="#d90429" />
              <span>{language === 'ta' ? 'பிரத்யேக தீபாவளி ஆஃபர்கள் & தள்ளுபடிகள்' : 'Exclusive Festival Offers & Deals'}</span>
            </h2>
            <p className="home-offers-sub">
              {language === 'ta'
                ? 'கையிருப்பு முடிவதற்குள் அதிகபட்ச தள்ளுபடியைப் பெறுங்கள்'
                : 'Grab maximum discounts before stocks run out'}
            </p>
          </div>

          <Link to="/products" className="home-offers-link">
            <span>{language === 'ta' ? 'அனைத்து பொருட்கள்' : 'Products'}</span>
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* 5-Column Responsive Grid or Skeleton */}
        {loading ? (
          <SkeletonLoader type="grid" count={5} />
        ) : (
          <div className="home-offers-products-grid">
            {displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
