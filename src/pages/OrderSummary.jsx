import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useOrder } from '../context/OrderContext';
import { ShieldCheck, MessageSquare, ArrowLeft, Package, MapPin, Award, Truck, CheckCircle2, Phone, Mail, FileText, Tag } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useWebControl } from '../context/WebControlContext';
import { LazyImage } from '../components/LazyImage';

export const OrderSummary = () => {
  const navigate = useNavigate();
  const { cartItems, subtotal, discountAmount, shippingCharges, finalTotal, appliedCoupon, clearCart } = useCart();
  const { customerInfo, createServerOrder } = useOrder();
  const { language, t, getText } = useLanguage();
  const { formattedWhatsapp, whatsapp, phone, shopName } = useWebControl();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const displayShopName = shopName || 'SDS Crackers';

  if (!customerInfo || cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Package size={54} color="#94a3b8" style={{ marginBottom: '1rem' }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>{t('noOrderDetailsFound', 'No Order Details Found')}</h2>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>{t('pleaseFillCheckoutFirst', 'Please complete your checkout details first before viewing summary.')}</p>
        <Link to="/cart" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <ArrowLeft size={16} /> {t('backToCart', 'Back to Cart')}
        </Link>
      </div>
    );
  }

  const handlePlaceOrderWhatsApp = async () => {
    try {
      setIsSubmitting(true);
      setErrorMessage('');

      // Build Order Object
      const orderPayload = {
        customerInfo,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          nameTa: item.nameTa,
          price: item.price,
          quantity: item.quantity,
          totalPrice: item.price * item.quantity,
          image: item.image,
        })),
        pricing: {
          subtotal,
          discountAmount,
          appliedCoupon: appliedCoupon ? appliedCoupon.code : null,
          shippingCharges,
          finalTotal,
        },
        paymentMethod: 'COD / WhatsApp Order',
        status: 'Order Placed',
        createdAt: new Date().toISOString(),
      };

      // Create Order via Server / Context
      const orderResponse = await createServerOrder(orderPayload);
      const savedOrderId = orderResponse?.orderId || `SDS-${Math.floor(100000 + Math.random() * 900000)}`;

      // Construct WhatsApp Message
      let msg = `*NEW CRACKERS ORDER #${savedOrderId}*\n`;
      msg += `-----------------------------------\n`;
      msg += `*Customer Details:*\n`;
      msg += `Name: ${customerInfo.fullName}\n`;
      msg += `Phone: ${customerInfo.phone}\n`;
      msg += `Address: ${customerInfo.address}, ${customerInfo.city}, ${customerInfo.state} - ${customerInfo.pincode}\n`;
      if (customerInfo.notes) msg += `Notes: ${customerInfo.notes}\n`;
      msg += `-----------------------------------\n`;
      msg += `*Order Items:*\n`;

      cartItems.forEach((item, index) => {
        msg += `${index + 1}. ${item.name} (${item.quantity} x ₹${item.price}) = ₹${item.price * item.quantity}\n`;
      });

      msg += `-----------------------------------\n`;
      msg += `*Subtotal:* ₹${subtotal}\n`;
      if (discountAmount > 0) msg += `*Discount:* -₹${discountAmount}\n`;
      msg += `*Delivery:* ₹${shippingCharges}\n`;
      msg += `*GRAND TOTAL:* ₹${finalTotal}\n`;
      msg += `-----------------------------------\n`;
      msg += `Please confirm my order and share payment/delivery instructions. Thank you!`;

      // Clear local cart
      clearCart();

      // Redirect to WhatsApp or Confirmation page
      const targetPhone = formattedWhatsapp || whatsapp || phone || '919876543210';
      const encodedMsg = encodeURIComponent(msg);
      const waUrl = `https://wa.me/${targetPhone}?text=${encodedMsg}`;

      window.open(waUrl, '_blank');
      navigate(`/order-confirmation/${savedOrderId}`, { state: { orderId: savedOrderId, orderPayload } });
    } catch (err) {
      console.error('Order submission error:', err);
      setErrorMessage(err.message || 'Failed to submit order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '2rem 0 4rem 0', background: '#f8fafc', minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '1020px' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <button onClick={() => navigate('/checkout')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', fontWeight: 700, padding: 0 }}>
            <ArrowLeft size={16} /> {t('backToCheckout', 'Back to Checkout')}
          </button>
        </div>

        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
          {t('orderSummary', 'Review & Confirm Order')}
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
          {/* Left Column: Items List */}
          <div>
            <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '20px', border: '1.5px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '1.15rem', paddingBottom: '0.75rem', borderBottom: '1.5px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a', fontWeight: 900 }}>
                <Package size={20} color="var(--crimson-red)" />
                {t('products', 'Ordered Items')} ({cartItems.length})
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
                {cartItems.map((item, idx) => (
                  <div key={item.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', paddingBottom: idx < cartItems.length - 1 ? '0.95rem' : '0', borderBottom: idx < cartItems.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                    <LazyImage src={item.image} alt={getText(item, 'name')} style={{ width: '58px', height: '58px', borderRadius: '12px', objectFit: 'cover', border: '1px solid #e2e8f0' }} />
                    <div style={{ flexGrow: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a', marginBottom: '2px' }}>{getText(item, 'name')}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                        <span>₹{item.price} × {item.quantity}</span>
                        {item.discount > 0 && (
                          <span style={{ fontSize: '0.68rem', color: '#059669', background: '#ecfdf5', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 800, border: '1px solid #a7f3d0' }}>
                            {item.discount}% OFF
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ fontWeight: 900, fontSize: '1rem', color: 'var(--crimson-red)' }}>₹{item.price * item.quantity}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address Card */}
            <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '20px', border: '1.5px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)' }}>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1.5px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a', fontWeight: 900 }}>
                <MapPin size={20} color="var(--crimson-red)" />
                {t('shippingAddress', 'Delivery Address')}
              </h3>
              <div style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#334155' }}>
                <div style={{ fontWeight: 900, color: '#0f172a', fontSize: '1rem', marginBottom: '0.25rem' }}>{customerInfo.fullName}</div>
                <div>{customerInfo.address}</div>
                <div>{customerInfo.city}, {customerInfo.district}, {customerInfo.state} - <span style={{ fontWeight: 800 }}>{customerInfo.pincode}</span></div>
                <div style={{ color: '#64748b', marginTop: '0.65rem', paddingTop: '0.65rem', borderTop: '1px dashed #e2e8f0', fontSize: '0.825rem', fontWeight: 700, display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}><Phone size={13} /> {customerInfo.phone}</span>
                  {customerInfo.email && <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}><Mail size={13} /> {customerInfo.email}</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Summary Column */}
          <div>
            <div className="summary-card" style={{ background: '#ffffff', borderRadius: '20px', padding: '1.5rem', border: '1.5px solid #e2e8f0', boxShadow: '0 6px 25px rgba(0, 0, 0, 0.04)' }}>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1.5px solid #f1f5f9', color: '#0f172a', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={20} color="var(--crimson-red)" />
                {t('cartSummary', 'ORDER TOTAL PAYABLE')}
              </h3>

              <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.92rem' }}>
                <span style={{ color: '#64748b', fontWeight: 600 }}>{t('subtotal', 'Items Subtotal')}</span>
                <span style={{ fontWeight: 800, color: '#0f172a' }}>₹{subtotal}</span>
              </div>

              {appliedCoupon && (
                <div style={{ background: '#ecfdf5', border: '1.5px solid #a7f3d0', padding: '0.65rem 0.85rem', borderRadius: '12px', marginBottom: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#059669', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Tag size={14} /> APPLIED OFFER: {appliedCoupon.code}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#047857', fontWeight: 700 }}>
                      {appliedCoupon.name || 'Festival Special Offer'}
                    </span>
                  </div>
                  <span style={{ fontWeight: 900, color: '#059669', fontSize: '0.95rem' }}>
                    -₹{discountAmount}
                  </span>
                </div>
              )}

              {discountAmount > 0 && !appliedCoupon && (
                <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.92rem', color: '#059669' }}>
                  <span style={{ fontWeight: 700 }}>{t('discount', 'Festival Offer Discount')}</span>
                  <span style={{ fontWeight: 900 }}>-₹{discountAmount}</span>
                </div>
              )}

              <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.92rem' }}>
                <span style={{ color: '#64748b', fontWeight: 600 }}>{t('deliveryFee', 'Shipping Charges')}</span>
                <span style={{ fontWeight: 800, color: '#059669' }}>{shippingCharges === 0 ? t('freeDelivery', 'FREE') : `₹${shippingCharges}`}</span>
              </div>

              <div className="summary-total" style={{ borderTop: '2px dashed #cbd5e1', paddingTop: '1rem', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#0f172a', fontWeight: 900, fontSize: '1.05rem' }}>{t('grandTotal', 'Final Payable Amount')}</span>
                <span style={{ color: '#d90429', fontWeight: 900, fontSize: '1.4rem', letterSpacing: '-0.02em' }}>₹{finalTotal}</span>
              </div>

              <button
                className="btn-primary pulse-glow desktop-pay-btn"
                onClick={handleSendWhatsAppOrder}
                style={{ width: '100%', marginTop: '1.5rem', justifyContent: 'center', padding: '0.95rem 1.5rem', borderRadius: '14px', fontSize: '1rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.55rem', background: 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)', boxShadow: '0 8px 24px rgba(37, 211, 102, 0.35)', border: 'none', color: '#ffffff', cursor: 'pointer' }}
              >
                <MessageSquare size={20} /> {language === 'ta' ? 'வாட்ஸ்அப் மூலம் ஆர்டர் அனுப்பவும்' : 'Send Order via WhatsApp'}
              </button>
            </div>

            {/* Trust Badges Bar */}
            <div style={{ marginTop: '1.25rem', background: '#ffffff', borderRadius: '18px', padding: '1.1rem 1.25rem', border: '1.5px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', fontWeight: 800, color: '#334155' }}>
                <Award size={18} color="var(--crimson-red)" />
                <span>100% Direct Sivakasi Factory Quality</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', fontWeight: 800, color: '#334155' }}>
                <CheckCircle2 size={18} color="#059669" />
                <span>Instant WhatsApp Order Confirmation</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', fontWeight: 800, color: '#334155' }}>
                <Truck size={18} color="#2563eb" />
                <span>Express Doorstep Delivery</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Mobile Sticky Pay CTA Bar */}
      <div className="mobile-sticky-pay-bar" style={{ background: '#ffffff', borderTop: '1.5px solid #e2e8f0', boxShadow: '0 -4px 20px rgba(0,0,0,0.08)' }}>
        <div className="mobile-sticky-checkout-info">
          <span className="mobile-sticky-checkout-label" style={{ color: '#64748b', fontSize: '0.78rem', fontWeight: 800 }}>{t('grandTotal', 'Payable')}: ₹{finalTotal}</span>
          <span className="mobile-sticky-title" style={{ color: '#059669', fontSize: '0.72rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}><MessageSquare size={12} /> WhatsApp Direct</span>
        </div>
        <button
          className="btn-primary mobile-sticky-checkout-btn"
          onClick={handleSendWhatsAppOrder}
          style={{ background: 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)', color: '#ffffff', fontWeight: 900, borderRadius: '12px', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', border: 'none', cursor: 'pointer' }}
        >
          <MessageSquare size={18} /> {language === 'ta' ? 'வாட்ஸ்அப்பில் அனுப்பு' : 'Send via WhatsApp'}
        </button>
      </div>
    </div>
  );
};
