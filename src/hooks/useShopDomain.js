import { useState, useEffect } from 'react';
import { getShopDomain } from '../utils/subdomain';

/**
 * React custom hook to dynamically obtain the active full shopDomain.
 * 
 * @param {Object} [options] Configuration options passed to getShopDomain
 * @returns {string} The active shopDomain (e.g. shivacrackers.pattaz.com)
 */
export function useShopDomain(options) {
  const [shopDomain, setShopDomain] = useState(() => getShopDomain(options));

  useEffect(() => {
    const currentDomain = getShopDomain(options);
    if (currentDomain !== shopDomain) {
      setShopDomain(currentDomain);
    }
  }, [options]);

  return shopDomain;
}

export default useShopDomain;
