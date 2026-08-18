import { API_CONFIG } from '../config/api.config';
import { translateCategoriesToTamil } from './translationService';
import { apiCache } from '../utils/apiCache';

const extractArray = (json) => {
  if (!json) return [];
  if (Array.isArray(json)) return json;
  if (Array.isArray(json.data)) return json.data;
  if (json.data && Array.isArray(json.data.data)) return json.data.data;
  return [];
};

const getCategoryIcon = (name = '') => {
  const n = name.toUpperCase();
  if (n.includes('SPARKLER')) return 'Sparkles';
  if (n.includes('ELECTRIC')) return 'Zap';
  if (n.includes('BIJILI')) return 'Sparkles';
  if (n.includes('BOMB')) return 'Flame';
  if (n.includes('TWINKLING') || n.includes('STAR')) return 'Star';
  if (n.includes('CHAKKAR')) return 'Sparkles';
  if (n.includes('ROCKET')) return 'Rocket';
  if (n.includes('SKY SHOTS') || n.includes('MULTICOLOUR') || n.includes('MULTI')) return 'Sparkles';
  if (n.includes('SOUND') || n.includes('FLASH')) return 'Bell';
  if (n.includes('NIGHT')) return 'Moon';
  if (n.includes('MATCHES') || n.includes('COLOUR')) return 'Flame';
  return 'Sparkles';
};

/**
 * Transforms raw API category object into clean standard schema
 */
export const transformApiCategory = (item) => {
  const nameClean = (item.name || '').trim();
  return {
    id: String(item.id),
    rawId: item.id,
    adminId: item.admin_id,
    name: nameClean || `Category ${item.id}`,
    nameTa: nameClean || `பிரிவு ${item.id}`,
    icon: getCategoryIcon(nameClean),
    image: item.images || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800',
    itemCount: 'Live Sivakasi Crackers',
    description: `${nameClean || 'Festive'} crackers direct from Sivakasi factory.`,
    descriptionTa: `${nameClean || 'பட்டாசு'} சிவகாசி தொழிற்சாலை நேரடி வெடி ரகங்கள்.`,
    badge: 'Live API'
  };
};

/**
 * Fetch all categories from API endpoint GET /getcategory
 */
export const getCategories = async () => {
  return apiCache.getOrFetch('categories_all', async () => {
    const isDev = import.meta.env.DEV || (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'));
    const endpoint = API_CONFIG.ENDPOINTS.GET_CATEGORY;

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
          headers: API_CONFIG.HEADERS
        });
        const contentType = response.headers.get('content-type') || '';
        if (response.ok && contentType.includes('application/json')) {
          const json = await response.json();
          const items = extractArray(json);
          if (items.length > 0) {
            const transformed = items.map(transformApiCategory);
            return await translateCategoriesToTamil(transformed);
          }
        }
      } catch (err) {
        console.warn(`Fetch for categories failed at ${url}:`, err);
      }
    }

    return [];
  });
};
