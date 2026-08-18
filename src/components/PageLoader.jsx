import React from 'react';

export const PageLoader = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        width: '100%',
        gap: '1rem',
        padding: '2rem'
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          border: '4px solid #f3f4f6',
          borderTop: '4px solid var(--theme-primary, #e11d48)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }}
      />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>
        Loading SDS Crackers...
      </span>
    </div>
  );
};

export default PageLoader;
