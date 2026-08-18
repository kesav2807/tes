import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '../services/categoryService';
import { Loader2, ArrowRight, Sparkles, Flame, Zap, Rocket, Bell, Moon, Star, Flame as FireIcon } from 'lucide-react';

import { SkeletonLoader } from './SkeletonLoader';
import { useLanguage } from '../context/LanguageContext';
import { LazyImage } from './LazyImage';

const CategoryIconRenderer = ({ iconName, size = 18, color = 'currentColor' }) => {
  if (iconName === 'Zap') return <Zap size={size} color={color} />;
  if (iconName === 'Flame') return <Flame size={size} color={color} />;
  if (iconName === 'Rocket') return <Rocket size={size} color={color} />;
  if (iconName === 'Bell') return <Bell size={size} color={color} />;
  if (iconName === 'Moon') return <Moon size={size} color={color} />;
  if (iconName === 'Star') return <Star size={size} color={color} />;
  return <Sparkles size={size} color={color} />;
};

export const CategoryCard = ({ category }) => {
  const { getText } = useLanguage();
  const [imgError, setImgError] = useState(false);

  return (
    <Link to={`/products?category=${category.id}`} className="category-card" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', height: '100%' }}>
      {category.image && !imgError ? (
        <div style={{ width: '100%', height: '160px', borderRadius: '16px', overflow: 'hidden', marginBottom: '0.85rem', background: '#f1f5f9', position: 'relative' }}>
          <LazyImage 
            src={category.image} 
            alt={category.name} 
            onError={() => setImgError(true)} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
          <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', color: '#ffffff', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <CategoryIconRenderer iconName={category.icon} size={14} color="#fef08a" /> Live API
          </div>
        </div>
      ) : (
        <div className="category-icon" style={{ width: '100%', height: '160px', borderRadius: '16px', marginBottom: '0.85rem', background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CategoryIconRenderer iconName={category.icon} size={42} color="var(--crimson-red)" />
        </div>
      )}
      
      <div style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ margin: '0.25rem 0 0.35rem 0', fontSize: '1.15rem', color: '#0f172a', fontWeight: 900, letterSpacing: '-0.01em' }}>
            {getText(category, 'name')}
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
            {getText(category, 'description')}
          </p>
        </div>

        <div style={{ marginTop: '1rem', fontSize: '0.825rem', fontWeight: 800, color: '#d90429', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span>Explore Collection</span>
          <ArrowRight size={14} />
        </div>
      </div>
    </Link>
  );
};

export const CategoryGrid = () => {
  const [categoriesList, setCategoriesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getCategories().then(data => {
      if (isMounted) {
        setCategoriesList(data || []);
        setIsLoading(false);
      }
    }).catch(() => {
      if (isMounted) {
        setCategoriesList([]);
        setIsLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, []);

  if (isLoading) {
    return <SkeletonLoader type="grid" count={6} />;
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
      {categoriesList.map(cat => (
        <CategoryCard key={cat.id} category={cat} />
      ))}
    </div>
  );
};
