import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import { Printer, Truck, MapPin, Copy, Check, ArrowLeft, MessageSquare, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useWebControl } from '../context/WebControlContext';

export const OrderConfirmation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentOrder, fetchTrackingOrder } = useOrder();
  const { language, t } = useLanguage();
  const { shopName, logoUrl, shopAddress, phone, whatsapp, formattedPhone, email } = useWebControl();

  const [orderData, setOrderData] = useState(currentOrder);
  const [loading, setLoading] = useState(!currentOrder && Boolean(id));
  const [copied, setCopied] = useState(false);

  const handleCopyOrderId = (orderId) => {
    if (!orderId) return;
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchTrackingOrder(id).then(res => {
        if (res && res.success && res.order) {
          setOrderData(res.order);
        }
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: '5rem 0', textAlign: 'center', color: '#0f172a', fontWeight: 800 }}>
        <div style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>⌛</div>
        <div>{language === 'ta' ? 'ஆர்டர் விபரங்கள் ஏற்றப்படுகின்றன...' : 'Loading Order Confirmation...'}</div>
      </div>
    );
  }

  const activeOrder = orderData || currentOrder;
  const orderIdVal = id || activeOrder?.orderId || activeOrder?.orderNo || 'N/A';
  const customerNameVal = activeOrder?.customerName || activeOrder?.customer_name || activeOrder?.customerInfo?.fullName || '';
  const phoneVal = activeOrder?.phone || activeOrder?.customer_mobile || activeOrder?.customerInfo?.phone || '';
  const emailVal = activeOrder?.email || activeOrder?.customerInfo?.email || '';
  const addressStr = activeOrder?.address || activeOrder?.customerInfo?.address || '';
  const cityVal = activeOrder?.city || activeOrder?.customerInfo?.city || '';
  const districtVal = activeOrder?.district || activeOrder?.customerInfo?.district || '';
  const stateVal = activeOrder?.state || activeOrder?.customerInfo?.state || '';
  const pincodeVal = activeOrder?.pincode || activeOrder?.postalcode || activeOrder?.customerInfo?.pincode || '';
  const fullAddress = [addressStr, cityVal, districtVal, stateVal].filter(Boolean).join(', ');
  const items = activeOrder?.items || [];
  const statusVal = activeOrder?.orderStatus || activeOrder?.paymentStatus || 'Confirmed';
  const paymentMethodVal = activeOrder?.paymentMethod || 'Cash on Delivery / WhatsApp Direct';
  const subtotalVal = activeOrder?.subtotal || 0;
  const discountVal = activeOrder?.discount || 0;
  const chargesVal = activeOrder?.charges || 0;
  const totalAmountVal = activeOrder?.totalAmount || activeOrder?.payable_amount || activeOrder?.subtotal || 0;
  const orderDateVal = activeOrder?.createdAt || activeOrder?.orderDate || new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });

  const displayShopName = shopName || 'SDS CRACKERS SIVAKASI';
  const displayPhone = phone || formattedPhone || whatsapp || '7010922428';

  return (
    <div className="confirmation-page-light" style={{ padding: '2rem 0 5rem', background: '#f8fafc', color: '#1e293b', minHeight: '100vh' }}>
      {/* Print Specific CSS Rules */}
      <style>{`
        @media print {
          header, footer, nav,
          .site-header, .site-footer,
          .mobile-bottom-nav,
          .floating-social-vertical-bar,
          .floating-social-widget,
          .floating-cart-pill,
          .no-print,
          .confirmation-action-btns,
          .back-btn-link {
            display: none !important;
          }

          body, html {
            background: #ffffff !important;
            color: #0f172a !important;
            margin: 0 !important;
            padding: 0 !important;
            font-size: 11pt !important;
          }

          .confirmation-page-light {
            padding: 0 !important;
            background: #ffffff !important;
            min-height: auto !important;
          }

          .confirmation-card-light {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            background: #ffffff !important;
          }

          .printable-receipt-sheet {
            display: block !important;
            width: 100% !important;
            margin: 0 auto !important;
            padding: 5mm !important;
            box-sizing: border-box !important;
          }

          .screen-only-section {
            display: none !important;
          }
        }

        @media screen {
          .printable-receipt-sheet {
            display: block;
            border-top: 2px dashed #cbd5e1;
            margin-top: 2rem;
            padding-top: 1.5rem;
          }
        }
      `}</style>

      <div className="container" style={{ maxWidth: '860px' }}>
        
        {/* Back Link */}
        <Link
          to="/products"
          className="back-btn-link no-print"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#0f172a', fontWeight: 800, fontSize: '0.88rem', marginBottom: '1.25rem', background: '#ffffff', border: '1.5px solid #cbd5e1', padding: '0.5rem 1rem', borderRadius: '12px', textDecoration: 'none' }}
        >
          <ArrowLeft size={16} /> {language === 'ta' ? 'அட்டவணைக்கு திரும்பு' : 'Back to Catalogue'}
        </Link>

        {/* Main Confirmation Card */}
        <div className="confirmation-card-light" style={{ background: '#ffffff', borderRadius: '24px', padding: '2.25rem 2rem', border: '1.5px solid #e2e8f0', boxShadow: '0 8px 30px rgba(0, 0, 0, 0.04)', color: '#1e293b' }}>
          
          {/* Header Banner (Screen Only) */}
          <div className="confirmation-header-banner screen-only-section" style={{ textAlign: 'center', paddingBottom: '1.75rem', borderBottom: '1.5px dashed #cbd5e1', marginBottom: '1.75rem' }}>
            <div className="confirmation-emoji" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
              <CheckCircle2 size={54} color="#059669" />
            </div>
            
            <div className="sparkle-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#ecfdf5', border: '1.5px solid #a7f3d0', padding: '0.35rem 0.95rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 900, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem' }}>
              <CheckCircle2 size={14} color="#059669" />
              <span>{language === 'ta' ? 'ஆர்டர் உறுதி செய்யப்பட்டது' : 'ORDER CONFIRMED'}</span>
            </div>

            <h1 className="confirmation-title" style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: '0.35rem 0 0.5rem 0', letterSpacing: '-0.02em' }}>
              {t('orderPlaced', 'Thank You For Your Order!')}
            </h1>

            <div className="confirmation-id-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.55rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ color: '#64748b', fontWeight: 800, fontSize: '0.9rem' }}>{t('orderId', 'Order ID')}:</span>
              <strong style={{ color: '#d90429', fontSize: '1.25rem', fontWeight: 900 }}>#{orderIdVal}</strong>
              <button
                onClick={() => handleCopyOrderId(orderIdVal)}
                title="Copy Order ID"
                className="no-print"
                style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', color: '#0f172a', padding: '0.3rem 0.75rem', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
              >
                {copied ? <Check size={13} color="#059669" /> : <Copy size={13} color="#475569" />}
                <span style={{ color: copied ? '#059669' : '#0f172a' }}>{copied ? (language === 'ta' ? 'நகலெடுக்கப்பட்டது!' : 'Copied!') : (language === 'ta' ? 'நகலெடு' : 'Copy')}</span>
              </button>
            </div>
          </div>

          {/* Invoice Summary Grid (Screen Only) */}
          <div className="invoice-summary-grid screen-only-section" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', background: '#f8fafc', padding: '1.25rem 1.5rem', borderRadius: '16px', border: '1.5px solid #e2e8f0', marginBottom: '1.75rem' }}>
            <div>
              <div className="invoice-label" style={{ fontSize: '0.725rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.04em' }}>{t('orderDate', 'ORDER DATE')}</div>
              <div className="invoice-val" style={{ color: '#0f172a', fontWeight: 800, fontSize: '0.9rem', marginTop: '0.2rem' }}>{orderDateVal}</div>
            </div>
            <div>
              <div className="invoice-label" style={{ fontSize: '0.725rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.04em' }}>ORDER STATUS</div>
              <div className="invoice-val" style={{ color: '#059669', fontWeight: 900, fontSize: '0.9rem', marginTop: '0.2rem', textTransform: 'capitalize' }}>● {statusVal}</div>
            </div>
            <div>
              <div className="invoice-label" style={{ fontSize: '0.725rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.04em' }}>ORDER TYPE</div>
              <div className="invoice-val" style={{ color: '#0f172a', fontWeight: 800, fontSize: '0.9rem', marginTop: '0.2rem', textTransform: 'capitalize' }}>{paymentMethodVal}</div>
            </div>
            {totalAmountVal > 0 && (
              <div>
                <div className="invoice-label" style={{ fontSize: '0.725rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.04em' }}>{t('grandTotal', 'TOTAL AMOUNT')}</div>
                <div className="invoice-val" style={{ color: '#d90429', fontWeight: 900, fontSize: '1.15rem', marginTop: '0.1rem' }}>₹{totalAmountVal}</div>
              </div>
            )}
          </div>

          {/* Purchased Products Cards List (Screen Only) */}
          {items.length > 0 && (
            <div className="screen-only-section">
              <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', color: '#0f172a', fontWeight: 900, paddingBottom: '0.5rem', borderBottom: '1.5px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Package size={20} color="var(--crimson-red)" />
                {t('products', 'Purchased Products')} ({items.length})
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.75rem' }}>
                {items.map((item, idx) => {
                  const itemName = item.name || item.product_name || `Product #${item.product_id || idx + 1}`;
                  const itemQty = item.quantity || 1;
                  const itemPrice = item.price || item.unit_price || 0;
                  const itemTotal = item.total_price || (itemPrice * itemQty);
                  const itemImage = item.image || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=400';

                  return (
                    <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '0.85rem 1rem', background: '#ffffff', borderRadius: '14px', border: '1.5px solid #f1f5f9', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                      <img src={itemImage} alt={itemName} loading="lazy" decoding="async" style={{ width: '56px', height: '56px', borderRadius: '12px', objectFit: 'cover', border: '1px solid #e2e8f0' }} />
                      <div style={{ flexGrow: 1 }}>
                        <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a' }}>{itemName}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700, marginTop: '2px' }}>{t('qty', 'Qty')}: {itemQty} {itemPrice > 0 ? `× ₹${itemPrice}` : ''}</div>
                      </div>
                      {itemTotal > 0 && <div style={{ fontWeight: 900, color: '#d90429', fontSize: '1rem' }}>₹{itemTotal}</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Delivery Destination Card (Screen Only) */}
          {(fullAddress || customerNameVal) && (
            <div className="screen-only-section" style={{ background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)', padding: '1.25rem 1.5rem', borderRadius: '18px', marginBottom: '2rem', border: '1.5px solid #fed7aa', boxShadow: '0 4px 14px rgba(217, 4, 41, 0.04)' }}>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '0.45rem', display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#0f172a', fontWeight: 900 }}>
                <MapPin size={18} color="#d90429" /> {t('shippingAddress', 'Shipping Destination')}
              </h4>
              <div style={{ fontSize: '0.875rem', color: '#334155', lineHeight: 1.55 }}>
                {customerNameVal && <><strong style={{ color: '#0f172a', fontWeight: 900 }}>{customerNameVal}</strong> {phoneVal ? `(${phoneVal})` : ''}<br /></>}
                {fullAddress} {pincodeVal ? `- ${pincodeVal}` : ''}
              </div>
            </div>
          )}

          {/* Action Buttons Bar */}
          <div className="confirmation-action-btns no-print" style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            <button
              className="btn-primary confirmation-action-btn"
              onClick={() => navigate(`/order-tracking?orderId=${orderIdVal}`)}
              style={{ flex: 1, minWidth: '220px', background: '#0f172a', color: '#ffffff', fontWeight: 900, fontSize: '0.92rem', padding: '0.85rem 1.25rem', borderRadius: '14px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxShadow: '0 4px 14px rgba(15, 23, 42, 0.15)' }}
            >
              <Truck size={18} color="#ffffff" /> {t('trackBtn', 'Track Order Progress')}
            </button>

            <button
              className="btn-secondary confirmation-action-btn"
              onClick={() => window.print()}
              style={{ background: '#f8fafc', color: '#0f172a', border: '1.5px solid #cbd5e1', fontWeight: 800, fontSize: '0.90rem', padding: '0.85rem 1.25rem', borderRadius: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem' }}
            >
              <Printer size={18} color="#334155" /> {language === 'ta' ? 'ரசீது அச்சிடு' : 'Print Official Receipt'}
            </button>
          </div>

          {/* Formal Printable Tax Receipt Template Sheet */}
          <div className="printable-receipt-sheet" style={{ background: '#ffffff', color: '#0f172a' }}>
            
            {/* Store Header & Receipt Title */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #0f172a', paddingBottom: '0.85rem', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                {logoUrl && (
                  <img src={logoUrl} alt={displayShopName} style={{ height: '44px', width: 'auto', objectFit: 'contain' }} />
                )}
                <div>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', margin: 0, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
                    {displayShopName}
                  </h2>
                  <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '2px', fontWeight: 700 }}>
                    {shopAddress || 'Sivakasi Direct Factory Outlet, Tamil Nadu'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                    Phone: +91 {displayPhone} {email ? `| Email: ${email}` : ''}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#d90429', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  TAX INVOICE / RECEIPT
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', marginTop: '3px' }}>
                  Order No: <strong>#{orderIdVal}</strong>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                  Date: {orderDateVal}
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', marginTop: '3px', textTransform: 'uppercase' }}>
                  Status: ● {statusVal}
                </div>
              </div>
            </div>

            {/* Customer & Shipping Info Box */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', background: '#f8fafc', padding: '0.85rem 1.15rem', borderRadius: '12px', border: '1px solid #cbd5e1', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.25rem' }}>
                  BILLED TO / CUSTOMER DETAILS
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>{customerNameVal || 'Valued Customer'}</div>
                {phoneVal && <div style={{ fontSize: '0.8rem', color: '#334155', fontWeight: 700, marginTop: '2px' }}>Phone: +91 {phoneVal}</div>}
                {emailVal && <div style={{ fontSize: '0.8rem', color: '#334155', marginTop: '2px' }}>Email: {emailVal}</div>}
              </div>

              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.25rem' }}>
                  DELIVERY DESTINATION
                </div>
                <div style={{ fontSize: '0.825rem', color: '#334155', lineHeight: 1.4, fontWeight: 600 }}>
                  {fullAddress || 'Direct Factory Delivery / Customer Pickup'}
                  {pincodeVal ? ` - ${pincodeVal}` : ''}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#0f172a', fontWeight: 800, marginTop: '4px' }}>
                  Payment Method: {paymentMethodVal}
                </div>
              </div>
            </div>

            {/* Items Printable Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.25rem', fontSize: '0.825rem' }}>
              <thead>
                <tr style={{ background: '#0f172a', color: '#ffffff', textAlign: 'left' }}>
                  <th style={{ padding: '0.55rem 0.75rem', borderRadius: '6px 0 0 0', width: '35px' }}>#</th>
                  <th style={{ padding: '0.55rem 0.75rem' }}>Product Description</th>
                  <th style={{ padding: '0.55rem 0.75rem', textAlign: 'center', width: '60px' }}>Qty</th>
                  <th style={{ padding: '0.55rem 0.75rem', textAlign: 'right', width: '90px' }}>Unit Price</th>
                  <th style={{ padding: '0.55rem 0.75rem', textAlign: 'right', borderRadius: '0 6px 0 0', width: '100px' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {items.length > 0 ? (
                  items.map((item, idx) => {
                    const itemName = item.name || item.product_name || `Product #${item.product_id || idx + 1}`;
                    const itemQty = item.quantity || 1;
                    const itemPrice = item.price || item.unit_price || 0;
                    const itemTotal = item.total_price || (itemPrice * itemQty);

                    return (
                      <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', background: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                        <td style={{ padding: '0.55rem 0.75rem', fontWeight: 800, color: '#64748b' }}>{idx + 1}</td>
                        <td style={{ padding: '0.55rem 0.75rem', fontWeight: 700, color: '#0f172a' }}>{itemName}</td>
                        <td style={{ padding: '0.55rem 0.75rem', textAlign: 'center', fontWeight: 800, color: '#0f172a' }}>{itemQty}</td>
                        <td style={{ padding: '0.55rem 0.75rem', textAlign: 'right', color: '#475569' }}>₹{itemPrice}</td>
                        <td style={{ padding: '0.55rem 0.75rem', textAlign: 'right', fontWeight: 900, color: '#0f172a' }}>₹{itemTotal}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" style={{ padding: '1rem', textAlign: 'center', color: '#64748b', fontStyle: 'italic' }}>
                      Order item details recorded with Order #{orderIdVal}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Financial Totals Calculation Box */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.25rem' }}>
              <div style={{ width: '260px', background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '10px', border: '1.5px solid #cbd5e1' }}>
                {subtotalVal > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b', marginBottom: '0.3rem' }}>
                    <span>Items Subtotal:</span>
                    <span style={{ fontWeight: 800, color: '#0f172a' }}>₹{subtotalVal}</span>
                  </div>
                )}
                {discountVal > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#059669', marginBottom: '0.3rem' }}>
                    <span>Festival Offer Discount:</span>
                    <span style={{ fontWeight: 800 }}>-₹{discountVal}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b', marginBottom: '0.4rem' }}>
                  <span>Shipping & Handling:</span>
                  <span style={{ fontWeight: 800, color: '#0f172a' }}>{chargesVal === 0 ? 'FREE' : `₹${chargesVal}`}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: 900, color: '#d90429', paddingTop: '0.45rem', borderTop: '1.5px dashed #cbd5e1' }}>
                  <span>GRAND TOTAL:</span>
                  <span>₹{totalAmountVal}</span>
                </div>
              </div>
            </div>

            {/* Receipt Footer Terms & Certification */}
            <div style={{ borderTop: '1.5px solid #e2e8f0', paddingTop: '0.75rem', textAlign: 'center', fontSize: '0.725rem', color: '#64748b', lineHeight: 1.4 }}>
              <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: '2px' }}>
                100% CSIR-NEERI Certified Green Crackers • Factory Direct Outlet
              </div>
              <div>Thank you for ordering with {displayShopName}! Wish you a bright & happy Diwali!</div>
              <div style={{ fontStyle: 'italic', marginTop: '3px', fontSize: '0.68rem', color: '#94a3b8' }}>
                This is an official computer-generated receipt for Order #{orderIdVal}.
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

