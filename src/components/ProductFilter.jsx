import React, { useState, useEffect } from 'react';
import { getCategories } from '../services/categoryService';
import { useLanguage } from '../context/LanguageContext';
import { X, Check } from 'lucide-react';

export const ProductFilter = ({
  selectedCategory,
  setSelectedCategory,
  maxPrice,
  setMaxPrice,
  selectedSort,
  setSelectedSort,
  minDiscount,
  setMinDiscount,
  inStockOnly,
  setInStockOnly,
  onReset,
  onClose,
  totalItemsCount = 12
}) => {
  const { language } = useLanguage();
  const [categoriesList, setCategoriesList] = useState([]);

  useEffect(() => {
    let isMounted = true;
    getCategories().then(data => {
      if (isMounted && Array.isArray(data)) {
        setCategoriesList(data);
      }
    }).catch(err => {
      console.warn("Failed fetching live categories:", err);
    });
    return () => { isMounted = false; };
  }, []);

  return (
    <div 
      className="filter-card" 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%', 
        maxHeight: '100%', 
        background: '#ffffff', 
        borderRadius: onClose ? '24px 24px 0 0' : '16px', 
        overflow: 'hidden' 
      }}
    >
      
      {/* 1. Header Bar (Shown when in Mobile Drawer Modal) */}
      {onClose && (
        <div 
          style={{ 
            padding: '1.1rem 1.35rem', 
            background: '#ffffff', 
            borderBottom: '1.5px solid #fecdd3', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            zIndex: 10, 
            flexShrink: 0 
          }}
        >
          <h3 style={{ fontSize: '1.25rem', color: '#800f2f', fontWeight: 900, margin: 0 }}>
            {language === 'ta' ? 'வடிகட்டி & வரிசைப்படுத்து' : 'Filter & Sort Products'}
          </h3>
          <button
            onClick={onClose}
            aria-label="Close filters"
            style={{ 
              background: '#fff1f2', 
              border: 'none', 
              width: '36px', 
              height: '36px', 
              borderRadius: '50%', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}
          >
            <X size={18} color="var(--crimson-red)" />
          </button>
        </div>
      )}

      {/* 2. Scrollable Body Content */}
      <div 
        style={{ 
          flex: '1 1 auto', 
          overflowY: 'auto', 
          padding: onClose ? '1.25rem 1.35rem 3.5rem' : '1.25rem 1.35rem', 
          WebkitOverflowScrolling: 'touch' 
        }}
      >
        
        {/* Reset Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <span style={{ fontSize: '1rem', color: 'var(--text-dark, #0f172a)', fontWeight: 900 }}>
            {language === 'ta' ? 'வடிகட்டும் தேர்வுகள்' : 'Filter Options'}
          </span>
          <button
            onClick={onReset}
            style={{ fontSize: '0.875rem', color: 'var(--crimson-red, #FF5722)', fontWeight: 800, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            {language === 'ta' ? 'வடிகட்டிகளை நீக்கு' : 'Reset All'}
          </button>
        </div>

        {/* Sort By Dropdown */}
        <div className="filter-group" style={{ marginBottom: '1.35rem' }}>
          <h4 style={{ color: '#475569', fontSize: '0.825rem', fontWeight: 800, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {language === 'ta' ? 'வரிசைப்படுத்து' : 'SORT BY'}
          </h4>
          <select
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              border: '1.5px solid #cbd5e1',
              background: '#ffffff',
              color: 'var(--text-dark, #0f172a)',
              fontSize: '0.925rem',
              fontWeight: 700,
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="popular">{language === 'ta' ? 'பிரபலம்' : 'Popular Products'}</option>
            <option value="price-low">{language === 'ta' ? 'விலை: குறைந்ததிலிருந்து உயர்வு' : 'Price: Low → High'}</option>
            <option value="price-high">{language === 'ta' ? 'விலை: உயர்ந்ததிலிருந்து குறைவு' : 'Price: High → Low'}</option>
            <option value="discount">{language === 'ta' ? 'அதிகபட்ச தள்ளுபடி' : 'Highest Discount'}</option>
            <option value="newest">{language === 'ta' ? 'புதிய தயாரிப்புகள்' : 'Newest Products'}</option>
          </select>
        </div>

        {/* Categories Radio List */}
        <div className="filter-group" style={{ marginBottom: '1.35rem' }}>
          <h4 style={{ color: '#475569', fontSize: '0.825rem', fontWeight: 800, marginBottom: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {language === 'ta' ? 'பிரிவுகள்' : 'CATEGORIES'}
          </h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <label className={`filter-option ${selectedCategory === 'all' ? 'active-filter' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', fontSize: '0.925rem', padding: '0.2rem 0' }}>
              <input
                type="radio"
                name="category"
                checked={selectedCategory === 'all'}
                onChange={() => setSelectedCategory('all')}
                style={{ accentColor: 'var(--crimson-red, #FF5722)', width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <span style={{ color: selectedCategory === 'all' ? 'var(--crimson-red, #FF5722)' : 'var(--text-dark, #1e293b)', fontWeight: selectedCategory === 'all' ? 800 : 600 }}>
                {language === 'ta' ? 'அனைத்து பிரிவுகளும்' : 'All Categories'}
              </span>
            </label>

            {categoriesList.map(cat => (
              <label key={cat.id} className={`filter-option ${String(selectedCategory) === String(cat.id) ? 'active-filter' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', fontSize: '0.925rem', padding: '0.2rem 0' }}>
                <input
                  type="radio"
                  name="category"
                  checked={String(selectedCategory) === String(cat.id)}
                  onChange={() => setSelectedCategory(String(cat.id))}
                  style={{ accentColor: 'var(--crimson-red, #FF5722)', width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span style={{ color: String(selectedCategory) === String(cat.id) ? 'var(--crimson-red, #FF5722)' : 'var(--text-dark, #1e293b)', fontWeight: String(selectedCategory) === String(cat.id) ? 800 : 600 }}>
                  {cat.icon} {language === 'ta' ? (cat.nameTa || cat.name) : cat.name}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Max Price Range Slider */}
        <div className="filter-group" style={{ marginBottom: '1.35rem' }}>
          <h4 style={{ color: '#475569', fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {language === 'ta' ? `அதிகபட்ச விலை வரம்பு: ₹${maxPrice}` : `MAX PRICE RANGE: ₹${maxPrice}`}
          </h4>
          <input
            type="range"
            min="100"
            max="5000"
            step="100"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--crimson-red, #FF5722)', cursor: 'pointer' }}
          />
        </div>

        {/* Minimum Discount Filter */}
        <div className="filter-group" style={{ marginBottom: '1.35rem' }}>
          <h4 style={{ color: '#475569', fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {language === 'ta' ? 'குறைந்தபட்ச தள்ளுபடி' : 'MINIMUM DISCOUNT'}
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem' }}>
            {[0, 10, 20, 30].map(disc => (
              <button
                key={disc}
                onClick={() => setMinDiscount(disc)}
                style={{
                  padding: '0.45rem 0.25rem',
                  borderRadius: '10px',
                  border: minDiscount === disc ? '2px solid var(--crimson-red, #FF5722)' : '1.5px solid #cbd5e1',
                  background: minDiscount === disc ? 'rgba(255, 87, 34, 0.1)' : '#ffffff',
                  color: minDiscount === disc ? 'var(--crimson-red, #FF5722)' : 'var(--text-dark, #334155)',
                  fontWeight: minDiscount === disc ? 800 : 600,
                  fontSize: '0.825rem',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                {disc === 0 ? 'All' : `${disc}%+`}
              </button>
            ))}
          </div>
        </div>

        {/* Stock Filter */}
        <div className="filter-group" style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', fontSize: '0.925rem' }}>
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              style={{ accentColor: 'var(--crimson-red, #FF5722)', width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <span style={{ color: 'var(--text-dark, #1e293b)', fontWeight: inStockOnly ? 800 : 600 }}>
              {language === 'ta' ? 'கையிருப்பில் உள்ளது மட்டும்' : 'In Stock Only'}
            </span>
          </label>
        </div>

      </div>
    </div>
  );
};
