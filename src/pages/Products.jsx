import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { ProductFilter } from '../components/ProductFilter';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { getProducts, getProductsByCategory } from '../services/productService';
import { useLanguage } from '../context/LanguageContext';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { Search, SlidersHorizontal, ChevronDown, ChevronUp, Sparkles, X, Filter, Loader2 } from 'lucide-react';

const ITEMS_PER_PAGE = 12;

export const Products = () => {
  const { language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [selectedSort, setSelectedSort] = useState('popular');
  const [minDiscount, setMinDiscount] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // Pagination State
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // API State
  const [productList, setProductList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  // Fetch products from API on mount and when category changes
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setApiError(null);

    const fetchProductData = async () => {
      try {
        let fetchedData = [];
        if (selectedCategory === 'all') {
          fetchedData = await getProducts();
        } else {
          fetchedData = await getProductsByCategory(selectedCategory);
        }

        if (isMounted) {
          setProductList(fetchedData);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        if (isMounted) {
          setApiError(err.message || 'Failed to load products from API');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProductData();

    return () => {
      isMounted = false;
    };
  }, [selectedCategory]);

  // Reset pagination whenever filters or search query change
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [selectedCategory, searchQuery, maxPrice, selectedSort, minDiscount, inStockOnly]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setMaxPrice(5000);
    setSelectedSort('popular');
    setMinDiscount(0);
    setInStockOnly(false);
    setSearchParams({});
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    if (catId === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catId);
    }
    setSearchParams(searchParams);
  };

  const activeFiltersCount = (selectedCategory !== 'all' ? 1 : 0) +
    (maxPrice < 5000 ? 1 : 0) +
    (minDiscount > 0 ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (selectedSort !== 'popular' ? 1 : 0) +
    (searchQuery.trim() !== '' ? 1 : 0);

  const filteredProducts = useMemo(() => {
    return productList
      .filter(p => {
        if (selectedCategory !== 'all') {
          const matchCatId = String(p.category) === String(selectedCategory) || String(p.categoryId) === String(selectedCategory);
          const matchCatSlug = p.category === selectedCategory;
          if (!matchCatId && !matchCatSlug) return false;
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchesName = (p.name || '').toLowerCase().includes(q);
          const matchesCat = (p.categoryName || '').toLowerCase().includes(q);
          const matchesType = (p.type || '').toLowerCase().includes(q);
          const matchesCode = (p.code || '').toLowerCase().includes(q) || 
                              (p.productCode || '').toLowerCase().includes(q) || 
                              String(p.id || '').toLowerCase().includes(q) || 
                              String(p.rawId || '').toLowerCase().includes(q);
          if (!matchesName && !matchesCat && !matchesType && !matchesCode) return false;
        }

        if (p.price > maxPrice) return false;
        if (p.discount < minDiscount) return false;
        if (inStockOnly && !p.inStock) return false;
        return true;
      })
      .sort((a, b) => {
        if (selectedSort === 'price-low') return a.price - b.price;
        if (selectedSort === 'price-high') return b.price - a.price;
        if (selectedSort === 'discount') return b.discount - a.discount;
        if (selectedSort === 'newest') return String(b.id).localeCompare(String(a.id));
        return (b.rating || 4.5) - (a.rating || 4.5);
      });
  }, [productList, selectedCategory, searchQuery, maxPrice, selectedSort, minDiscount, inStockOnly]);

  // Paginated/batch slice for infinite scroll
  const visibleProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  const handleLoadMore = useCallback(() => {
    setVisibleCount(prev => Math.min(prev + ITEMS_PER_PAGE, filteredProducts.length));
  }, [filteredProducts.length]);

  const hasMore = visibleCount < filteredProducts.length;

  const sentinelRef = useInfiniteScroll(
    handleLoadMore,
    hasMore,
    isLoading
  );

  return (
    <div className="products-page-light" style={{ padding: '1.5rem 0 1.5rem', background: '#f8fafc', minHeight: '100vh', color: '#1e293b' }}>
      <div className="container">
        
        {/* Mobile Floating Sticky Filter Toggle Button */}
        <div 
          className="mobile-filter-bar"
          style={{ 
            position: 'sticky', 
            top: '68px', 
            zIndex: 900, 
            background: '#f8fafc', 
            paddingTop: '0.5rem', 
            paddingBottom: '0.5rem', 
            marginBottom: '1rem' 
          }}
        >
          <button
            onClick={() => setShowMobileFilter(!showMobileFilter)}
            className="mobile-filter-toggle-btn"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
              <SlidersHorizontal size={18} color="var(--crimson-red)" />
              <span style={{ color: 'var(--crimson-red)', fontWeight: 800, fontSize: '0.92rem' }}>
                {language === 'ta' ? 'வடிகட்டி & வரிசைப்படுத்து' : 'Filter & Sort Products'} {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </span>
            </div>
            {showMobileFilter ? <ChevronUp size={18} color="var(--crimson-red)" /> : <ChevronDown size={18} color="var(--crimson-red)" />}
          </button>
        </div>

        {/* Light Festive Header Banner */}
        <div className="products-hero-banner">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
            <div>
              <div className="sparkle-badge" style={{ marginBottom: '0.65rem' }}>
                <Sparkles size={14} />
                <span>{language === 'ta' ? '100% நேரடி சிவகாசி பட்டாசுகள்' : '100% Direct Sivakasi Crackers'}</span>
              </div>
              <h1 className="products-hero-title">
                {language === 'ta' ? 'பட்டாசு கார்ட் அட்டவணை' : 'Fireworks & Crackers Catalogue'}
              </h1>
              <p className="products-hero-subtitle">
                {language === 'ta'
                  ? 'சிறந்த தரமான பண்டிகை பட்டாசுகளை நேரடி மொத்த விலையில் வாங்குங்கள்.'
                  : 'Explore our premium range of vibrant crackers & sky display shots with wholesale direct discounts.'}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
              <div style={{ background: '#ffffff', padding: '0.75rem 1.15rem', borderRadius: 'var(--radius-md)', border: '1.5px solid #fef08a', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--crimson-red)' }}>{productList.length}</div>
                <div style={{ fontSize: '0.725rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase' }}>
                  {language === 'ta' ? 'மொத்த பொருட்கள்' : 'Total Items'}
                </div>
              </div>
              <div style={{ background: '#ffffff', padding: '0.75rem 1.15rem', borderRadius: 'var(--radius-md)', border: '1.5px solid #fef08a', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#059669' }}>UP TO 50%</div>
                <div style={{ fontSize: '0.725rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase' }}>
                  {language === 'ta' ? 'தள்ளுபடி' : 'Festive Discount'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar Container */}
        <div className="products-search-box">
          <Search size={22} color="#64748b" />
          <input
            type="text"
            className="products-search-input"
            placeholder={language === 'ta' ? 'பட்டாசு பெயர் அல்லது வகையை தேடுங்கள்...' : 'Search crackers by name, category, code...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ background: '#fee2e2', border: 'none', color: 'var(--crimson-red)', fontWeight: 800, padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', cursor: 'pointer' }}
            >
              <X size={14} /> Clear
            </button>
          )}
        </div>

        <div className="products-page-grid">
          {/* Mobile Overlay Backdrop */}
          {showMobileFilter && (
            <div
              className="filter-mobile-backdrop"
              onClick={() => setShowMobileFilter(false)}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(15, 23, 42, 0.55)',
                backdropFilter: 'blur(4px)',
                zIndex: 9950
              }}
            />
          )}

          {/* Sidebar Filter */}
          <aside className={`filter-sidebar-wrapper ${showMobileFilter ? 'open' : ''}`}>
            <ProductFilter
              selectedCategory={selectedCategory}
              setSelectedCategory={handleCategorySelect}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              selectedSort={selectedSort}
              setSelectedSort={setSelectedSort}
              minDiscount={minDiscount}
              setMinDiscount={setMinDiscount}
              inStockOnly={inStockOnly}
              setInStockOnly={setInStockOnly}
              onReset={resetFilters}
              onClose={() => setShowMobileFilter(false)}
              totalItemsCount={filteredProducts.length}
            />
          </aside>

          {/* Product Grid Main Content */}
          <main>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem', background: '#ffffff', padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1.5px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                {language === 'ta' ? 'காண்பிக்கப்படுகிறது: ' : 'Showing '}
                <span style={{ color: 'var(--crimson-red)', fontSize: '1.1rem' }}>{visibleProducts.length}</span>
                <span style={{ color: '#64748b', fontSize: '0.9rem' }}> of {filteredProducts.length}</span>
                {language === 'ta' ? ' பொருட்கள்' : ' Crackers'}
                {selectedCategory !== 'all' && (
                  <span style={{ fontSize: '0.85rem', color: '#64748b', marginLeft: '0.5rem' }}>
                    (Category #{selectedCategory})
                  </span>
                )}
              </div>
              
              {activeFiltersCount > 0 && (
                <button
                  onClick={resetFilters}
                  style={{ fontSize: '0.85rem', color: 'var(--crimson-red)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.35rem', background: '#fff1f2', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid #fecdd3', cursor: 'pointer' }}
                >
                  <X size={14} /> {language === 'ta' ? 'வடிகட்டிகளை நீக்கு' : 'Clear All Filters'}
                </button>
              )}
            </div>

            {/* Loading Skeleton */}
            {isLoading ? (
              <SkeletonLoader type="grid" count={8} />
            ) : filteredProducts.length === 0 ? (
              <div className="products-empty-state">
                <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
                  <Search size={54} color="#94a3b8" />
                </div>
                <h3>{language === 'ta' ? 'எந்த பொருளும் கிடைக்கவில்லை' : 'No Products Found'}</h3>
                <p style={{ color: '#64748b', marginBottom: '1.5rem', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
                  {language === 'ta'
                    ? 'உங்கள் தேடல் அல்லது வகைப்பாட்டை மாற்றி மீண்டும் முயற்சிக்கவும்.'
                    : 'We could not find any crackers matching your selected filters or search query.'}
                </p>
                <button className="btn-primary" onClick={resetFilters} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Filter size={16} /> {language === 'ta' ? 'அனைத்து வடிகட்டிகளையும் மீட்டமை' : 'Reset All Filters'}
                </button>
              </div>
            ) : (
              <>
                <div className="responsive-products-grid">
                  {visibleProducts.map(prod => (
                    <ProductCard key={prod.id} product={prod} />
                  ))}
                </div>

                {/* Infinite Scroll Sentinel / Load More Container */}
                {hasMore && (
                  <div
                    ref={sentinelRef}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justify: 'center',
                      padding: '2rem 1rem',
                      marginTop: '1.5rem',
                      gap: '0.75rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#e11d48', fontWeight: 700 }}>
                      <Loader2 size={20} className="animate-spin" />
                      <span>Loading more crackers...</span>
                    </div>
                    <button
                      onClick={handleLoadMore}
                      style={{
                        background: '#ffffff',
                        border: '1.5px solid #e2e8f0',
                        padding: '0.5rem 1.25rem',
                        borderRadius: '12px',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: '#475569',
                        cursor: 'pointer'
                      }}
                    >
                      Load Next {Math.min(ITEMS_PER_PAGE, filteredProducts.length - visibleCount)} Items
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
