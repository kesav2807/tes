import React, { useState, useEffect } from 'react';
import { Play, Sparkles, Flame, Rocket } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useWebControl } from '../context/WebControlContext';
import { formatYouTubeEmbedUrl } from '../services/productService';

export const FireworksVideoShowcase = () => {
  const { language } = useLanguage();
  const { videoBgUrl } = useTheme();
  const { isYoutubeVisible, youtubeEmbedUrl } = useWebControl();

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

  // Hide section if API youtube_url_visible is false
  if (!isYoutubeVisible) {
    return null;
  }

  const activeEmbedUrl = formatYouTubeEmbedUrl(youtubeEmbedUrl || 'https://www.youtube.com/watch?v=5qap5aO4i9A');

  const videoBgStyle = {
    backgroundImage: `linear-gradient(180deg, rgba(15, 23, 42, 0.04) 0%, rgba(15, 23, 42, 0.11) 100%), url("${bgVideoImage}")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  return (
    <section className="deepavali-video-section" style={videoBgStyle}>
      <div className="deepavali-video-overlay"></div>
      <div className="container deepavali-video-container">
        {/* Top Header Tagline */}
        <div className="deepavali-video-header">
          <div className="deepavali-video-badge">
            <Play size={14} fill="#ffc107" color="#ffc107" />
            <span>
              {language === 'ta' ? 'தீபாவளி சிறப்பு வீடியோ காட்சி' : 'DEEPAVALI SPECIAL SHOWCASE'}
            </span>
          </div>

          <h2 className="deepavali-video-title">
            {language === 'ta'
              ? 'சிவகாசி பிரமாண்ட பட்டாசு காட்சிகளை காணுங்கள்'
              : 'Watch Sivakasi Grand Fireworks Display'}
          </h2>

          <p className="deepavali-video-sub">
            {language === 'ta'
              ? 'உங்கள் தீபாவளி கொண்டாட்டத்திற்கு ஆர்டர் செய்வதற்கு முன் வண்ணமயமான பட்டாசு காட்சிகளை நேரலையில் காணுங்கள்!'
              : 'Experience the breathtaking colors, grand aerial shots, and ground fireworks in action before ordering for your Deepavali celebration!'}
          </p>
        </div>

        {/* Video Player Frame Card */}
        <div className="fireworks-iframe-card">
          <div className="fireworks-responsive-iframe-wrapper">
            <iframe 
              src={activeEmbedUrl}
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              referrerPolicy="strict-origin-when-cross-origin" 
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* Feature Badges Below Video */}
        <div className="deepavali-video-features">
          <div className="video-feature-pill">
            <Sparkles size={16} color="var(--crimson-red)" />
            <span>{language === 'ta' ? '100% பசுமை பட்டாசுகள்' : '100% Green Crackers'}</span>
          </div>
          <div className="video-feature-pill">
            <Flame size={16} color="var(--crimson-red)" />
            <span>{language === 'ta' ? 'பிரமாண்ட வானவேடிக்கை' : 'High Aerial Display'}</span>
          </div>
          <div className="video-feature-pill">
            <Rocket size={16} color="var(--crimson-red)" />
            <span>{language === 'ta' ? 'அசல் சிவகாசி தரம்' : 'Direct Sivakasi Quality'}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
