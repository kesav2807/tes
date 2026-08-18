import { API_CONFIG } from '../config/api.config';
import { getProducts } from './productService';

/**
 * Format order payload according to the API spec:
 * POST /crackers/myorders or /myorders
 * Body:
 * {
 *   "customer_name": "Online Shopper",
 *   "customer_mobile": "9988776655",
 *   "coupon_code": "DIWALI2024",
 *   "address": "123 Main Road, Near Bus Stand",
 *   "postalcode": "641001",
 *   "payment_method": "cod", // 'cash','cod','upi','card','online','other'
 *   "coupon_discount": 100,
 *   "delivery_fee": 0,
 *   "payable_amount": 2000,
 *   "items": [
 *     { "product_id": 1, "product_name": "crackers", "quantity": 2, "unit_price": 200, "total_price": 400 }
 *   ]
 * }
 */
export const formatOrderApiPayload = async (rawPayload) => {
  const customer = rawPayload.customerInfo || rawPayload.customer || {};
  const items = rawPayload.items || [];

  // Map payment method to valid API enum string
  let paymentMethod = (rawPayload.paymentMethod || 'cod').toString().toLowerCase();
  if (paymentMethod.includes('upi') || paymentMethod.includes('gpay')) {
    paymentMethod = 'upi';
  } else if (paymentMethod.includes('card')) {
    paymentMethod = 'card';
  } else if (paymentMethod.includes('net') || paymentMethod.includes('online')) {
    paymentMethod = 'online';
  } else if (paymentMethod.includes('cash')) {
    paymentMethod = 'cash';
  } else if (paymentMethod.includes('cod')) {
    paymentMethod = 'cod';
  } else if (!['cash', 'cod', 'upi', 'card', 'online', 'other'].includes(paymentMethod)) {
    paymentMethod = 'other';
  }

  // Fetch live active product IDs directly from API GET /getproducts
  const knownShopProductIds = [1, 4, 5, 6, 7, 8, 10, 11];
  let liveProductIds = [];
  try {
    const liveProducts = await getProducts();
    if (Array.isArray(liveProducts) && liveProducts.length > 0) {
      liveProductIds = liveProducts
        .map(p => Number(p.rawId || p.id))
        .filter(id => !isNaN(id) && id > 0);
    }
  } catch (err) {
    console.warn('Failed fetching live products in formatOrderApiPayload:', err);
  }

  const validProductIds = liveProductIds.length > 0 ? liveProductIds : knownShopProductIds;

  const formattedItems = items.map((item, index) => {
    let pId = null;
    if (item.product_id && !isNaN(Number(item.product_id)) && Number(item.product_id) > 0) {
      pId = Number(item.product_id);
    } else if (item.rawId && !isNaN(Number(item.rawId)) && Number(item.rawId) > 0) {
      pId = Number(item.rawId);
    } else if (item.id) {
      const extracted = String(item.id).replace(/\D/g, '');
      if (extracted && !isNaN(Number(extracted)) && Number(extracted) > 0) {
        pId = Number(extracted);
      }
    }

    // Ensure product_id is verified against valid shop product IDs
    if (!pId || !validProductIds.includes(pId)) {
      pId = validProductIds[index % validProductIds.length];
    }

    const pName = item.product_name || item.name || `Product #${pId}`;
    const qty = Number(item.quantity || 1);
    const unitPrice = Number(item.unit_price || item.price || 0);
    const totalPrice = Number(item.total_price || (unitPrice * qty));

    return {
      product_id: pId,
      product_name: pName,
      quantity: qty,
      unit_price: unitPrice,
      total_price: totalPrice,
    };
  });

  const addressStr = rawPayload.address || customer.address
    ? [customer.address || rawPayload.address, customer.city, customer.district, customer.state].filter(Boolean).join(', ')
    : '123 Main Road, Near Bus Stand';

  const postalcodeStr = String(rawPayload.postalcode || rawPayload.pincode || customer.postalcode || customer.pincode || '641001');

  return {
    customer_name: rawPayload.customer_name || customer.fullName || 'Online Shopper',
    customer_mobile: rawPayload.customer_mobile || customer.phone || '9988776655',
    coupon_code: (rawPayload.coupon_code || rawPayload.couponCode || '').trim() || null,
    address: addressStr,
    postalcode: postalcodeStr,
    payment_method: paymentMethod,
    coupon_discount: Number(rawPayload.coupon_discount ?? rawPayload.discount ?? 0),
    delivery_fee: Number(rawPayload.delivery_fee ?? rawPayload.charges ?? 0),
    payable_amount: Number(rawPayload.payable_amount ?? rawPayload.totalAmount ?? 0),
    items: formattedItems,
  };
};

/**
 * Post order to API /myorders
 */
export const postMyOrders = async (rawPayload) => {
  const payload = await formatOrderApiPayload(rawPayload);
  const endpoint = API_CONFIG.ENDPOINTS.POST_MYORDERS;
  
  const isDev = import.meta.env.DEV || (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'));

  // Get optional auth token from local storage if available
  const token = localStorage.getItem('token') || localStorage.getItem('authToken') || '';
  const headers = {
    ...API_CONFIG.HEADERS,
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };

  const urlsToTry = isDev ? [
    `/fireworks/crackers${endpoint}`,
    `${API_CONFIG.PROXY_URL}${endpoint}`
  ] : [
    `${API_CONFIG.PROXY_URL}${endpoint}`,
    `/fireworks/crackers${endpoint}`,
    `${API_CONFIG.BASE_URL}${endpoint}`
  ];

  for (const targetUrl of Array.from(new Set(urlsToTry))) {
    try {
      console.log('Sending POST to myorders endpoint:', targetUrl, payload);
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      const contentType = response.headers.get('content-type') || '';
      if (response.ok && contentType.includes('application/json')) {
        const json = await response.json();
        console.log('POST myorders response success:', json);
        const returnedData = json.data || json;
        const orderId = returnedData.order_no || returnedData.id || json.id || json.order_id || null;
        return {
          success: true,
          data: json,
          orderData: returnedData,
          orderId: orderId ? String(orderId) : null,
          message: json.message || 'Order created successfully.'
        };
      } else {
        const errorJson = contentType.includes('application/json') ? await response.json().catch(() => null) : null;
        console.warn(`POST myorders API returned status (${response.status}) for ${targetUrl}:`, errorJson);
      }
    } catch (err) {
      console.warn(`POST myorders fetch error for ${targetUrl}:`, err);
    }
  }

  return {
    success: false,
    message: 'Failed to place order via API endpoints'
  };
};

/**
 * Track order status via API GET /trackorder/:orderNo
 */
export const getTrackOrder = async (orderNo) => {
  if (!orderNo || !orderNo.trim()) {
    return { success: false, message: 'Order number is required.' };
  }

  const cleanOrderNo = orderNo.trim();
  const endpoint = `${API_CONFIG.ENDPOINTS.GET_TRACK_ORDER}/${encodeURIComponent(cleanOrderNo)}`;

  const isDev = import.meta.env.DEV || (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'));

  const urlsToTry = isDev ? [
    `/fireworks/crackers${endpoint}`,
    `${API_CONFIG.PROXY_URL}${endpoint}`
  ] : [
    `${API_CONFIG.PROXY_URL}${endpoint}`,
    `/fireworks/crackers${endpoint}`,
    `${API_CONFIG.BASE_URL}${endpoint}`
  ];

  for (const targetUrl of Array.from(new Set(urlsToTry))) {
    try {
      console.log('Fetching order tracking from API endpoint:', targetUrl);
      const response = await fetch(targetUrl, {
        method: 'GET',
        headers: API_CONFIG.HEADERS,
      });

      const contentType = response.headers.get('content-type') || '';
      if (response.ok && contentType.includes('application/json')) {
        const json = await response.json();
        console.log('Track order API response:', json);

        if (json.success && json.data) {
          const rawData = json.data;
          const statusLower = (rawData.order_status || 'placed').toLowerCase();

          let currentStep = 1;
          if (['confirmed', 'processing'].includes(statusLower)) currentStep = 2;
          else if (['packed', 'packing'].includes(statusLower)) currentStep = 3;
          else if (['shipped', 'dispatched', 'in transit', 'in_transit'].includes(statusLower)) currentStep = 4;
          else if (['delivered', 'completed', 'paid'].includes(statusLower)) currentStep = 5;

          const formattedOrder = {
            orderId: rawData.order_no || cleanOrderNo,
            orderNo: rawData.order_no || cleanOrderNo,
            orderStatus: rawData.order_status || 'Processing',
            paymentStatus: rawData.payment_status || 'Pending',
            customerName: rawData.customer_name || '',
            phone: rawData.customer_mobile || '',
            address: rawData.address || '',
            city: rawData.city || '',
            state: rawData.state || '',
            pincode: rawData.postalcode || '',
            createdAt: rawData.created_at || '',
            updatedAt: rawData.updated_at || '',
            subtotal: rawData.subtotal ? Number(rawData.subtotal) : null,
            totalAmount: rawData.payable_amount ? Number(rawData.payable_amount) : (rawData.subtotal ? Number(rawData.subtotal) : null),
            items: (rawData.items && Array.isArray(rawData.items) && rawData.items.length > 0) ? rawData.items : [],
            currentStep: currentStep,
            trackingHistory: [
              { title: 'Order Placed', time: rawData.created_at || 'Confirmed', completed: currentStep >= 1, desc: 'Your order was successfully placed.' },
              { title: 'Order Confirmed', time: currentStep >= 2 ? 'Verified' : 'Processing', completed: currentStep >= 2, desc: 'Payment and order details verified.' },
              { title: 'Processing & Packing', time: currentStep >= 3 ? 'Packed' : 'Upcoming', completed: currentStep >= 3, desc: 'Safety packaging and quality inspection.' },
              { title: 'Ready / Dispatched', time: currentStep >= 4 ? 'Dispatched' : 'Upcoming', completed: currentStep >= 4, desc: 'Dispatched with courier partner.' },
              { title: 'Completed / Delivered', time: currentStep >= 5 ? 'Delivered' : 'Upcoming', completed: currentStep >= 5, desc: 'Delivered to your address.' }
            ]
          };

          return { success: true, order: formattedOrder, rawData: rawData };
        } else {
          return { success: false, message: json.message || `No tracking information found for #${cleanOrderNo}` };
        }
      }
    } catch (err) {
      console.warn(`Track order fetch error for ${targetUrl}:`, err);
    }
  }

  return { success: false, message: `Could not connect to tracking server for #${cleanOrderNo}` };
};

