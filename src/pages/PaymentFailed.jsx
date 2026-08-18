import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import { AlertTriangle, RefreshCw, ShoppingCart, ArrowLeft } from 'lucide-react';

export const PaymentFailed = () => {
  const navigate = useNavigate();
  const { paymentFailedDetails } = useOrder();

  return (
    <div style={{ padding: '4rem 0', background: 'var(--light-bg)', textAlign: 'center' }}>
      <div className="container" style={{ maxWidth: '600px' }}>
        <div style={{ background: 'white', padding: '3rem 2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--light-border)', boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ width: '80px', height: '80px', background: '#ffe6e8', borderRadius: '50%', color: 'var(--crimson-red)', display: 'flex', alignItems: 'center', justify: 'center', margin: '0 auto 1.5rem' }}>
            <AlertTriangle size={48} />
          </div>

          <span className="sparkle-badge" style={{ background: '#ffe6e8', color: 'var(--crimson-red)', border: '1px solid #fecdd3' }}>
            TRANSACTION COULD NOT BE COMPLETED
          </span>

          <h1 style={{ fontSize: '2.2rem', margin: '1rem 0 0.5rem', color: 'var(--text-dark)' }}>Payment Failed</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            We could not process your payment. Your items in cart have been retained so you can retry safely.
          </p>

          {paymentFailedDetails && (
            <div style={{ background: '#fff1f2', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #fecdd3', color: '#9f1239', fontSize: '0.85rem', marginBottom: '2rem' }}>
              <strong>Reason: </strong>{paymentFailedDetails.reason}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <button className="btn-primary" onClick={() => navigate('/order-summary')} style={{ justifyContent: 'center' }}>
              <RefreshCw size={18} /> Retry Payment Now
            </button>
            <button className="btn-secondary" onClick={() => navigate('/cart')} style={{ background: '#f8fafc', color: 'var(--text-dark)', border: '1px solid var(--light-border)', justifyContent: 'center' }}>
              <ShoppingCart size={18} /> Return to Cart Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
