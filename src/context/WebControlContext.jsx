import React, { createContext, useContext, useState, useEffect } from 'react';
import { getWebControl, getFooter, formatYouTubeEmbedUrl } from '../services/productService';
import { API_CONFIG } from '../config/api.config';

const WebControlContext = createContext();

export const WebControlProvider = ({ children }) => {
  const [webControl, setWebControl] = useState(null);
  const [footerData, setFooterData] = useState(() => {
    try {
      const cached = localStorage.getItem('sds_footer_data');
      return cached ? JSON.parse(cached) : null;
    } catch (e) {
      return null;
    }
  });
  const [loading, setLoading] = useState(!footerData);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      getWebControl().catch(() => null),
      getFooter().catch(() => null)
    ]).then(([controlData, fData]) => {
      if (isMounted) {
        if (controlData) setWebControl(controlData);
        if (fData) {
          setFooterData(fData);
          try {
            localStorage.setItem('sds_footer_data', JSON.stringify(fData));
          } catch (e) {}
        }
        setLoading(false);
      }
    });

    return () => { isMounted = false; };
  }, []);

  const isTrue = (val) => val === 'true' || val === true;

  // Web Control API flags
  const isYoutubeVisible = webControl ? isTrue(webControl.youtube_url_visible) : false;
  const isCountdownVisible = webControl ? isTrue(webControl.diwali_countdown) : false;
  const isOnlineSalesEnabled = webControl ? isTrue(webControl.online_sales) : true;

  const rawYoutubeUrl = webControl?.youtube_url || '';
  const youtubeEmbedUrl = formatYouTubeEmbedUrl(rawYoutubeUrl);

  // Helper to extract first item if data is an array
  const targetFooter = Array.isArray(footerData) ? footerData[0] : (footerData?.data ? (Array.isArray(footerData.data) ? footerData.data[0] : footerData.data) : footerData);
  const targetControl = Array.isArray(webControl) ? webControl[0] : (webControl?.data ? (Array.isArray(webControl.data) ? webControl.data[0] : webControl.data) : webControl);

  // Footer API store information & logo URL (Strict API extraction, no mock data)
  const shopName = targetFooter?.shop_name 
    ? targetFooter.shop_name.toUpperCase() 
    : (targetFooter?.shop_title 
      ? targetFooter.shop_title.toUpperCase() 
      : (targetControl?.shop_name 
        ? targetControl.shop_name.toUpperCase() 
        : ''));
  
  const rawLogo = 
    targetFooter?.image_url || 
    targetFooter?.logo_url || 
    targetFooter?.logo || 
    targetFooter?.image ||
    targetFooter?.footer_logo ||
    targetFooter?.shop_logo ||
    targetFooter?.logo_image ||
    targetFooter?.site_logo ||
    targetControl?.logo_url ||
    targetControl?.image_url ||
    targetControl?.image ||
    targetControl?.logo ||
    targetControl?.site_logo;

  let logoUrl = '';
  if (rawLogo) {
    if (rawLogo.startsWith('http://') || rawLogo.startsWith('https://') || rawLogo.startsWith('data:')) {
      logoUrl = rawLogo;
    } else if (rawLogo.includes('/uploads_crackers/')) {
      const idx = rawLogo.indexOf('/uploads_crackers/');
      logoUrl = `${API_CONFIG.DOMAIN}${rawLogo.substring(idx)}`;
    } else if (rawLogo.startsWith('/')) {
      logoUrl = `${API_CONFIG.DOMAIN}${rawLogo}`;
    } else {
      const adminId = targetFooter?.admin_id || targetControl?.admin_id || 2;
      logoUrl = `${API_CONFIG.DOMAIN}/uploads_crackers/${adminId}/footer/${rawLogo}`;
    }
  }

  const shopAddress = 
    targetFooter?.shop_address || 
    targetFooter?.address || 
    targetFooter?.location || 
    targetControl?.shop_address || 
    targetControl?.address || 
    '';

  const phone = 
    targetFooter?.phone || 
    targetFooter?.phone_number || 
    targetFooter?.mobile || 
    targetFooter?.mobile_number || 
    targetFooter?.contact_number || 
    targetControl?.phone || 
    targetControl?.mobile || 
    '';

  const whatsapp = 
    targetFooter?.whatsapp || 
    targetFooter?.whatsapp_number || 
    targetFooter?.whatsapp_no || 
    targetFooter?.mobile_number || 
    targetFooter?.mobile || 
    targetFooter?.phone || 
    targetControl?.whatsapp || 
    targetControl?.mobile || 
    phone || 
    '';

  const rawPhone = phone || whatsapp || '';
  const cleanPhone = rawPhone ? String(rawPhone).replace(/\D/g, '') : '';
  const formattedPhone = cleanPhone ? (cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone) : '917010922428';

  const rawWa = whatsapp || phone || '';
  const cleanWa = rawWa ? String(rawWa).replace(/\D/g, '') : '';
  const formattedWhatsapp = cleanWa ? (cleanWa.length === 10 ? `91${cleanWa}` : cleanWa) : '917010922428';

  useEffect(() => {
    if (formattedWhatsapp) {
      try {
        localStorage.setItem('sds_whatsapp_number', formattedWhatsapp);
      } catch (e) {}
    }
    if (formattedPhone) {
      try {
        localStorage.setItem('sds_phone_number', formattedPhone);
      } catch (e) {}
    }
  }, [formattedWhatsapp, formattedPhone]);

  const email = 
    targetFooter?.email || 
    targetFooter?.email_id || 
    targetFooter?.support_email || 
    targetControl?.email || 
    '';

  const description = 
    targetFooter?.description || 
    targetFooter?.about || 
    targetFooter?.footer_description || 
    targetControl?.description || 
    '';

  const shopNameTa = targetFooter?.shopNameTa || shopName;
  const shopAddressTa = targetFooter?.shopAddressTa || shopAddress;
  const descriptionTa = targetFooter?.descriptionTa || description;

  const copyrightNotice = 
    targetFooter?.copyrights_notice || 
    targetFooter?.copyright_notice || 
    targetFooter?.copyright || 
    targetFooter?.copyrights || 
    targetControl?.copyrights_notice || 
    targetControl?.copyright || 
    '';

  const rawFb = targetFooter?.facebook_link || targetFooter?.facebook || targetFooter?.fb_link || targetControl?.facebook_link;
  const facebookLink = rawFb ? (rawFb.startsWith('http') ? rawFb : `https://${rawFb}`) : '';

  const rawInsta = targetFooter?.instegram_link || targetFooter?.instagram_link || targetFooter?.instagram || targetFooter?.insta_link || targetControl?.instagram_link;
  const instagramLink = rawInsta ? (rawInsta.startsWith('http') ? rawInsta : `https://${rawInsta}`) : '';

  const rawYt = targetFooter?.youtube_link || targetFooter?.youtube || targetControl?.youtube_url || targetControl?.youtube;
  const youtubeLink = rawYt ? (rawYt.startsWith('http') ? rawYt : `https://${rawYt}`) : '';

  // Update document favicons, apple touch icon, og:site_name, titles, and meta images dynamically from API
  useEffect(() => {
    const updateMetaContent = (id, propertyOrName, isProperty, val) => {
      if (!val) return;
      const attr = isProperty ? 'property' : 'name';
      let el = document.getElementById(id) || document.querySelector(`meta[${attr}='${propertyOrName}']`);
      if (el) {
        el.setAttribute('content', val);
      } else {
        el = document.createElement('meta');
        if (id) el.id = id;
        el.setAttribute(attr, propertyOrName);
        el.setAttribute('content', val);
        document.head.appendChild(el);
      }
    };

    if (shopName) {
      try {
        localStorage.setItem('sds_shop_name', shopName);
      } catch (e) {}

      updateMetaContent('app-og-site-name', 'og:site_name', true, shopName);
      updateMetaContent('app-apple-title', 'apple-mobile-web-app-title', false, shopName);
      updateMetaContent('app-og-title', 'og:title', true, `${shopName} | Sivakasi Direct Store`);
      updateMetaContent('app-twitter-title', 'twitter:title', false, `${shopName} | Sivakasi Direct Store`);
    }

    if (shopAddress) {
      try {
        localStorage.setItem('sds_shop_address', shopAddress);
      } catch (e) {}

      updateMetaContent('app-geo-placename', 'geo.placename', false, shopAddress);
    }

    if (logoUrl) {
      try {
        localStorage.setItem('sds_logo_url', logoUrl);
      } catch (e) {}

      const updateLinkHref = (id, rel, url) => {
        let el = document.getElementById(id) || document.querySelector(`link[rel='${rel}']`);
        if (el) {
          el.href = url;
        } else {
          el = document.createElement('link');
          if (id) el.id = id;
          el.rel = rel;
          el.href = url;
          document.head.appendChild(el);
        }
      };

      updateLinkHref('app-favicon', 'icon', logoUrl);
      updateLinkHref('app-shortcut-icon', 'shortcut icon', logoUrl);
      updateLinkHref('app-apple-icon', 'apple-touch-icon', logoUrl);

      updateMetaContent('app-og-image', 'og:image', true, logoUrl);
      updateMetaContent('app-twitter-image', 'twitter:image', false, logoUrl);
    }

    // Dynamic JSON-LD Schema updating for AEO and GEO engines
    const schemaEl = document.getElementById('app-jsonld-schema');
    if (schemaEl) {
      try {
        const schemaObj = {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": "https://offer360.in/#organization",
              "name": shopName ? `${shopName} Technology & Direct Outlet` : "Pattaz Technology & SDS Crackers Sivakasi",
              "alternateName": ["Pattaz.com", shopName || "SDS Crackers Direct", "Pattaz Fireworks E-Commerce & POS Platform"],
              "url": "https://offer360.in/",
              "logo": logoUrl || "https://offer360.in/logo.png",
              "description": description || "Leading B2B E-Commerce, POS, Live Billing and Direct Factory Store Platform for Sivakasi Green Fireworks Vendors and Retail Buyers.",
              "sameAs": [
                "https://pattaz.com",
                "https://shivacrackers.pattaz.com",
                facebookLink || "https://facebook.com/sdscrackers",
                instagramLink || "https://instagram.com/sdscrackers"
              ].filter(Boolean),
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": phone ? `+91${phone}` : "+919876262799",
                "contactType": "customer service",
                "areaServed": "IN",
                "availableLanguage": ["English", "Tamil"]
              }
            },
            {
              "@type": "WebApplication",
              "@id": "https://offer360.in/#software",
              "name": "Pattaz Sivakasi Fireworks Billing & E-Commerce Platform",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "All Web Browsers, iOS, Android (PWA)",
              "description": "WhatsApp-native ordering system, live inventory tracking, POS billing software, and branded online store creator for Sivakasi wholesale fireworks vendors.",
              "author": {
                "@type": "Organization",
                "name": "Pattaz Software Solutions"
              },
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "INR"
              }
            },
            {
              "@type": "Store",
              "@id": "https://offer360.in/#store",
              "name": shopName ? `${shopName} Direct Store` : "SDS Crackers Sivakasi Direct Store",
              "alternateName": "Sivakasi Green Fireworks Direct Factory Outlet",
              "url": "https://offer360.in/",
              "logo": logoUrl || "https://offer360.in/logo.png",
              "image": logoUrl || "https://offer360.in/logo.png",
              "description": description || "Buy 100% genuine CSIR-NEERI certified green crackers, sparklers, flower pots, rockets, and festival combo packs online directly from Sivakasi factory store.",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": shopAddress || "Factory Main Road",
                "addressLocality": "Sivakasi",
                "addressRegion": "Tamil Nadu",
                "postalCode": "626123",
                "addressCountry": "IN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 9.4533,
                "longitude": 77.7997
              },
              "hasMap": "https://maps.google.com/?q=Sivakasi+Tamil+Nadu",
              "priceRange": "₹₹",
              "currenciesAccepted": "INR",
              "paymentAccepted": "Cash, UPI, GPay, PhonePe, Net Banking",
              "telephone": phone ? `+91${phone}` : "+919876262799",
              "email": email || "shivacrackers@gmail.com"
            },
            {
              "@type": "Person",
              "@id": "https://offer360.in/#author",
              "name": "Sivakasi Fireworks Compliance & E-Commerce Expert",
              "jobTitle": "Lead Compliance & Technical Director",
              "worksFor": {
                "@id": "https://offer360.in/#organization"
              },
              "knowsAbout": [
                "CSIR-NEERI Green Crackers Certification",
                "Sivakasi Fireworks Wholesale E-Commerce",
                "PESO Safety Regulations",
                "WhatsApp-Native POS & Billing Software"
              ]
            },
            {
              "@type": "FAQPage",
              "@id": "https://offer360.in/#faq",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": `What is Pattaz.com and how does it power ${shopName || 'Sivakasi fireworks'} e-commerce?`,
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `Pattaz.com is a specialized B2B E-Commerce, POS live billing, and WhatsApp-native ordering platform designed for ${shopName || 'Sivakasi wholesale fireworks vendors'} to manage catalog stock, legal compliance, and online sales.`
                  }
                },
                {
                  "@type": "Question",
                  "name": `How to buy genuine ${shopName || 'Sivakasi'} green crackers online?`,
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `Order 100% genuine CSIR-NEERI certified green crackers online directly from ${shopName || 'SDS Crackers'} Sivakasi factory store with discounts and express shipping.`
                  }
                },
                {
                  "@type": "Question",
                  "name": `How can Sivakasi fireworks businesses create branded websites to boost Diwali cracker sales?`,
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `Sivakasi fireworks businesses can launch branded online stores using Pattaz.com platform with integrated WhatsApp ordering, live stock sync, PWA mobile support, and automated price calculation.`
                  }
                },
                {
                  "@type": "Question",
                  "name": `How do WhatsApp-native stores work for wholesale fireworks vendors looking to streamline orders?`,
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `WhatsApp-native stores allow customers to select green cracker combos, generate instant estimate slips, and send direct order receipts to vendor WhatsApp numbers for fast order confirmation.`
                  }
                },
                {
                  "@type": "Question",
                  "name": `What compliance requirements should an online platform meet to legally sell wholesale fireworks in India?`,
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `Platforms must ensure all fireworks are 100% CSIR-NEERI green crackers, adhere to PESO safety guidelines, display factory license credentials, and utilize SSL-encrypted payment processing.`
                  }
                },
                {
                  "@type": "Question",
                  "name": `Is ${shopName || 'Pattaz'} a reliable e-commerce platform for Sivakasi fireworks vendors in terms of compliance and payment gateway alternatives?`,
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `Yes, ${shopName || 'Pattaz'} provides 100% compliant e-commerce infrastructure supporting UPI, GPay, Net Banking, and direct WhatsApp order slips with zero downtime during peak Diwali sale periods.`
                  }
                }
              ]
            },
            {
              "@type": "HowTo",
              "@id": "https://offer360.in/#howto",
              "name": `How to Order Genuine Green Crackers Online Direct from ${shopName || 'Sivakasi'} Factory Store`,
              "description": "Step-by-step guide to purchasing CSIR-NEERI certified eco-friendly fireworks with express delivery.",
              "step": [
                {
                  "@type": "HowToStep",
                  "name": "Select Green Cracker Combos",
                  "text": "Browse sparklers, flower pots, rockets, and Diwali combo hampers certified by CSIR-NEERI."
                },
                {
                  "@type": "HowToStep",
                  "name": "Add to Cart & Verify Minimum Order",
                  "text": "Add selected items to cart and apply available seasonal promo coupons."
                },
                {
                  "@type": "HowToStep",
                  "name": "Choose Checkout Method",
                  "text": "Proceed to secure online payment (UPI/GPay/NetBanking) or instant WhatsApp order confirmation."
                },
                {
                  "@type": "HowToStep",
                  "name": "Track Express Delivery",
                  "text": "Receive live consignment tracking updates until doorstep delivery across Tamil Nadu, Bangalore, Hyderabad, Chennai, and India."
                }
              ]
            }
          ]
        };
        schemaEl.textContent = JSON.stringify(schemaObj, null, 2);
      } catch (e) {}
    }
  }, [logoUrl, shopName, shopAddress, phone, email, description, facebookLink, instagramLink]);

  return (
    <WebControlContext.Provider
      value={{
        webControl,
        footerData,
        loading,
        isYoutubeVisible,
        isCountdownVisible,
        isOnlineSalesEnabled,
        rawYoutubeUrl,
        youtubeEmbedUrl,
        shopName,
        shopNameTa,
        logoUrl,
        shopAddress,
        shopAddressTa,
        phone,
        whatsapp,
        email,
        description,
        descriptionTa,
        copyrightNotice,
        facebookLink,
        instagramLink,
        youtubeLink,
        formattedWhatsapp,
        formattedPhone
      }}
    >
      {children}
    </WebControlContext.Provider>
  );
};

export const useWebControl = () => {
  const context = useContext(WebControlContext);
  if (!context) {
    return {
      webControl: null,
      footerData: null,
      loading: false,
      isYoutubeVisible: false,
      isCountdownVisible: false,
      isOnlineSalesEnabled: true,
      rawYoutubeUrl: '',
      youtubeEmbedUrl: '',
      shopName: '',
      logoUrl: '',
      shopAddress: '',
      phone: '',
      whatsapp: '',
      formattedWhatsapp: '917010922428',
      formattedPhone: '917010922428',
      email: '',
      description: '',
      copyrightNotice: '',
      facebookLink: '',
      instagramLink: '',
      youtubeLink: ''
    };
  }
  return context;
};
