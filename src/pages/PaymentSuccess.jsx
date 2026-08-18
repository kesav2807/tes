import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import { CheckCircle, Package, ArrowRight, Truck } from 'lucide-react';

export const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { currentOrder } = useOrder();

  return (
    <div style={{ padding: '4rem 0', background: 'var(--light-bg)', textAlign: 'center' }}>
      <div className="container" style={{ maxWidth: '600px' }}>
        <div style={{ background: 'white', padding: '3rem 2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--light-border)', boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ width: '80px', height: '80px', background: '#dcfce7', borderRadius: '50%', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <CheckCircle size={48} />
          </div>

          <span className="sparkle-badge" style={{ background: '#dcfce7', color: '#14532d', border: '1px solid #86efac' }}>
            PAYMENT VERIFIED & SUCCESSFUL
          </span>

          <h1 style={{ fontSize: '2.2rem', margin: '1rem 0 0.5rem', color: 'var(--text-dark)' }}>Payment Completed!</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Thank you for celebrating with SDS Crackers. Your order transaction has been successfully confirmed.
          </p>

          {currentOrder && (
            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--light-border)', marginBottom: '2rem', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Order ID:</span>
                <strong style={{ color: 'var(--crimson-red)' }}>#{currentOrder.orderId}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Amount Paid:</span>
                <strong>₹{currentOrder.totalAmount}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Payment Reference:</span>
                <span style={{ fontFamily: 'monospace' }}>{currentOrder.paymentId}</span>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              className="btn-primary"
              onClick={() => navigate(currentOrder ? `/order-confirmation/${currentOrder.orderId}` : '/order-tracking')}
            >
              <Package size={18} /> View Order Invoice & Confirmation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
