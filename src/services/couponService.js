import { API_CONFIG } from '../config/api.config';
import { translateCouponsToTamil } from './translationService';

const GRADIENTS = [
  'linear-gradient(135deg, #e60026 0%, #ff0055 45%, #ff9900 100%)',
  'linear-gradient(135deg, #4c1d95 0%, #6d28d9 45%, #0284c7 100%)',
  'linear-gradient(135deg, #1e293b 0%, #334155 45%, #be123c 100%)',
  'linear-gradient(135deg, #065f46 0%, #059669 45%, #10b981 100%)',
  'linear-gradient(135deg, #9a3412 0%, #c2410c 45%, #ea580c 100%)',
];

/**
 * Transforms raw API coupon object into UI offer banner schema
 */
export const transformApiCoupon = (item, index = 0) => {
  const isPercentage = item.discount_type === 'percentage';
  const discountLabel = isPercentage
    ? `${item.discount_value}% OFF`
    : `₹${item.discount_value} OFF`;

  const minOrderText = Number(item.minimum_order_amount) > 0
    ? `Min. Order ₹${item.minimum_order_amount}`
    : '';

  return {
    id: `coupon-${item.id}`,
    rawId: item.id,
    adminId: item.admin_id,
    title: item.name ? item.name.toUpperCase() : 'SPECIAL OFFER',
    titleTa: item.name ? item.name : 'சிறப்பு சலுகை',
    tagline: item.discount_value
      ? `FLAT ${discountLabel} - ${item.name || 'FESTIVAL SPECIAL'}`
      : (item.name || 'SPECIAL FESTIVE OFFER'),
    taglineTa: item.discount_value
      ? `${discountLabel} தள்ளுபடி - ${item.name || 'சிறப்பு சலுகை'}`
      : (item.name || 'சிறப்பு பண்டிகை சலுகை'),
    code: item.code || 'SAVE10',
    description: item.description
      ? `${item.description}${minOrderText ? ` • ${minOrderText}` : ''}`
      : `Use coupon code ${item.code} to get ${discountLabel}${minOrderText ? ` on orders above ₹${item.minimum_order_amount}` : ''}.`,
    descriptionTa: item.description
      ? `${item.description}${minOrderText ? ` • ${minOrderText}` : ''}`
      : `${item.code} குறியீட்டைப் பயன்படுத்தி ${discountLabel} பெறலாம்.`,
    discountType: item.discount_type,
    discountValue: Number(item.discount_value || 0),
    minimumOrderAmount: Number(item.minimum_order_amount || 0),
    expiry: item.expiry,
    bannerBg: GRADIENTS[index % GRADIENTS.length],
    ctaText: 'Claim Coupon',
    ctaTextTa: 'கூப்பனைப் பெறுக',
    isApi: true
  };
};

const extractArray = (json) => {
  if (!json) return [];
  if (Array.isArray(json)) return json;
  if (Array.isArray(json.data)) return json.data;
  if (json.data && Array.isArray(json.data.data)) return json.data.data;
  return [];
};

/**
 * Fetch coupons from API endpoint GET /getcoupons with headers
 */
export const getCoupons = async () => {
  const isDev = import.meta.env.DEV || (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'));
  const endpoint = API_CONFIG.ENDPOINTS.GET_COUPONS;

  const urlsToTry = isDev ? [
    `/fireworks/crackers${endpoint}`,
    `${API_CONFIG.PROXY_URL}${endpoint}`
  ] : [
    `${API_CONFIG.PROXY_URL}${endpoint}`,
    `/fireworks/crackers${endpoint}`,
    `${API_CONFIG.BASE_URL}${endpoint}`
  ];

  for (const url of Array.from(new Set(urlsToTry))) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: API_CONFIG.HEADERS,
      });
      const contentType = response.headers.get('content-type') || '';
      if (response.ok && contentType.includes('application/json')) {
        const json = await response.json();
        const items = extractArray(json);
        if (items.length > 0) {
          const activeCoupons = items.filter(c => String(c.is_delete) === '0' || !c.is_delete);
          if (activeCoupons.length > 0) {
            const transformed = activeCoupons.map((item, idx) => transformApiCoupon(item, idx));
            return await translateCouponsToTamil(transformed);
          }
        }
      }
    } catch (err) {
      console.warn(`Fetch for coupons failed at ${url}:`, err);
    }
  }

  return [];
};
