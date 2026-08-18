import React from 'react';

export const SkeletonProductCard = () => {
  return (
    <div
      className="skeleton-product-card"
      style={{
        background: '#ffffff',
        borderRadius: '18px',
        border: '1.5px solid #e2e8f0',
        padding: '0.9rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
        overflow: 'hidden'
      }}
    >
      {/* Image Skeleton */}
      <div
        className="skeleton-shimmer"
        style={{
          width: '100%',
          aspectRatio: '1 / 1',
          borderRadius: '14px'
        }}
      />

      {/* Code & Category Tag */}
      <div
        className="skeleton-shimmer"
        style={{
          height: '14px',
          width: '40%',
          borderRadius: '6px'
        }}
      />

      {/* Title Placeholder */}
      <div
        className="skeleton-shimmer"
        style={{
          height: '18px',
          width: '85%',
          borderRadius: '6px'
        }}
      />

      {/* Price & Discount Placeholder */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.2rem' }}>
        <div
          className="skeleton-shimmer"
          style={{
            height: '22px',
            width: '45%',
            borderRadius: '6px'
          }}
        />
        <div
          className="skeleton-shimmer"
          style={{
            height: '16px',
            width: '25%',
            borderRadius: '6px'
          }}
        />
      </div>

      {/* Add Button Skeleton */}
      <div
        className="skeleton-shimmer"
        style={{
          height: '42px',
          width: '100%',
          borderRadius: '12px',
          marginTop: '0.25rem'
        }}
      />
    </div>
  );
};

export const SkeletonGrid = ({ count = 8 }) => {
  return (
    <div
      className="skeleton-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: '1rem',
        width: '100%'
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonProductCard key={i} />
      ))}
    </div>
  );
};

export const SkeletonCategories = () => {
  return (
    <div style={{ display: 'flex', gap: '0.65rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="skeleton-shimmer"
          style={{
            height: '38px',
            width: i === 0 ? '110px' : '90px',
            borderRadius: '9999px',
            flexShrink: 0
          }}
        />
      ))}
    </div>
  );
};

export const SkeletonBanner = () => {
  return (
    <div
      className="skeleton-shimmer"
      style={{
        width: '100%',
        height: '180px',
        borderRadius: '20px',
        marginBottom: '1.5rem'
      }}
    />
  );
};

export const SkeletonDetails = () => {
  return (
    <div style={{ padding: '1.5rem 0', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '920px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {/* Main Image */}
          <div className="skeleton-shimmer" style={{ width: '100%', aspectRatio: '1/1', borderRadius: '24px' }} />

          {/* Details Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="skeleton-shimmer" style={{ height: '16px', width: '30%', borderRadius: '6px' }} />
            <div className="skeleton-shimmer" style={{ height: '32px', width: '80%', borderRadius: '8px' }} />
            <div className="skeleton-shimmer" style={{ height: '24px', width: '40%', borderRadius: '8px' }} />
            <div className="skeleton-shimmer" style={{ height: '80px', width: '100%', borderRadius: '16px' }} />
            <div className="skeleton-shimmer" style={{ height: '52px', width: '100%', borderRadius: '16px' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export const SkeletonTable = ({ rows = 5 }) => {
  return (
    <div style={{ background: '#ffffff', borderRadius: '20px', border: '1.5px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
      <div className="skeleton-shimmer" style={{ height: '24px', width: '30%', borderRadius: '8px', marginBottom: '1.5rem' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', paddingBottom: i < rows - 1 ? '1rem' : '0', borderBottom: i < rows - 1 ? '1px solid #f1f5f9' : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
              <div className="skeleton-shimmer" style={{ width: '54px', height: '54px', borderRadius: '12px', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div className="skeleton-shimmer" style={{ height: '18px', width: '60%', borderRadius: '6px', marginBottom: '6px' }} />
                <div className="skeleton-shimmer" style={{ height: '14px', width: '35%', borderRadius: '4px' }} />
              </div>
            </div>
            <div className="skeleton-shimmer" style={{ height: '24px', width: '80px', borderRadius: '8px' }} />
          </div>
        ))}
      </div>
    </div>
  );
};

export const SkeletonLoader = ({ type = 'grid', count = 8 }) => {
  if (type === 'categories') return <SkeletonCategories />;
  if (type === 'banner') return <SkeletonBanner />;
  if (type === 'details') return <SkeletonDetails />;
  if (type === 'table') return <SkeletonTable rows={count} />;
  return <SkeletonGrid count={count} />;
};

export default SkeletonLoader;
