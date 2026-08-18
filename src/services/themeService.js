import { API_CONFIG } from '../config/api.config';

const extractArray = (json) => {
  if (!json) return [];
  if (Array.isArray(json)) return json;
  if (Array.isArray(json.data)) return json.data;
  if (json.data && Array.isArray(json.data.data)) return json.data.data;
  if (json.data && typeof json.data === 'object') return [json.data];
  if (typeof json === 'object' && json.id) return [json];
  return [];
};

/**
 * Converts server path like /var/www/html/uploads_crackers/themes/...
 * to public web image URL: https://offer360.in/uploads_crackers/themes/...
 */
export const fixImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.includes('/uploads_crackers/')) {
    const idx = url.indexOf('/uploads_crackers/');
    return `${API_CONFIG.DOMAIN}${url.substring(idx)}`;
  }
  if (url.startsWith('/')) {
    return `${API_CONFIG.DOMAIN}${url}`;
  }
  return url;
};

/**
 * Transforms raw API theme object into clean standard theme schema
 */
export const transformApiTheme = (item) => {
  if (!item) return null;
  const homeBg = fixImageUrl(item.home_background_url || item.home_bg_url);
  const videoBg = fixImageUrl(item.video_player_background_url || item.video_bg_url);

  return {
    id: item.id,
    theme_name: item.theme_name || item.name || item.title || 'Diwali Special',
    name: item.theme_name || item.name || item.title || 'Diwali Special',
    title: item.title || '',
    description: item.description || '',
    primary_color: item.primary_color || item.primaryColor || item.primary || '#FFC107',
    secondary_color: item.secondary_color || item.secondaryColor || item.secondary || '#FF5722',
    text_color: item.text_color || item.textColor || item.color_text || item.text_color_code || '#212121',
    background_color: item.background_color || item.bgColor || '#ffffff',
    home_bg_url: homeBg,
    video_bg_url: videoBg,
    home_background_url: homeBg,
    video_player_background_url: videoBg,
    banner_text: item.banner_text || '',
    hero_title: item.hero_title || '',
    hero_subtitle: item.hero_subtitle || '',
    created_at: item.created_at,
    updated_at: item.updated_at,
  };
};

/**
 * Fetch theme settings from API endpoint GET /getthemes
 */
export const getThemes = async () => {
  const isDev = import.meta.env.DEV || (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'));
  const endpoint = API_CONFIG.ENDPOINTS.GET_THEMES;

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
          return items.map(transformApiTheme).filter(Boolean);
        }
      }
    } catch (err) {
      console.warn(`Fetch for themes failed at ${url}:`, err);
    }
  }

  return [];
};
