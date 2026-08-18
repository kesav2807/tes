import { API_CONFIG } from '../config/api.config';
import { translateProductsToTamil, translateFooterToTamil } from './translationService';
import { apiCache } from '../utils/apiCache';

const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800';

const extractArray = (json) => {
  if (!json) return [];
  if (Array.isArray(json)) return json;
  if (Array.isArray(json.data)) return json.data;
  if (json.data && Array.isArray(json.data.data)) return json.data.data;
  return [];
};

/**
 * Transforms raw API product objects into standard product schema for UI
 */
export const transformApiProduct = (item) => {
  if (!item) return null;
  const targetItem = item.product || item.cracker || item;

  const originalPrice = Number(targetItem.original_price || targetItem.price || targetItem.mrp || targetItem.discount_price || 0);
  const price = Number(targetItem.discount_price || targetItem.offer_price || targetItem.price || targetItem.original_price || 0);
  let discount = Number(targetItem.discount || targetItem.discount_percentage || targetItem.offer_percentage || 0);
  if (!discount && originalPrice > price && originalPrice > 0) {
    discount = Math.round(((originalPrice - price) / originalPrice) * 100);
  }

  const rawImages = (targetItem.product_images && Array.isArray(targetItem.product_images)) ? targetItem.product_images : [];

  // Separate image files from video (.mp4) files
  const imageMedia = rawImages
    .filter(m => m.media_type === 'image' || (m.images && !m.images.toLowerCase().endsWith('.mp4')))
    .map(m => m.images)
    .filter(Boolean);

  if (imageMedia.length === 0 && targetItem.image) {
    imageMedia.push(targetItem.image);
  }

  const videoMedia = rawImages
    .filter(m => m.media_type === 'video' || (m.images && m.images.toLowerCase().endsWith('.mp4')))
    .map(m => m.images)
    .filter(Boolean);

  const primaryImage = imageMedia.length > 0 ? imageMedia[0] : DEFAULT_FALLBACK_IMAGE;
  const productImages = imageMedia.length > 0 ? imageMedia : [primaryImage];

  const productCode = String(
    targetItem.code ||
    targetItem.product_code ||
    targetItem.cracker_code ||
    targetItem.item_code ||
    targetItem.code_no ||
    targetItem.product_no ||
    targetItem.sku ||
    `#${targetItem.id}`
  );

  const rawStockCount = targetItem.stock_count !== undefined && targetItem.stock_count !== null
    ? targetItem.stock_count
    : (targetItem.quantity !== undefined && targetItem.quantity !== null
      ? targetItem.quantity
      : (typeof targetItem.stock === 'number' ? targetItem.stock : null));

  const stockCount = rawStockCount !== null && rawStockCount !== undefined ? Number(rawStockCount) : null;

  const inStock = (targetItem.is_active === false || targetItem.is_active === 0 || targetItem.in_stock === false || targetItem.in_stock === 0 || targetItem.stock === false || targetItem.stock === 0)
    ? false
    : (stockCount !== null ? stockCount > 0 : true);

  const catId = String(targetItem.category_id || targetItem.categoryId || '');

  return {
    id: String(targetItem.id),
    rawId: targetItem.id,
    adminId: targetItem.admin_id,
    code: productCode,
    productCode: productCode,
    categoryId: catId,
    category: catId || 'all',
    categoryName: targetItem.category_name || targetItem.categoryName || targetItem.type || 'Sivakasi Cracker',
    categoryNameTa: targetItem.category_name || targetItem.categoryName || targetItem.type || 'சிவகாசி பட்டாசு',
    name: targetItem.name || `Cracker #${targetItem.id}`,
    nameTa: targetItem.name || `பட்டாசு #${targetItem.id}`,
    packQuantity: targetItem.pack_quantity || '',
    height: targetItem.height || '',
    type: targetItem.type || 'Green Cracker Certified',
    price: price,
    originalPrice: originalPrice,
    discount: discount,
    rating: 4.8,
    reviewsCount: 36,
    inStock: inStock,
    stockCount: stockCount,
    isFeatured: true,
    isBestseller: false,
    image: primaryImage,
    productImages: productImages,
    productVideos: videoMedia,
    description: targetItem.description || targetItem.name || 'High-quality festive green cracker for celebrations direct from Sivakasi.',
    descriptionTa: targetItem.description || targetItem.name || 'பண்டிகை கொண்டாட்டங்களுக்கான சிறந்த தரமான சிவகாசி பட்டாசு.',
    safetyTips: 'Hold at arm length away from clothes. Dispose burnt items safely in water container.',
    safetyTipsTa: 'ஆடைகளிலிருந்து தள்ளி கையை நீட்டி பிடிக்கவும். பயன்பாட்டிற்குப் பின் தண்ணீரில் போடவும்.',
    specifications: {
      packContent: targetItem.pack_quantity || '1 Pcs',
      height: targetItem.height || 'Standard',
      type: targetItem.type || 'Green Cracker Certified'
    }
  };
};

/**
 * Resilient multi-endpoint fetch strategy to eliminate CORS preflight errors
 */
const fetchWithProxy = async (endpoint, query = '') => {
  const isDev = import.meta.env.DEV || (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'));

  const urlsToTry = isDev ? [
    `/fireworks/crackers${endpoint}${query}`,
    `${API_CONFIG.PROXY_URL}${endpoint}${query}`
  ] : [
    `${API_CONFIG.PROXY_URL}${endpoint}${query}`,
    `/fireworks/crackers${endpoint}${query}`,
    `${API_CONFIG.BASE_URL}${endpoint}${query}`
  ];

  for (const url of Array.from(new Set(urlsToTry))) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: API_CONFIG.HEADERS,
      });
      const contentType = response.headers.get('content-type') || '';
      if (response.ok && contentType.includes('application/json')) {
        return await response.json();
      }
    } catch (err) {
      console.warn(`Fetch error for ${url}:`, err);
    }
  }

  return null;
};

/**
 * Fetch all products from GET /getproducts
 */
export const getProducts = async () => {
  return apiCache.getOrFetch('products_all', async () => {
    try {
      const json = await fetchWithProxy(API_CONFIG.ENDPOINTS.GET_PRODUCTS);
      const items = extractArray(json);
      if (items.length > 0) {
        const transformed = items.map(transformApiProduct);
        return await translateProductsToTamil(transformed);
      }
      return [];
    } catch (error) {
      console.warn('Failed to fetch products from API:', error);
      return [];
    }
  });
};

/**
 * Fetch products filtered by category_id from GET /getproducts?category_id={categoryId}
 */
export const getProductsByCategory = async (categoryId) => {
  if (!categoryId || categoryId === 'all') {
    return getProducts();
  }

  return apiCache.getOrFetch(`products_cat_${categoryId}`, async () => {
    try {
      const query = `?category_id=${encodeURIComponent(categoryId)}`;
      const json = await fetchWithProxy(API_CONFIG.ENDPOINTS.GET_PRODUCTS, query);
      const items = extractArray(json);
      if (items.length > 0) {
        return items.map(transformApiProduct);
      }
    } catch (error) {
      console.warn(`Failed to fetch category ${categoryId} products from API:`, error);
    }

    // Filter client-side from all API products
    const allProducts = await getProducts();
    return allProducts.filter(p => 
      String(p.category) === String(categoryId) || 
      String(p.categoryId) === String(categoryId) ||
      (p.categoryName && p.categoryName.toLowerCase() === String(categoryId).toLowerCase())
    );
  });
};

/**
 * Fetch a single product by ID (handles both numeric API IDs like 2 and slug IDs like prod-2)
 */
export const getProductById = async (id) => {
  const cleanId = String(id).replace(/^prod-/, '').replace(/^combo-/, '');

  try {
    const [allProducts, comboPacks] = await Promise.all([
      getProducts().catch(() => []),
      getComboPacks().catch(() => [])
    ]);

    const combined = [...comboPacks, ...allProducts];
    const found = combined.find(p => 
      String(p.id) === String(id) || 
      String(p.rawId) === String(id) || 
      String(p.id) === cleanId || 
      String(p.rawId) === cleanId || 
      p.id === `prod-${id}` ||
      p.id === `prod-${cleanId}` ||
      p.id === `combo-${id}` ||
      p.id === `combo-${cleanId}`
    );
    if (found) return found;
  } catch (err) {
    console.warn(`Failed to fetch product ${id} from API:`, err);
  }

  return null;
};

/**
 * Transform raw API reel object
 */
export const transformApiReel = (raw) => {
  const prod = raw.product ? transformApiProduct(raw.product) : null;
  const prodImage = prod?.image || (raw.product?.product_images?.[0]?.images) || DEFAULT_FALLBACK_IMAGE;

  const rawUrl = raw.url || '';
  const isVideo = rawUrl.toLowerCase().includes('.mp4') || rawUrl.toLowerCase().includes('.webm');
  const isInsta = rawUrl.toLowerCase().includes('instagram.com');
  const isYt = rawUrl.toLowerCase().includes('youtube.com') || rawUrl.toLowerCase().includes('youtu.be');

  return {
    id: raw.id,
    rawId: raw.id,
    title: raw.name || prod?.name || `Reel #${raw.id}`,
    name: raw.name || prod?.name || `Reel #${raw.id}`,
    url: rawUrl,
    videoUrl: isVideo ? rawUrl : null,
    youtubeUrl: isYt ? rawUrl : null,
    instagramUrl: isInsta ? rawUrl : null,
    productId: raw.product_id || prod?.id,
    product: prod,
    image: prodImage,
    likes: '1.2K',
    views: '15.4K',
    position: raw.position || 1
  };
};

/**
 * Fetch all reels from GET /getreels
 */
export const getReels = async () => {
  return apiCache.getOrFetch('reels_all', async () => {
    try {
      const json = await fetchWithProxy(API_CONFIG.ENDPOINTS.GET_REELS);
      const items = extractArray(json);
      if (items.length > 0) {
        return items.map(transformApiReel);
      }
      return [];
    } catch (error) {
      console.warn('Failed to fetch reels from API:', error);
      return [];
    }
  });
};

/**
 * Fetch all offers from GET /getoffers
 */
export const getOffers = async () => {
  return apiCache.getOrFetch('offers_all', async () => {
    try {
      const json = await fetchWithProxy(API_CONFIG.ENDPOINTS.GET_OFFERS);
      const items = extractArray(json);
      if (items.length > 0) {
        const transformed = items.map(item => transformApiProduct(item)).filter(Boolean);
        return await translateProductsToTamil(transformed);
      }
      return [];
    } catch (error) {
      console.warn('Failed to fetch offers from API:', error);
      return [];
    }
  });
};

/**
 * Fetch footer details from GET /getfooter
 */
export const getFooter = async () => {
  try {
    const json = await fetchWithProxy(API_CONFIG.ENDPOINTS.GET_FOOTER);
    if (!json) return null;
    const rawData = json.data || json;
    return await translateFooterToTamil(rawData);
  } catch (error) {
    console.warn('Failed to fetch footer data from API:', error);
    return null;
  }
};

/**
 * Transforms raw API combo pack objects into standard product schema for UI
 */
export const transformApiComboPack = (item) => {
  if (!item) return null;

  const rawProducts = Array.isArray(item.products) ? item.products : [];

  const allImages = [];
  const allVideos = [];

  const parsedProducts = rawProducts.map(p => {
    const subProd = p.product || {};
    const rawImgs = Array.isArray(subProd.product_images) ? subProd.product_images : [];

    const imgMedia = rawImgs
      .filter(m => m.media_type === 'image' || (m.images && !m.images.toLowerCase().endsWith('.mp4')))
      .map(m => m.images)
      .filter(Boolean);

    const vidMedia = rawImgs
      .filter(m => m.media_type === 'video' || (m.images && m.images.toLowerCase().endsWith('.mp4')))
      .map(m => m.images)
      .filter(Boolean);

    imgMedia.forEach(img => {
      if (!allImages.includes(img)) allImages.push(img);
    });
    vidMedia.forEach(vid => {
      if (!allVideos.includes(vid)) allVideos.push(vid);
    });

    const firstImg = imgMedia.length > 0 ? imgMedia[0] : (subProd.image || DEFAULT_FALLBACK_IMAGE);

    return {
      id: String(p.product_id || subProd.id || p.combo_pack_product_id),
      name: p.product_name || subProd.name || 'Cracker Item',
      quantity: Number(p.quantity || 1),
      originalPrice: Number(p.product_original_price || subProd.original_price || 0),
      discountPrice: Number(p.product_discount_price || subProd.discount_price || 0),
      packQuantity: subProd.pack_quantity || '',
      height: subProd.height || '',
      type: subProd.type || 'Green Cracker',
      description: subProd.description || p.product_name || '',
      image: firstImg,
      images: imgMedia.length > 0 ? imgMedia : [firstImg]
    };
  });

  const primaryImage = allImages.length > 0 ? allImages[0] : (item.image || DEFAULT_FALLBACK_IMAGE);
  const productImages = allImages.length > 0 ? allImages : [primaryImage];

  const price = Number(item.combo_price || item.discount_total || item.price || 0);

  const calcOriginalTotal = parsedProducts.reduce((sum, p) => sum + (p.originalPrice * p.quantity), 0);
  let originalPrice = Number(item.original_total || 0);
  if (originalPrice <= 0) {
    originalPrice = calcOriginalTotal;
  }
  if (originalPrice <= price && price > 0) {
    originalPrice = Math.round(price * 1.4);
  }

  let discount = Number(item.discount || item.discount_percentage || 0);
  if (!discount && originalPrice > price && originalPrice > 0) {
    discount = Math.round(((originalPrice - price) / originalPrice) * 100);
  }

  const totalItemPcs = parsedProducts.reduce((sum, p) => sum + p.quantity, 0);
  const productTypesCount = parsedProducts.length;

  const productSummaryStr = parsedProducts.map(p => `${p.quantity}x ${p.name}`).join(' + ');

  const comboCode = String(
    item.code ||
    item.combo_code ||
    item.product_code ||
    item.item_code ||
    `COMBO-${item.id}`
  );

  const rawComboStockCount = item.stock_count !== undefined && item.stock_count !== null
    ? item.stock_count
    : (typeof item.stock === 'number' ? item.stock : null);

  const stockCount = rawComboStockCount !== null && rawComboStockCount !== undefined ? Number(rawComboStockCount) : null;

  const inStock = (item.is_active !== undefined)
    ? (String(item.is_active) === '1' || item.is_active === true) && (stockCount === null || stockCount > 0)
    : (stockCount !== null ? stockCount > 0 : true);

  return {
    id: `combo-${item.id}`,
    rawId: item.id,
    isCombo: true,
    code: comboCode,
    productCode: comboCode,
    categoryId: 'combo-packs',
    category: 'combo-packs',
    categoryName: 'Combo Pack',
    categoryNameTa: 'காம்போ பேக்',
    name: item.name || `Festival Combo Pack #${item.id}`,
    nameTa: item.name || `பண்டிகை காம்போ பேக் #${item.id}`,
    packQuantity: productTypesCount > 0 ? `${productTypesCount} Products (${totalItemPcs} Pcs)` : 'Full Combo Box',
    height: 'Standard Box',
    type: 'Green Combo Pack Certified',
    price: price,
    originalPrice: originalPrice,
    discount: discount > 0 ? discount : 25,
    rating: 4.9,
    reviewsCount: 52,
    inStock: inStock,
    stockCount: stockCount,
    isFeatured: true,
    isBestseller: true,
    image: primaryImage,
    productImages: productImages,
    productVideos: allVideos,
    description: item.description 
      ? `${item.description}. Contains ${totalItemPcs} pieces across ${productTypesCount} varieties: ${productSummaryStr}` 
      : `Complete festive combo pack containing ${totalItemPcs} pieces (${productSummaryStr}).`,
    descriptionTa: item.description || `பட்டாசு காம்போ பேக்: ${productSummaryStr}`,
    comboProducts: parsedProducts,
    safetyTips: 'Hold at arm length away from clothes. Dispose burnt items safely in water container.',
    safetyTipsTa: 'ஆடைகளிலிருந்து தள்ளி கையை நீட்டி பிடிக்கவும். பயன்பாட்டிற்குப் பின் தண்ணீரில் போடவும்.',
    specifications: {
      packContent: `${productTypesCount} Varieties (${totalItemPcs} Total Items)`,
      height: 'Standard Festive Box',
      type: 'Green Combo Certified'
    }
  };
};

/**
 * Fetch combo packs from GET /getcombo-packs API
 */
export const getComboPacks = async () => {
  return apiCache.getOrFetch('combo_packs_all', async () => {
    try {
      const json = await fetchWithProxy(API_CONFIG.ENDPOINTS.GET_COMBO_PACKS);
      const items = extractArray(json);
      if (items.length > 0) {
        const transformed = items.map(item => transformApiComboPack(item)).filter(Boolean);
        return await translateProductsToTamil(transformed);
      }
      return [];
    } catch (error) {
      console.warn('Failed to fetch combo packs from API:', error);
      return [];
    }
  });
};

/**
 * Converts standard YouTube URLs into embeddable URLs
 */
export const formatYouTubeEmbedUrl = (url) => {
  if (!url) return '';
  let cleanUrl = String(url).trim();
  if (cleanUrl.includes('youtube.com/embed/') || cleanUrl.includes('youtube-nocookie.com/embed/')) {
    return cleanUrl;
  }
  const match = cleanUrl.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/|m\.youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
  if (match && match[1]) {
    return `https://www.youtube-nocookie.com/embed/${match[1]}?autoplay=0&rel=0`;
  }
  return cleanUrl;
};

/**
 * Fetch web control settings from GET /get-web-control API
 */
export const getWebControl = async () => {
  try {
    const json = await fetchWithProxy(API_CONFIG.ENDPOINTS.GET_WEB_CONTROL);
    if (!json) return null;
    if (json.data) return json.data;
    return json;
  } catch (error) {
    console.warn('Failed to fetch web control settings from API:', error);
    return null;
  }
};



