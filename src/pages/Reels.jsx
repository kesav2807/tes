import React, { useState, useEffect, useRef } from 'react';
import { getProducts, getReels } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { ShoppingCart, Heart, Share2, Play, Flame, Sparkles, Minus, Plus, Volume2, VolumeX, ChevronUp, ChevronDown, CheckCircle, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LazyImage } from '../components/LazyImage';

const getInstagramId = (reel) => {
  if (!reel) return null;
  if (reel.instagramId) return reel.instagramId;
  const url = reel.instagramUrl || reel.url || '';
  const match = url.match(/(?:instagram\.com\/(?:reel|p)\/)([A-Za-z0-9_-]+)/);
  return match ? match[1] : null;
};

const getYouTubeId = (reel) => {
  if (!reel) return null;
  if (reel.youtubeId) return reel.youtubeId;
  const url = reel.youtubeUrl || reel.url || '';
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
  return match ? match[1] : null;
};

export const Reels = () => {
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);
  const [viewMode, setViewMode] = useState('player'); // 'player' or 'grid'
  const [likedReels, setLikedReels] = useState({});
  const [isMuted, setIsMuted] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 1024);
  const [productsList, setProductsList] = useState([]);
  const [reelsList, setReelsList] = useState([]);
  const [loadingReels, setLoadingReels] = useState(true);

  const { cartItems, addToCart, updateQuantity, showNotification } = useCart();
  const { t, getText, language } = useLanguage();
  const { videoBgUrl } = useTheme();

  const defaultVideoBg = `${import.meta.env.BASE_URL}img/mp4.jpg`;
  const [bgVideoImage, setBgVideoImage] = useState(defaultVideoBg);

  useEffect(() => {
    if (videoBgUrl) {
      const img = new Image();
      img.src = videoBgUrl;
      img.onload = () => setBgVideoImage(videoBgUrl);
      img.onerror = () => setBgVideoImage(defaultVideoBg);
    } else {
      setBgVideoImage(defaultVideoBg);
    }
  }, [videoBgUrl, defaultVideoBg]);

  const reelsBgStyle = {
    backgroundImage: `linear-gradient(135deg, rgba(15, 23, 42, 0.88), rgba(15, 23, 42, 0.92)), url("${bgVideoImage}")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  };

  useEffect(() => {
    Promise.all([getReels(), getProducts()])
      .then(([reelsData, prodsData]) => {
        if (Array.isArray(reelsData)) setReelsList(reelsData);
        if (Array.isArray(prodsData)) setProductsList(prodsData);
      })
      .catch(err => {
        console.warn('Failed loading reels or products API:', err);
      })
      .finally(() => {
        setLoadingReels(false);
      });
  }, []);

  const slideRefs = useRef([]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // IntersectionObserver for Native Scroll Snap Mobile View
  useEffect(() => {
    if (!isMobile) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            if (!isNaN(index)) {
              setActiveMobileIndex(index);
              setActiveReelIndex(index);
            }
          }
        });
      },
      { threshold: 0.6 }
    );

    slideRefs.current.forEach((slide) => {
      if (slide) observer.observe(slide);
    });

    return () => observer.disconnect();
  }, [isMobile]);

  // Load Instagram Embed script when switching reels
  useEffect(() => {
    if (window.instgrm && window.instgrm.Embeds) {
      window.instgrm.Embeds.process();
    } else {
      const script = document.createElement('script');
      script.src = '//www.instagram.com/embed.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, [activeReelIndex, activeMobileIndex, viewMode]);

  const currentReel = reelsList[activeReelIndex] || reelsList[0];
  const featuredProduct = currentReel?.product || productsList.find(p => String(p.id) === String(currentReel?.productId) || String(p.rawId) === String(currentReel?.productId)) || productsList[0] || {};
  const cartItem = featuredProduct?.id ? cartItems?.find(item => String(item.id) === String(featuredProduct.id)) : null;

  const handleNextReel = () => {
    if (reelsList.length === 0) return;
    setActiveReelIndex(prev => (prev + 1) % reelsList.length);
  };

  const handlePrevReel = () => {
    if (reelsList.length === 0) return;
    setActiveReelIndex(prev => (prev - 1 + reelsList.length) % reelsList.length);
  };

  const toggleLike = (reelId) => {
    setLikedReels(prev => ({
      ...prev,
      [reelId]: !prev[reelId]
    }));
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
    showNotification(isMuted ? 'Sound Unmuted' : 'Sound Muted', 'info');
  };

  const handleShare = (reel) => {
    const instaId = getInstagramId(reel);
    const ytId = getYouTubeId(reel);
    const shareUrl = instaId
      ? `https://www.instagram.com/reel/${instaId}/`
      : `https://youtube.com/shorts/${ytId || ''}`;

    if (navigator.share) {
      navigator.share({
        title: getText(reel, 'title'),
        url: shareUrl
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      showNotification('Reel link copied to clipboard!', 'info');
    }
  };

  const renderReelIframe = (reel, isMobileView) => {
    if (!reel) {
      return (
        <div className="reel-poster-placeholder" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>
          <span>Loading video...</span>
        </div>
      );
    }

    const instaId = getInstagramId(reel);
    const ytId = getYouTubeId(reel);
    const titleText = getText(reel, 'title');

    // 1. Direct HTML5 Video Support (If videoUrl is provided)
    if (reel.videoUrl) {
      return (
        <video
          key={`video-${reel.id}`}
          src={reel.videoUrl}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          controls={false}
          className={isMobileView ? "insta-full-iframe" : "reel-embed-iframe"}
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
        />
      );
    }

    // 2. Instagram Reel Embed Support
    if (instaId) {
      return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          <iframe
            key={`${isMobileView ? 'mobile' : 'desktop'}-insta-${instaId}`}
            src={`https://www.instagram.com/reel/${instaId}/embed/captioned/`}
            title={titleText}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            frameBorder="0"
            className={isMobileView ? "insta-full-iframe" : "reel-embed-iframe"}
            style={{ border: 'none', width: '100%', height: '100%', overflow: 'hidden' }}
          />
          <a
            href={`https://www.instagram.com/reel/${instaId}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="insta-direct-watch-btn"
          >
            <Instagram size={14} /> Watch Reel ↗
          </a>
        </div>
      );
    }

    // 3. YouTube Embed Support
    if (ytId) {
      return (
        <iframe
          key={`${isMobileView ? 'mobile' : 'desktop'}-yt-${ytId}-${isMuted ? 'muted' : 'unmuted'}`}
          src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=${isMobileView ? 0 : 1}&loop=1&playlist=${ytId}`}
          title={titleText}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className={isMobileView ? "insta-full-iframe" : "reel-embed-iframe"}
        />
      );
    }

    return (
      <div className="reel-poster-placeholder">
        <LazyImage src={reel.image} alt={titleText} className="reel-poster-img" style={{ width: '100%', height: '100%' }} />
      </div>
    );
  };

  if (loadingReels) {
    return (
      <div className="reels-page-master-wrapper" style={{ ...reelsBgStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '2rem 1rem' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <div className="skeleton-shimmer" style={{ width: '100%', height: '580px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }} />
        </div>
      </div>
    );
  }

  if (!loadingReels && reelsList.length === 0) {
    return (
      <div className="reels-page-master-wrapper" style={{ ...reelsBgStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <div style={{ textAlign: 'center', color: '#ffffff', background: 'rgba(15, 23, 42, 0.85)', padding: '2.5rem 2rem', borderRadius: '24px', border: '1px solid #334155', maxWidth: '480px' }}>
          <Flame size={48} color="var(--crimson-red)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontWeight: 900, fontSize: '1.4rem', margin: '0 0 0.5rem 0' }}>{language === 'ta' ? 'வீடியோக்கள் ஏதும் இல்லை' : 'No Live Reels Available'}</h3>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem', lineHeight: 1.5 }}>
            {language === 'ta' ? 'தற்போது வீடியோக்கள் எதுவும் கிடைக்கவில்லை. பிறகு மீண்டும் முயற்சிக்கவும்.' : 'There are currently no active reels to display. Please check back later.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="reels-page-master-wrapper" style={reelsBgStyle}>
      {/* ========================================================================= */}
      {/* 1. SEPARATE MOBILE INSTAGRAM REELS UI WITH NATIVE CSS VERTICAL SCROLL SNAP */}
      {/* ========================================================================= */}
      {isMobile ? (
        <div className="insta-mobile-snap-wrapper">
          {reelsList.map((reel, index) => {
            const prod = reel.product || productsList.find(p => String(p.id) === String(reel.productId) || String(p.rawId) === String(reel.productId)) || productsList[0] || {};
            const itemInCart = prod?.id ? cartItems?.find(item => String(item.id) === String(prod.id)) : null;
            const isSlideActive = index === activeMobileIndex;

            return (
              <div
                key={reel.id}
                data-index={index}
                ref={(el) => (slideRefs.current[index] = el)}
                className="insta-mobile-reel-slide"
              >
                {/* Fullscreen Video Player Box */}
                <div className="insta-video-container">
                  {isSlideActive ? (
                    renderReelIframe(reel, true)
                  ) : (
                    <div className="reel-poster-placeholder">
                      <LazyImage src={reel.image} alt={getText(reel, 'title')} className="reel-poster-img" style={{ width: '100%', height: '100%' }} />
                      <div className="reel-play-center-btn">
                        <Play size={28} fill="#ffffff" color="#ffffff" />
                      </div>
                    </div>
                  )}
                  {/* Transparent Touch Layer for Smooth Scroll */}
                  <div className="insta-touch-overlay-pass" />
                </div>

                {/* Right Floating Actions (Sound, Like, Share) */}
                <div className="insta-side-bar">
                  <button className="insta-icon-btn" onClick={toggleMute} title="Toggle Sound">
                    {!isMuted ? <Volume2 size={26} color="#25D366" /> : <VolumeX size={26} color="#ff3366" />}
                    <span className="btn-count">{!isMuted ? 'Sound ON' : 'Muted'}</span>
                  </button>

                  <button
                    className={`insta-icon-btn ${likedReels[reel.id] ? 'liked' : ''}`}
                    onClick={() => toggleLike(reel.id)}
                  >
                    <Heart size={28} fill={likedReels[reel.id] ? '#ff3366' : 'none'} color={likedReels[reel.id] ? '#ff3366' : '#ffffff'} />
                    <span className="btn-count">{likedReels[reel.id] ? '12.5K' : reel.likes}</span>
                  </button>

                  <button className="insta-icon-btn" onClick={() => handleShare(reel)}>
                    <Share2 size={26} color="#ffffff" />
                    <span className="btn-count">{t('share', 'Share')}</span>
                  </button>
                </div>

                {/* Bottom Details Overlay (Account Handle + Caption + Product Bar) */}
                <div className="insta-bottom-bar">
                  {/* Account Row */}
                  <div className="insta-account-line">
                    <div className="insta-avatar-ring">
                      <span>SDS</span>
                    </div>
                    <span className="insta-handle">@sds_crackers</span>
                    <CheckCircle size={14} color="#38bdf8" fill="#38bdf8" />
                    <span className="insta-verified-tag">Official Store</span>
                  </div>

                  {/* Reel Caption */}
                  <p className="insta-caption-text">{getText(reel, 'title')}</p>

                  {/* Featured Product Pill Bar */}
                  <div className="insta-product-card-pill">
                    <div className="insta-prod-left-box">
                      <LazyImage src={prod.image} alt={getText(prod, 'name')} className="insta-prod-img" style={{ width: '38px', height: '38px' }} />
                      <div className="insta-prod-text-group">
                        <span className="insta-prod-title">{getText(prod, 'name')}</span>
                        <div className="insta-prod-price-line">
                          <span className="insta-prod-price">₹{prod.price}</span>
                          {prod.originalPrice > prod.price && (
                            <span className="insta-prod-mrp">₹{prod.originalPrice}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="insta-prod-right-box">
                      {itemInCart ? (
                        <div className="quantity-pill-selector insta-cart-pill">
                          <button
                            className="quantity-pill-btn"
                            onClick={() => updateQuantity(prod.id, -1)}
                            aria-label="Decrease quantity"
                          >
                            <Minus size={15} />
                          </button>
                          <span className="quantity-pill-value">{itemInCart.quantity}</span>
                          <button
                            className="quantity-pill-btn"
                            onClick={() => updateQuantity(prod.id, 1)}
                            aria-label="Increase quantity"
                          >
                            <Plus size={15} />
                          </button>
                        </div>
                      ) : (
                        <button className="btn-primary insta-add-cart-btn" onClick={() => addToCart(prod)}>
                          <ShoppingCart size={16} /> {t('addToCart', 'Add')}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ========================================================================= */
        /* 2. SEPARATE DESKTOP WEB VIEW UI (Active ONLY on Desktop >1024px)         */
        /* ========================================================================= */
        <div className="reels-page-light">
          <div className="container">
            {/* Light Hero Banner */}
            <div className="reels-hero-banner">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
                <div>
                  <div className="sparkle-badge" style={{ marginBottom: '0.65rem' }}>
                    <Flame size={14} />
                    <span>{language === 'ta' ? 'நேரடி பட்டாசு காட்சி' : 'Live Fireworks Showroom'}</span>
                  </div>
                  <h1 className="reels-hero-title">
                    {language === 'ta' ? 'SDS பட்டாசு வீடியோக்கள்' : 'SDS Crackers Live Reels'}
                  </h1>
                  <p className="reels-hero-subtitle">
                    {language === 'ta'
                      ? 'பட்டாசு வெடிக்கும் நேரடி காட்சிகளைப் பார்த்து உங்களுக்கு பிடித்த ரகங்களை உடனுக்குடன் ஆர்டர் செய்யுங்கள்!'
                      : 'Watch live crackers in action and order your favorite fireworks directly!'}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.85rem' }}>
                  <div style={{ background: '#ffffff', padding: '0.75rem 1.15rem', borderRadius: 'var(--radius-md)', border: '1.5px solid #fef08a', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                    <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--crimson-red)' }}>{reelsList.length}</div>
                    <div style={{ fontSize: '0.725rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase' }}>
                      {language === 'ta' ? 'வீடியோக்கள்' : 'Live Reels'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Header Controls Bar */}
            <div className="reels-header-bar">
              <div className="reels-header-title-box">
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={20} color="#d90429" />
                  {language === 'ta' ? 'அனைத்து வீடியோ பதிவுகள்' : 'Featured Video Demonstrations'}
                </h2>
              </div>

              <div className="reels-controls-group">
                <button
                  className={`sound-toggle-btn ${!isMuted ? 'unmuted' : ''}`}
                  onClick={toggleMute}
                  title={isMuted ? 'Click to Unmute' : 'Mute Sound'}
                >
                  {!isMuted ? <Volume2 size={18} color="#059669" /> : <VolumeX size={18} color="#d90429" />}
                  <span>{!isMuted ? 'Sound ON' : 'Muted'}</span>
                </button>

                <div className="reels-mode-switch">
                  <button
                    className={`mode-btn ${viewMode === 'player' ? 'active' : ''}`}
                    onClick={() => setViewMode('player')}
                  >
                    <Play size={16} /> {t('reelPlayer', 'Reels Feed')}
                  </button>
                  <button
                    className={`mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <Sparkles size={16} /> {t('allReels', 'All Reels')} ({reelsList.length})
                  </button>
                </div>
              </div>
            </div>

            {/* View Mode 1: Main Video Reel Player */}
            {viewMode === 'player' && (
              <div className="reels-main-layout">
                {/* Reel Thumbnails Selector Strip */}
                <div className="reels-thumbs-sidebar">
                  {reelsList.map((reel, index) => (
                    <div
                      key={reel.id}
                      className={`reel-thumb-item ${index === activeReelIndex ? 'active' : ''}`}
                      onClick={() => setActiveReelIndex(index)}
                    >
                      <LazyImage src={reel.image} alt={getText(reel, 'title')} style={{ width: '100%', height: '100%' }} />
                      <div className="reel-thumb-info">
                        <Play size={14} fill="#ffffff" color="#ffffff" />
                        <span>{reel.views}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Video Player Box */}
                <div className="reel-main-player-box">
                  <div className="reel-video-wrapper">
                    {renderReelIframe(currentReel, false)}
                  </div>

                  {/* Navigation Up/Down Chevrons */}
                  <div className="reel-nav-chevrons">
                    <button className="chevron-btn" onClick={handlePrevReel} title="Previous Reel">
                      <ChevronUp size={22} />
                    </button>
                    <button className="chevron-btn" onClick={handleNextReel} title="Next Reel">
                      <ChevronDown size={22} />
                    </button>
                  </div>

                  {/* Floating Side Action Buttons (Like & Share) */}
                  <div className="reel-floating-actions">
                    <button
                      className={`action-btn ${likedReels[currentReel.id] ? 'liked' : ''}`}
                      onClick={() => toggleLike(currentReel.id)}
                      title="Like Reel"
                    >
                      <Heart size={22} fill={likedReels[currentReel.id] ? '#e11d48' : 'none'} color={likedReels[currentReel.id] ? '#e11d48' : '#1e293b'} />
                      <span>{likedReels[currentReel.id] ? '12.5K' : currentReel.likes}</span>
                    </button>

                    <button className="action-btn" onClick={() => handleShare(currentReel)} title="Share Reel">
                      <Share2 size={22} color="#1e293b" />
                      <span>{t('share', 'Share')}</span>
                    </button>
                  </div>

                  {/* Bottom Featured Product Banner */}
                  <div className="reel-product-card">
                    <div className="prod-card-left">
                      <LazyImage src={featuredProduct.image} alt={getText(featuredProduct, 'name')} className="prod-card-thumb" style={{ width: '54px', height: '54px' }} />
                      <div className="prod-card-meta">
                        <span className="prod-card-category">{getText(featuredProduct, 'categoryName')}</span>
                        <Link to={`/product/${featuredProduct.id}`} className="prod-card-title">
                          {getText(featuredProduct, 'name')}
                        </Link>
                        <div className="prod-card-price-row">
                          <span className="prod-card-price">₹{featuredProduct.price}</span>
                          {featuredProduct.originalPrice > featuredProduct.price && (
                            <span className="prod-card-original">₹{featuredProduct.originalPrice}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="prod-card-right">
                      {cartItem ? (
                        <div className="quantity-pill-selector reel-qty-pill">
                          <button
                            className="quantity-pill-btn"
                            onClick={() => updateQuantity(featuredProduct.id, -1)}
                            aria-label="Decrease quantity"
                          >
                            <Minus size={15} />
                          </button>
                          <span className="quantity-pill-value">{cartItem.quantity}</span>
                          <button
                            className="quantity-pill-btn"
                            onClick={() => updateQuantity(featuredProduct.id, 1)}
                            aria-label="Increase quantity"
                          >
                            <Plus size={15} />
                          </button>
                        </div>
                      ) : (
                        <button className="btn-primary reel-add-btn" onClick={() => addToCart(featuredProduct)}>
                          <ShoppingCart size={16} /> {t('addToCart', 'Add to Cart')}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* View Mode 2: Grid Showcase */}
            {viewMode === 'grid' && (
              <div className="reels-grid-showcase">
                {reelsList.map((reel, index) => {
                  const prod = reel.product || productsList.find(p => String(p.id) === String(reel.productId) || String(p.rawId) === String(reel.productId)) || productsList[0] || {};
                  const itemInCart = prod?.id ? cartItems?.find(item => String(item.id) === String(prod.id)) : null;

                  return (
                    <div key={reel.id} className="reel-grid-card">
                      <div className="reel-grid-media" onClick={() => { setActiveReelIndex(index); setViewMode('player'); }}>
                        <LazyImage src={reel.image} alt={getText(reel, 'title')} style={{ width: '100%', height: '100%' }} />
                        <div className="reel-grid-play-overlay">
                          <div className="play-circle-btn">
                            <Play size={24} fill="#ffffff" color="#ffffff" style={{ marginLeft: '4px' }} />
                          </div>
                          <span className="reel-grid-title">{getText(reel, 'title')}</span>
                        </div>
                        <div className="reel-grid-badge">
                          <Flame size={14} color="#d90429" /> {reel.views} {t('views', 'views')}
                        </div>
                      </div>

                      <div className="reel-grid-footer">
                        <div className="reel-grid-prod-info">
                          <span className="reel-grid-prod-name">{getText(prod, 'name')}</span>
                          <span className="reel-grid-prod-price">₹{prod.price}</span>
                        </div>
                        {itemInCart ? (
                          <div className="quantity-pill-selector" style={{ height: '36px', minWidth: '100px', padding: '0.2rem 0.5rem' }}>
                            <button className="quantity-pill-btn" onClick={() => updateQuantity(prod.id, -1)} aria-label="Decrease quantity"><Minus size={14} /></button>
                            <span className="quantity-pill-value" style={{ fontSize: '0.9rem' }}>{itemInCart.quantity}</span>
                            <button className="quantity-pill-btn" onClick={() => updateQuantity(prod.id, 1)} aria-label="Increase quantity"><Plus size={14} /></button>
                          </div>
                        ) : (
                          <button className="add-cart-btn" onClick={() => addToCart(prod)} style={{ padding: '0.55rem 0.85rem', fontSize: '0.8rem' }}>
                            <ShoppingCart size={15} /> <span>{t('addToCart', 'Add')}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
