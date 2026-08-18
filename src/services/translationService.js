/**
 * Client-Side Tamil Translation Service
 * 
 * Provides domain-specific translation for fireworks & crackers vocabulary,
 * backed by MyMemory translation API fallback for arbitrary English strings,
 * with localStorage caching for high performance.
 */

// Fireworks and Festive Domain Dictionary (English -> Tamil)
const DICTIONARY = {
  // Cracker Types
  'sparkler': 'கம்பி மத்தாப்பு',
  'sparklers': 'கம்பி மத்தாப்பு',
  'electric sparklers': 'எலக்ட்ரிக் கம்பி மத்தாப்பு',
  'green sparklers': 'பச்சை கம்பி மத்தாப்பு',
  'red sparklers': 'சிவப்பு கம்பி மத்தாப்பு',
  'color sparklers': 'வர்ண கம்பி மத்தாப்பு',
  'colour sparklers': 'வர்ண கம்பி மத்தாப்பு',
  'flower pot': 'பூச்சட்டி',
  'flower pots': 'பூச்சட்டி',
  'flowerpot': 'பூச்சட்டி',
  'deluxe flower pots': 'டீலக்ஸ் பூச்சட்டி',
  'jumbo flower pots': 'ஜம்போ பூச்சட்டி',
  'color flower pots': 'வர்ண பூச்சட்டி',
  'ground chakkar': 'தரை சக்கரம்',
  'ground chakkars': 'தரை சக்கரம்',
  'chakkar': 'தரை சக்கரம்',
  'chakkars': 'தரை சக்கரம்',
  'wheel': 'சக்கரம்',
  'wheels': 'சக்கரம்',
  'spinners': 'சுழல் சக்கரம்',
  'spinner': 'சுழல் சக்கரம்',
  'rocket': 'ராக்கெட்',
  'rockets': 'ராக்கெட்',
  'bomb': 'வெடி',
  'bombs': 'வெடி',
  'atom bomb': 'ஆட்டம் பாம்',
  'hydro bomb': 'ஹைட்ரோ பாம்',
  'king bomb': 'கிங் பாம்',
  'garland': 'சரவெடி',
  'garlands': 'சரவெடி',
  'wala': 'சரவெடி',
  'wallah': 'சரவெடி',
  '1000 wala': '1000 சரவெடி',
  '5000 wala': '5000 சரவெடி',
  '10000 wala': '10000 சரவெடி',
  '100 wala': '100 சரவெடி',
  'fountain': 'பவுண்டன் ஃபாண்டசி வர்ணம்',
  'fountains': 'பவுண்டன் ஃபாண்டசி வர்ணம்',
  'single shot': 'சிங்கிள் ஷாட் வான்வெடி',
  'multi shot': 'மல்டி ஷாட் வான்வெடி',
  'multishot': 'மல்டி ஷாட் வான்வெடி',
  'sky shot': 'வான்வெடி',
  'skyshot': 'வான்வெடி',
  'twinkling star': 'ட்விங்க்ளிங் ஸ்டார்',
  'twinkling stars': 'ட்விங்க்ளிங் ஸ்டார்',
  'pencil': 'பென்சில் மத்தாப்பு',
  'pencils': 'பென்சில் மத்தாப்பு',
  'snake egg': 'பாம்பு மாத்திரை',
  'roll cap': 'ரோல் கேப்',
  'ring cap': 'ரிங் கேப்',
  'dot cap': 'டாட் கேப்',
  'gift box': 'பண்டிகை கிஃப்ட் பாக்ஸ்',
  'giftbox': 'பண்டிகை கிஃப்ட் பாக்ஸ்',
  'combo pack': 'பட்டாசு காம்போ பேக்',
  'combo': 'காம்போ பேக்',
  'fancy': 'ஃபேன்ஸி',
  'deluxe': 'டீலக்ஸ்',
  'sound': 'சப்த வெடி',
  'light': 'ஒளி வர்ணம்',
  'green cracker': 'பசுமை பட்டாசு',
  'green crackers': 'பசுமை பட்டாசு',
  'crackers': 'பட்டாசுகள்',
  'cracker': 'பட்டாசு',
  'fireworks': 'பட்டாசுகள்',
  'sivakasi': 'சிவகாசி',
  'peacock': 'மயில் பவுண்டன்',
  'mini': 'மினி',
  'mega': 'மெகா',
  'super': 'சூப்பர்',
  'special': 'ஸ்பெஷல்',
  'classic': 'கிளாசிக்',
  'royal': 'ராயல்',
  'golden': 'தங்கம்',
  'silver': 'வெள்ளி',
  'red': 'சிவப்பு',
  'green': 'பச்சை',
  'blue': 'நீலம்',
  'yellow': 'மஞ்சள்',
  'multi color': 'பல்வேறு வர்ணங்கள்',
  'multicolor': 'பல்வேறு வர்ணங்கள்'
};

// Memory Cache to prevent duplicate calls
const memoryCache = new Map();

/**
 * Translates an English text to Tamil.
 * Uses dictionary matching first, then falls back to MyMemory Translation API.
 * 
 * @param {string} text English string to translate
 * @returns {Promise<string>} Translated Tamil text
 */
export async function translateTextToTamil(text) {
  if (!text || typeof text !== 'string' || !text.trim()) {
    return text || '';
  }

  const cleanText = text.trim();

  // If text is already containing Tamil characters, return directly
  if (/[\u0B80-\u0BFF]/.test(cleanText)) {
    return cleanText;
  }

  const cacheKey = cleanText.toLowerCase();

  // 1. Check in-memory cache
  if (memoryCache.has(cacheKey)) {
    return memoryCache.get(cacheKey);
  }

  // 2. Check localStorage cache
  try {
    const storageKey = `sds_tr_ta_${btoa(unescape(encodeURIComponent(cacheKey))).slice(0, 32)}`;
    const cached = localStorage.getItem(storageKey);
    if (cached) {
      memoryCache.set(cacheKey, cached);
      return cached;
    }
  } catch (e) {}

  // 3. Check exact dictionary match
  if (DICTIONARY[cacheKey]) {
    const translated = DICTIONARY[cacheKey];
    cacheResult(cacheKey, translated);
    return translated;
  }

  // 4. Try word-by-word token dictionary translation for product titles (e.g. "Deluxe Flower Pots 10 Pcs")
  let translatedWords = cleanText;
  let wordMatchesCount = 0;

  // Sort dictionary keys by length (longest phrase first) to avoid partial replacements
  const sortedDictKeys = Object.keys(DICTIONARY).sort((a, b) => b.length - a.length);
  let tempLower = cacheKey;

  for (const phrase of sortedDictKeys) {
    if (tempLower.includes(phrase)) {
      const regex = new RegExp(`\\b${phrase}\\b`, 'gi');
      if (regex.test(translatedWords)) {
        translatedWords = translatedWords.replace(regex, DICTIONARY[phrase]);
        wordMatchesCount++;
      }
    }
  }

  // If dictionary covered phrase words, return phrase replacement
  if (wordMatchesCount > 0 && translatedWords !== cleanText) {
    cacheResult(cacheKey, translatedWords);
    return translatedWords;
  }

  // 5. Fallback to free MyMemory API for long descriptions or unknown titles
  try {
    const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(cleanText)}&langpair=en|ta`;
    const res = await fetch(apiUrl);
    if (res.ok) {
      const data = await res.json();
      if (data && data.responseData && data.responseData.translatedText) {
        const apiTranslation = data.responseData.translatedText.trim();
        // Ignore invalid / errored responses from API
        if (apiTranslation && !apiTranslation.startsWith('QUERY LENGTH LIMIT') && !apiTranslation.includes('MYMEMORY WARNING')) {
          cacheResult(cacheKey, apiTranslation);
          return apiTranslation;
        }
      }
    }
  } catch (err) {
    console.warn('Translation API fallback network warning:', err);
  }

  // Fallback: return translatedWords or cleanText if API fails
  cacheResult(cacheKey, translatedWords);
  return translatedWords;
}

/**
 * Helper to translate products array after API fetch
 */
export async function translateProductsToTamil(products) {
  if (!Array.isArray(products) || products.length === 0) {
    return products || [];
  }

  return await Promise.all(
    products.map(async (product) => {
      try {
        const [nameTa, descriptionTa, categoryNameTa] = await Promise.all([
          translateTextToTamil(product.name),
          translateTextToTamil(product.description),
          translateTextToTamil(product.categoryName)
        ]);

        return {
          ...product,
          nameTa: nameTa || product.nameTa || product.name,
          descriptionTa: descriptionTa || product.descriptionTa || product.description,
          categoryNameTa: categoryNameTa || product.categoryNameTa || product.categoryName
        };
      } catch (err) {
        return product;
      }
    })
  );
}

/**
 * Helper to translate categories array after API fetch
 */
export async function translateCategoriesToTamil(categories) {
  if (!Array.isArray(categories)) return categories;
  return await Promise.all(
    categories.map(async (cat) => {
      try {
        const [nameTa, descriptionTa] = await Promise.all([
          translateTextToTamil(cat.name),
          translateTextToTamil(cat.description)
        ]);
        return {
          ...cat,
          nameTa: nameTa || cat.nameTa || cat.name,
          descriptionTa: descriptionTa || cat.descriptionTa || cat.description
        };
      } catch (err) {
        return cat;
      }
    })
  );
}

/**
 * Helper to translate coupons array after API fetch
 */
export async function translateCouponsToTamil(coupons) {
  if (!Array.isArray(coupons)) return coupons;
  return await Promise.all(
    coupons.map(async (coupon) => {
      try {
        const cleanTitle = coupon.title ? coupon.title.trim() : '';
        const [titleTa, taglineTa, descriptionTa] = await Promise.all([
          translateTextToTamil(cleanTitle),
          translateTextToTamil(coupon.tagline),
          translateTextToTamil(coupon.description)
        ]);
        return {
          ...coupon,
          titleTa: titleTa || coupon.titleTa,
          taglineTa: taglineTa || coupon.taglineTa,
          descriptionTa: descriptionTa || coupon.descriptionTa
        };
      } catch (err) {
        return coupon;
      }
    })
  );
}

/**
 * Helper to translate offers array after API fetch
 */
export async function translateOffersToTamil(offers) {
  if (!Array.isArray(offers)) return offers;
  return await Promise.all(
    offers.map(async (offer) => {
      try {
        const [titleTa, descriptionTa] = await Promise.all([
          translateTextToTamil(offer.title || offer.name),
          translateTextToTamil(offer.description)
        ]);
        return {
          ...offer,
          titleTa: titleTa || offer.titleTa || offer.title,
          descriptionTa: descriptionTa || offer.descriptionTa || offer.description
        };
      } catch (err) {
        return offer;
      }
    })
  );
}

/**
 * Helper to translate footer data object/array after API fetch
 */
export async function translateFooterToTamil(footerData) {
  if (!footerData) return footerData;
  const isArray = Array.isArray(footerData);
  const items = isArray ? footerData : [footerData];
  
  const translated = await Promise.all(
    items.map(async (item) => {
      if (!item) return item;
      try {
        const [shopNameTa, shopAddressTa, descriptionTa] = await Promise.all([
          translateTextToTamil(item.shop_name || item.store_name),
          translateTextToTamil(item.shop_address || item.address),
          translateTextToTamil(item.description || item.footer_text)
        ]);
        return {
          ...item,
          shopNameTa: shopNameTa || item.shopNameTa || item.shop_name,
          shopAddressTa: shopAddressTa || item.shopAddressTa || item.shop_address,
          descriptionTa: descriptionTa || item.descriptionTa || item.description
        };
      } catch (err) {
        return item;
      }
    })
  );
  
  return isArray ? translated : translated[0];
}

function cacheResult(key, value) {
  memoryCache.set(key, value);
  try {
    const storageKey = `sds_tr_ta_${btoa(unescape(encodeURIComponent(key))).slice(0, 32)}`;
    localStorage.setItem(storageKey, value);
  } catch (e) {}
}
