import React from 'react';
import { CategoryGrid } from '../components/CategoryCard';

export const Categories = () => {
  return (
    <div style={{ padding: '3.5rem 0', background: 'var(--light-bg)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="sparkle-badge">CRACKER CATALOGUE</span>
          <h1 style={{ fontSize: '2.5rem', marginTop: '0.5rem' }}>Browse All Categories</h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0.5rem auto 0' }}>
            From sparkling golden sticks to magnificent high-altitude aerial shells, explore our full spectrum of safe green crackers.
          </p>
        </div>

        <CategoryGrid />
      </div>
    </div>
  );
};
