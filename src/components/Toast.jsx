import React from 'react';
import { useCart } from '../context/CartContext';
import { Sparkles, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

export const Toast = () => {
  const { toastMessage } = useCart();

  if (!toastMessage) return null;

  const isSuccess = toastMessage.type === 'success';
  const isWarning = toastMessage.type === 'warning';

  return (
    <div className="toast-container">
      <div 
        className={`toast ${toastMessage.type || 'info'}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.65rem',
          background: '#0f172a',
          color: '#ffffff',
          padding: '0.75rem 1.25rem',
          borderRadius: '9999px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
          borderLeft: isSuccess ? '4px solid #10b981' : isWarning ? '4px solid #f59e0b' : '4px solid #3b82f6'
        }}
      >
        {isSuccess ? (
          <CheckCircle2 size={19} color="#10b981" />
        ) : isWarning ? (
          <AlertTriangle size={19} color="#f59e0b" />
        ) : (
          <Sparkles size={19} color="#3b82f6" />
        )}
        <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#ffffff' }}>
          {toastMessage.message}
        </span>
      </div>
    </div>
  );
};
