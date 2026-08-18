import React, { createContext, useContext, useState } from 'react';
import { postMyOrders, getTrackOrder } from '../services/orderService';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [currentOrder, setCurrentOrder] = useState(() => {
    try {
      const saved = localStorage.getItem('sds_recent_order');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [customerInfo, setCustomerInfo] = useState(() => {
    try {
      const saved = localStorage.getItem('sds_customer_info');
      return saved ? JSON.parse(saved) : {
        fullName: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        district: '',
        state: 'Tamil Nadu',
        pincode: ''
      };
    } catch (e) {
      return {
        fullName: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        district: '',
        state: 'Tamil Nadu',
        pincode: ''
      };
    }
  });

  const [paymentFailedDetails, setPaymentFailedDetails] = useState(null);

  const saveCustomerInfo = (info) => {
    setCustomerInfo(info);
    try {
      localStorage.setItem('sds_customer_info', JSON.stringify(info));
    } catch (e) {}
  };

  const createServerOrder = async (orderPayload) => {
    // Post to API /myorders endpoint
    const apiResult = await postMyOrders(orderPayload);

    const fallbackOrderId = `CRK${Math.floor(10000 + Math.random() * 90000)}`;
    const orderId = apiResult?.orderId || fallbackOrderId;
    const orderNo = apiResult?.orderData?.order_no || orderId;

    const newOrder = {
      orderId: String(orderId),
      orderNo: String(orderNo),
      apiResult: apiResult,
      customerName: orderPayload.customerInfo?.fullName || customerInfo.fullName,
      phone: orderPayload.customerInfo?.phone || customerInfo.phone,
      email: orderPayload.customerInfo?.email || customerInfo.email,
      address: orderPayload.customerInfo?.address || customerInfo.address,
      city: orderPayload.customerInfo?.city || customerInfo.city,
      district: orderPayload.customerInfo?.district || customerInfo.district,
      state: orderPayload.customerInfo?.state || customerInfo.state,
      pincode: orderPayload.customerInfo?.pincode || customerInfo.pincode,
      items: orderPayload.items,
      subtotal: orderPayload.subtotal,
      discount: orderPayload.discount,
      charges: orderPayload.charges,
      totalAmount: orderPayload.totalAmount,
      paymentStatus: apiResult?.success ? 'Confirmed / Placed' : 'Order Placed',
      paymentMethod: orderPayload.paymentMethod || 'COD / Online',
      paymentId: orderPayload.paymentId || `pay_${Math.random().toString(36).substring(2, 10)}`,
      orderDate: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      currentStep: 1,
      trackingHistory: [
        { title: 'Order Placed', time: 'Just now', completed: true, desc: 'Your order was submitted to the backend API.' },
        { title: 'Order Confirmed', time: 'Processing', completed: true, desc: 'Payment verified and order accepted.' },
        { title: 'Processing & Packing', time: 'Upcoming', completed: false, desc: 'Preparing safety pack and quality check.' },
        { title: 'Ready / Dispatched', time: 'Upcoming', completed: false, desc: 'Handed over to delivery courier.' },
        { title: 'Completed / Delivered', time: 'Upcoming', completed: false, desc: 'Delivered to your doorstep.' }
      ]
    };
    setCurrentOrder(newOrder);
    try {
      localStorage.setItem('sds_recent_order', JSON.stringify(newOrder));
      
      const historyRaw = localStorage.getItem('sds_order_history');
      const historyArr = historyRaw ? JSON.parse(historyRaw) : [];
      const updatedHistory = [newOrder, ...historyArr.filter(o => o.orderId !== newOrder.orderId && o.orderNo !== newOrder.orderNo)].slice(0, 50);
      localStorage.setItem('sds_order_history', JSON.stringify(updatedHistory));
    } catch (e) {}
    return newOrder;
  };

  const fetchTrackingOrder = async (orderId) => {
    if (!orderId || !orderId.trim()) {
      return { success: false, message: 'Please enter a valid Order ID.' };
    }
    const cleanId = orderId.trim();

    // 1. Fetch live order tracking from API
    const apiRes = await getTrackOrder(cleanId);

    // 2. Check local order history for matching items fallback
    let localMatch = null;
    try {
      if (currentOrder && (currentOrder.orderId === cleanId || currentOrder.orderNo === cleanId)) {
        localMatch = currentOrder;
      } else {
        const historyRaw = localStorage.getItem('sds_order_history');
        if (historyRaw) {
          const historyArr = JSON.parse(historyRaw);
          if (Array.isArray(historyArr)) {
            localMatch = historyArr.find(o => o.orderId === cleanId || o.orderNo === cleanId);
          }
        }
      }
    } catch (e) {}

    if (apiRes && apiRes.success && apiRes.order) {
      const mergedOrder = { ...apiRes.order };

      // Enrich API order object with items and totals if API items array is empty
      if ((!mergedOrder.items || mergedOrder.items.length === 0) && localMatch?.items?.length > 0) {
        mergedOrder.items = localMatch.items;
      }
      if (!mergedOrder.subtotal && localMatch?.subtotal) mergedOrder.subtotal = localMatch.subtotal;
      if (!mergedOrder.discount && localMatch?.discount) mergedOrder.discount = localMatch.discount;
      if (!mergedOrder.charges && localMatch?.charges) mergedOrder.charges = localMatch.charges;
      if (!mergedOrder.totalAmount && localMatch?.totalAmount) mergedOrder.totalAmount = localMatch.totalAmount;
      if (!mergedOrder.customerName && localMatch?.customerName) mergedOrder.customerName = localMatch.customerName;
      if (!mergedOrder.phone && localMatch?.phone) mergedOrder.phone = localMatch.phone;

      return { ...apiRes, order: mergedOrder };
    } else if (localMatch) {
      return { success: true, order: localMatch, fromLocal: true };
    }

    return apiRes;
  };

  return (
    <OrderContext.Provider
      value={{
        customerInfo,
        saveCustomerInfo,
        currentOrder,
        setCurrentOrder,
        paymentFailedDetails,
        setPaymentFailedDetails,
        createServerOrder,
        fetchTrackingOrder
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
