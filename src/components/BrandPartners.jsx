import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Award, ShieldCheck } from 'lucide-react';

export const BrandPartners = () => {
  const { language } = useLanguage();

  const brands = [
    {
      id: 'standard',
      name: 'Standard Fireworks Sivakasi',
      logo: 'https://stdfireworks.in/images/logo.png',
      fallbackSvg: (
        <svg width="145" height="44" viewBox="0 0 170 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Peacock Feather Crest Ring */}
          <circle cx="36" cy="30" r="18" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />
          <path d="M36 16C34 19 33 22 33 25C33 28 35 30 36 33C37 30 39 28 39 25C39 22 38 19 36 16Z" fill="#0284c7" />
          <circle cx="36" cy="24" r="3" fill="#f59e0b" />
          {/* Brand Typography */}
          <text x="64" y="28" fontSize="13" fontWeight="900" fill="#dc2626" letterSpacing="0.8" fontFamily="Arial, sans-serif">STANDARD</text>
          <text x="64" y="42" fontSize="9.5" fontWeight="800" fill="#0284c7" letterSpacing="0.5" fontFamily="Arial, sans-serif">FIREWORKS</text>
          <text x="64" y="52" fontSize="6" fontWeight="800" fill="#64748b" letterSpacing="0.4" fontFamily="sans-serif">ESTD. SIVAKASI • INDIA</text>
        </svg>
      )
    },
    {
      id: 'cock-brand',
      name: 'Cock Brand - Sri Kaliswari Fireworks',
      logo: 'https://www.kaliswari-fireworks.com/img/logo2.png',
      fallbackSvg: (
        <svg width="145" height="44" viewBox="0 0 170 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Rooster Badge Oval */}
          <ellipse cx="36" cy="30" rx="19" ry="19" fill="#fff1f2" stroke="#d90429" strokeWidth="2" />
          <path d="M36 15C33 18 31 22 32 26C30 27 28 29 29 32C31 36 35 38 39 37C42 36 43 32 42 29C40 25 38 20 36 15Z" fill="#d90429" />
          <path d="M33 16C34 14 36 12 38 13C39 15 37 17 35 18Z" fill="#f59e0b" />
          {/* Brand Typography */}
          <text x="64" y="27" fontSize="13" fontWeight="900" fill="#d90429" letterSpacing="0.5" fontFamily="Arial, sans-serif">COCK BRAND</text>
          <text x="64" y="41" fontSize="8.5" fontWeight="800" fill="#800f2f" letterSpacing="0.4" fontFamily="Arial, sans-serif">SRI KALISWARI FIREWORKS</text>
          <text x="64" y="51" fontSize="6" fontWeight="800" fill="#64748b" letterSpacing="0.4" fontFamily="sans-serif">SIVAKASI ORIGINAL</text>
        </svg>
      )
    },
    {
      id: 'sony',
      name: 'Sony Fireworks Sivakasi',
      logo: 'https://www.sonnyvinayagashop.com/wp-content/uploads/2018/08/sony-logo-1.png',
      fallbackSvg: (
        <svg width="145" height="44" viewBox="0 0 170 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Red Golden Box Badge */}
          <rect x="15" y="12" width="140" height="36" rx="8" fill="url(#sonyGrad)" stroke="#f59e0b" strokeWidth="1.8" />
          <defs>
            <linearGradient id="sonyGrad" x1="0" y1="0" x2="170" y2="60">
              <stop offset="0%" stopColor="#99001c" />
              <stop offset="100%" stopColor="#d90429" />
            </linearGradient>
          </defs>
          <text x="85" y="36" fontSize="19" fontWeight="900" fill="#f59e0b" textAnchor="middle" letterSpacing="2" fontFamily="Impact, Arial Black, sans-serif">SONY</text>
          <text x="85" y="54" fontSize="6.5" fontWeight="800" fill="#475569" textAnchor="middle" letterSpacing="0.6" fontFamily="sans-serif">FIREWORKS SIVAKASI</text>
        </svg>
      )
    },
    {
      id: 'ayyan',
      name: 'Ayyan Fireworks Sivakasi',
      logo: 'https://ayyanfireworks.in/images/ayyans-logo.png',
      fallbackSvg: (
        <svg width="145" height="44" viewBox="0 0 170 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Shield Emblem */}
          <path d="M36 14L49 19V32C49 40 36 46 36 46C36 46 23 40 23 32V19L36 14Z" fill="#15803d" stroke="#f59e0b" strokeWidth="1.8" />
          <path d="M36 20L39 27H46L40 31L42 38L36 34L30 38L32 31L26 27H33L36 20Z" fill="#f59e0b" />
          {/* Typography */}
          <text x="58" y="28" fontSize="14" fontWeight="900" fill="#15803d" letterSpacing="0.8" fontFamily="Arial, sans-serif">AYYAN</text>
          <text x="58" y="42" fontSize="9" fontWeight="800" fill="#047857" letterSpacing="0.4" fontFamily="Arial, sans-serif">FIREWORKS</text>
          <text x="58" y="52" fontSize="6" fontWeight="800" fill="#64748b" letterSpacing="0.4" fontFamily="sans-serif">SIVAKASI DIRECT</text>
        </svg>
      )
    },
    {
      id: 'sri-krishna',
      name: 'Sri Krishna Fireworks',
      logo: (
        <svg width="145" height="44" viewBox="0 0 170 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Crest Badge */}
          <circle cx="34" cy="30" r="18" fill="#1e1b4b" stroke="#f59e0b" strokeWidth="1.8" />
          <path d="M34 16C37 20 39 23 37 27C35 31 31 33 34 39C34 39 37 32 39 29C41 26 40 20 34 16Z" fill="#38bdf8" />
          <circle cx="34" cy="24" r="3" fill="#f59e0b" />
          {/* Typography */}
          <text x="58" y="27" fontSize="11" fontWeight="900" fill="#1e1b4b" letterSpacing="0.4" fontFamily="Arial, sans-serif">SRI KRISHNA</text>
          <text x="58" y="41" fontSize="9" fontWeight="800" fill="#4338ca" letterSpacing="0.4" fontFamily="Arial, sans-serif">FIREWORKS</text>
          <text x="58" y="51" fontSize="6" fontWeight="800" fill="#64748b" letterSpacing="0.4" fontFamily="sans-serif">PREMIUM SIVAKASI</text>
        </svg>
      )
    },
    {
      id: 'starvell',
      name: 'Star Vell / Vadivel Fireworks',
      logo: 'https://www.starvellfireworks.com/images/starvelllogo.png',
      fallbackSvg: (
        <svg width="145" height="44" viewBox="0 0 170 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M36 12L40 24H52L42 31L46 43L36 35L26 43L30 31L20 24H32L36 12Z" fill="#ea580c" stroke="#f59e0b" strokeWidth="1.5" />
          <text x="60" y="27" fontSize="13" fontWeight="900" fill="#cb0b29" letterSpacing="0.5" fontFamily="Arial, sans-serif">STAR VELL</text>
          <text x="60" y="41" fontSize="8.5" fontWeight="800" fill="#c2410c" letterSpacing="0.4" fontFamily="Arial, sans-serif">FIREWORKS SIVAKASI</text>
          <text x="60" y="51" fontSize="6" fontWeight="800" fill="#64748b" letterSpacing="0.4" fontFamily="sans-serif">CERTIFIED FACTORY</text>
        </svg>
      )
    },
    {
      id: 'wowstar',
      name: 'Wow Star Fireworks',
      logo: (
        <svg width="145" height="44" viewBox="0 0 170 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="20" y="14" width="130" height="32" rx="16" fill="#cb0b29" />
          <rect x="22" y="16" width="126" height="28" rx="14" fill="none" stroke="#ffc107" strokeWidth="1.5" />
          <text x="85" y="35" fontSize="14" fontWeight="900" fontStyle="italic" fill="#ffffff" textAnchor="middle" fontFamily="Arial Black, sans-serif">WOW STAR</text>
          <text x="85" y="54" fontSize="6.5" fontWeight="800" fill="#475569" textAnchor="middle" letterSpacing="0.4" fontFamily="sans-serif">FIREWORKS SIVAKASI</text>
        </svg>
      )
    },
    {
      id: 'muthu',
      name: 'Muthu Fireworks',
      logo: (
        <svg width="145" height="44" viewBox="0 0 170 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="34" cy="30" r="18" fill="#fdf497" stroke="#b45309" strokeWidth="2" />
          <circle cx="34" cy="30" r="12" fill="#d97706" />
          <text x="34" y="34" fontSize="11" fontWeight="900" fill="#ffffff" textAnchor="middle">M</text>
          <text x="58" y="27" fontSize="13" fontWeight="900" fill="#b45309" letterSpacing="0.5" fontFamily="Arial, sans-serif">MUTHU</text>
          <text x="58" y="41" fontSize="8.5" fontWeight="800" fill="#d97706" letterSpacing="0.4" fontFamily="Arial, sans-serif">FIREWORKS SIVAKASI</text>
          <text x="58" y="51" fontSize="6" fontWeight="800" fill="#64748b" letterSpacing="0.4" fontFamily="sans-serif">NEERI GREEN CRACKERS</text>
        </svg>
      )
    },
    {
      id: 'ohm-muruga',
      name: 'Ohm Muruga Crackers Sivakasi',
      logo: 'https://ohmmurugacrackers.com/images/ohm_muruga_crackers.png',
      fallbackSvg: (
        <svg width="145" height="44" viewBox="0 0 170 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="34" cy="30" r="18" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
          <path d="M34 16L37 25H44L38 29L40 37L34 33L28 37L30 29L24 25H31L34 16Z" fill="#d97706" />
          <text x="58" y="27" fontSize="13" fontWeight="900" fill="#b45309" letterSpacing="0.5" fontFamily="Arial, sans-serif">OHM MURUGA</text>
          <text x="58" y="41" fontSize="8.5" fontWeight="800" fill="#d97706" letterSpacing="0.4" fontFamily="Arial, sans-serif">CRACKERS SIVAKASI</text>
          <text x="58" y="51" fontSize="6" fontWeight="800" fill="#64748b" letterSpacing="0.4" fontFamily="sans-serif">FACTORY DIRECT</text>
        </svg>
      )
    },
    {
      id: 'ananda',
      name: 'Ananda Fireworks Sivakasi',
      logo: 'https://www.anandafireworks.in/ananda/logo.png',
      fallbackSvg: (
        <svg width="145" height="44" viewBox="0 0 170 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="34" cy="30" r="18" fill="#fee2e2" stroke="#dc2626" strokeWidth="2" />
          <path d="M34 15C36 19 38 22 36 26C34 30 30 32 33 38C33 38 36 31 38 28C40 25 39 19 34 15Z" fill="#dc2626" />
          <text x="58" y="27" fontSize="13" fontWeight="900" fill="#dc2626" letterSpacing="0.5" fontFamily="Arial, sans-serif">ANANDA</text>
          <text x="58" y="41" fontSize="8.5" fontWeight="800" fill="#991b1b" letterSpacing="0.4" fontFamily="Arial, sans-serif">FIREWORKS SIVAKASI</text>
          <text x="58" y="51" fontSize="6" fontWeight="800" fill="#64748b" letterSpacing="0.4" fontFamily="sans-serif">ESTD. SIVAKASI</text>
        </svg>
      )
    },
    {
      id: 'sree-kalis',
      name: "Sree Kaliswari Fireworks Sivakasi",
      logo: 'https://assetv2.iar.net.in/trial606.iar.net.in/16_7_2024/AeqF8aH/Frame402211.png',
      fallbackSvg: (
        <svg width="145" height="44" viewBox="0 0 170 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="34" cy="30" r="18" fill="#fce7f3" stroke="#be185d" strokeWidth="2" />
          <text x="34" y="35" fontSize="13" fontWeight="900" fill="#be185d" textAnchor="middle">SK</text>
          <text x="58" y="27" fontSize="13" fontWeight="900" fill="#be185d" letterSpacing="0.5" fontFamily="Arial, sans-serif">SREE KALISWARI</text>
          <text x="58" y="41" fontSize="8.5" fontWeight="800" fill="#9d174d" letterSpacing="0.4" fontFamily="Arial, sans-serif">FIREWORKS SIVAKASI</text>
          <text x="58" y="51" fontSize="6" fontWeight="800" fill="#64748b" letterSpacing="0.4" fontFamily="sans-serif">SIVAKASI AUTHENTIC</text>
        </svg>
      )
    },
    {
      id: 'supreme-brand',
      name: "Supreme Fireworks Sivakasi",
      logo: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=375,fit=crop,q=95/AoPvzgaLx9HwNy4v/logo-final-cropped-A0x1W2oZPNIbk1e8.png',
      fallbackSvg: (
        <svg width="145" height="44" viewBox="0 0 170 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="34" cy="30" r="18" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
          <text x="34" y="35" fontSize="13" fontWeight="900" fill="#d97706" textAnchor="middle">SF</text>
          <text x="58" y="27" fontSize="13" fontWeight="900" fill="#b45309" letterSpacing="0.5" fontFamily="Arial, sans-serif">SUPREME</text>
          <text x="58" y="41" fontSize="8.5" fontWeight="800" fill="#d97706" letterSpacing="0.4" fontFamily="Arial, sans-serif">FIREWORKS SIVAKASI</text>
          <text x="58" y="51" fontSize="6" fontWeight="800" fill="#64748b" letterSpacing="0.4" fontFamily="sans-serif">ESTD. SIVAKASI</text>
        </svg>
      )
    }
  ];

  return (
    <section className="brand-partners-section">
      <div className="container">
        <div className="brand-partners-header">
          <div className="brand-partners-badge">
            <Award size={14} color="var(--crimson-red)" />
            <span>{language === 'ta' ? 'அங்கீகரிக்கப்பட்ட சிவகாசி பிராண்டுகள்' : 'DIRECT SIVAKASI MANUFACTURERS'}</span>
          </div>
          <h2 className="brand-partners-title">
            {language === 'ta'
              ? 'பிரபலமான அசல் சிவகாசி பட்டாசு பிராண்டுகள்'
              : 'Authorized Brand Partners & Sivakasi Manufacturers'}
          </h2>
          <p className="brand-partners-sub">
            {language === 'ta'
              ? 'தரமான மற்றும் பாதுகாப்பான 100% பசுமைப் பட்டாசு பிராண்டுகள் நேரடியாக தொழிற்சாலை விலையில்!'
              : '100% Genuine, NEERI Certified Green Crackers sourced directly from Sivakasi top factories.'}
          </p>
        </div>

        {/* Infinite Ticker Marquee Row */}
        <div className="brand-marquee-container">
          <div className="brand-marquee-track">
            {/* Repeat list twice for seamless 360 loop */}
            {[...brands, ...brands].map((brand, idx) => (
              <div key={`${brand.id}-${idx}`} className="brand-logo-card" title={brand.name}>
                {typeof brand.logo === 'string' ? (
                  <>
                    <img 
                      src={brand.logo} 
                      alt={brand.name} 
                      loading="lazy"
                      decoding="async"
                      style={{ maxHeight: '36px', maxWidth: '135px', objectFit: 'contain' }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        if (e.target.nextSibling) {
                          e.target.nextSibling.style.display = 'block';
                        }
                      }}
                    />
                    {brand.fallbackSvg && (
                      <div style={{ display: 'none' }}>
                        {brand.fallbackSvg}
                      </div>
                    )}
                  </>
                ) : (
                  brand.logo
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sub-bar showing 100% NEERI Certified Green Crackers Guarantee */}
        <div 
          style={{ 
            marginTop: '1.25rem', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '0.5rem', 
            background: '#f0fdf4', 
            border: '1.5px solid #bbf7d0', 
            borderRadius: '9999px', 
            padding: '0.4rem 1rem', 
            maxWidth: '540px', 
            margin: '1.25rem auto 0',
            boxShadow: '0 2px 8px rgba(22, 163, 74, 0.08)' 
          }}
        >
          <ShieldCheck size={16} color="#16a34a" />
          <span style={{ color: '#15803d', fontWeight: 800, fontSize: '0.78rem' }}>
            {language === 'ta'
              ? '100% அசல் சிவகாசி தொழிற்சாலை பசுமைப் பட்டாசுகள் உத்தரவாதம்!'
              : '100% Authentic Direct Sivakasi Factory Green Crackers Certified!'}
          </span>
        </div>
      </div>
    </section>
  );
};
