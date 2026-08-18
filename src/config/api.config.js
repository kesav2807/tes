import { getShopDomain } from '../utils/subdomain';

export const API_CONFIG = {
  DOMAIN: 'https://offer360.in',
  BASE_URL: 'https://offer360.in/fireworks/crackers',
  PROXY_URL: '/offer360-api/fireworks/crackers',
  DIRECT_URL: 'https://offer360.in/fireworks/crackers',
  get SHOP_DOMAIN() {
    return getShopDomain();
  },
  get HEADERS() {
    return {
      'x-shop-domain': getShopDomain(),
      'Content-Type': 'application/json',
    };
  },
  ENDPOINTS: {
    GET_PRODUCTS: '/getproducts',
    GET_CATEGORY: '/getcategory',
    GET_COUPONS: '/getcoupons',
    GET_THEMES: '/getthemes',
    POST_MYORDERS: '/myorders',
    GET_TRACK_ORDER: '/trackorder',
    GET_REELS: '/getreels',
    GET_OFFERS: '/getoffers',
    GET_FOOTER: '/getfooter',
    GET_COMBO_PACKS: '/getcombo-packs',
    GET_WEB_CONTROL: '/get-web-control',
  }
};
