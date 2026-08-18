/**
 * Safely extracts the complete `shopDomain` from `window.location.hostname`.
 * 
 * Examples:
 * - shivacrackers.pattaz.com:5173  => "shivacrackers.pattaz.com"
 * - qcrackers.pattaz.com           => "qcrackers.pattaz.com"
 * - www.shivacrackers.pattaz.com   => "shivacrackers.pattaz.com" (strips leading www.)
 * - localhost:5173                => fallbackShopDomain ("shivacrackers.pattaz.com")
 * - 127.0.0.1                     => fallbackShopDomain or ?shopDomain=... override
 * 
 * @param {Object} options Configuration options
 * @param {string} [options.fallbackShopDomain='shivacrackers.pattaz.com'] Default fallback domain for localhost/IPs
 * @param {boolean} [options.stripWww=true] Strips 'www.' prefix if present
 * @param {boolean} [options.allowQueryOverride=true] Allows ?shopDomain=... override in dev
 * @returns {string} The resolved full shopDomain
 */
export function getShopDomain(options = {}) {
  const {
    fallbackShopDomain = (import.meta.env && import.meta.env.VITE_DEFAULT_SHOP_DOMAIN) || 'shivacrackers.pattaz.com',
    stripWww = true,
    allowQueryOverride = true
  } = options;

  // 1. Server-Side Rendering (SSR) safety check
  if (typeof window === 'undefined' || !window.location) {
    return fallbackShopDomain;
  }

  // 2. Local development override via URL query param (e.g. http://localhost:5173/?shopDomain=qcrackers.pattaz.com)
  if (allowQueryOverride) {
    const urlParams = new URLSearchParams(window.location.search);
    const queryDomain = urlParams.get('shopDomain') || urlParams.get('domain');
    if (queryDomain && queryDomain.trim()) {
      return queryDomain.trim().toLowerCase();
    }
  }

  // 3. Clean hostname (strip port number if present)
  let hostname = window.location.hostname.toLowerCase().split(':')[0];

  // 4. Handle IPv4, IPv6, and exact 'localhost'
  const isIPv4 = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);
  const isIPv6 = hostname === '::1' || hostname.startsWith('[');
  if (isIPv4 || isIPv6 || hostname === 'localhost') {
    return fallbackShopDomain;
  }

  // 5. Strip leading 'www.' if present
  if (stripWww && hostname.startsWith('www.')) {
    hostname = hostname.slice(4);
  }

  return hostname || fallbackShopDomain;
}
