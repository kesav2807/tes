import React, { createContext, useContext, useState, useEffect } from 'react';
import { getThemes } from '../services/themeService';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [activeTheme, setActiveThemeState] = useState(() => {
    try {
      const cached = localStorage.getItem('sds_active_theme');
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    return {
      primary_color: '#FFC107',
      secondary_color: '#FF5722',
      text_color: '#212121',
      home_bg_url: '',
      video_bg_url: '',
    };
  });
  const [allThemes, setAllThemes] = useState([]);

  // Apply CSS custom properties dynamically to document head / root
  const applyThemeToDocument = (theme) => {
    if (!theme) return;
    const root = document.documentElement;

    const primary = theme.primary_color || theme.primaryColor || theme.primary || '#FFC107';
    let secondary = theme.secondary_color || theme.secondaryColor || theme.secondary || '#d90429';
    const textColor = theme.text_color || theme.textColor || theme.color_text || theme.text_color_code || '#212121';
    const bgColor = theme.background_color || theme.bgColor || '#ffffff';

    // If secondary color is too light or pale, fall back to rich crimson red #d90429 for high contrast
    if (typeof secondary === 'string') {
      const cleanHex = secondary.replace('#', '').trim();
      if (cleanHex.length === 6) {
        const r = parseInt(cleanHex.substring(0, 2), 16);
        const g = parseInt(cleanHex.substring(2, 4), 16);
        const b = parseInt(cleanHex.substring(4, 6), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        if (brightness > 180) {
          secondary = '#d90429';
        }
      }
    }

    // Primary & Secondary Brand Colors from getthemes API
    root.style.setProperty('--primary-gold', primary);
    root.style.setProperty('--primary-gold-hover', primary);
    root.style.setProperty('--primary-gold-light', primary + '33');
    root.style.setProperty('--theme-primary', primary);

    root.style.setProperty('--crimson-red', secondary);
    root.style.setProperty('--crimson-red-hover', secondary);
    root.style.setProperty('--crimson-dark', secondary);
    root.style.setProperty('--theme-secondary', secondary);

    root.style.setProperty('--text-dark', textColor);
    root.style.setProperty('--theme-text', textColor);
    root.style.setProperty('--theme-bg', bgColor);

    root.style.setProperty('--footer-gradient-start', secondary);
    root.style.setProperty('--footer-gradient-end', '#0f172a');
    root.style.setProperty('--footer-accent', primary);

    const homeBg = theme.home_bg_url || theme.home_background_url;
    if (homeBg) {
      root.style.setProperty('--theme-home-bg', `url("${homeBg}")`);
    }

    const videoBg = theme.video_bg_url || theme.video_player_background_url;
    if (videoBg) {
      root.style.setProperty('--theme-video-bg', `url("${videoBg}")`);
    }

    // Dynamic Style Tag Injection for full page text_color & theme support
    let styleTag = document.getElementById('sds-dynamic-theme-styles');
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'sds-dynamic-theme-styles';
      document.head.appendChild(styleTag);
    }
    styleTag.innerHTML = `
      :root {
        --theme-primary: ${primary};
        --theme-secondary: ${secondary};
        --theme-text: ${textColor};
        --text-dark: ${textColor};
        --primary-gold: ${primary};
        --crimson-red: ${secondary};
      }
      body {
        color: ${textColor} !important;
      }
      .brand-title {
        color: ${textColor} !important;
      }
      .product-title {
        color: ${textColor} !important;
      }
      .header-top-bar {
        background-color: ${primary} !important;
        color: ${textColor} !important;
      }
      .header-top-bar a, 
      .header-top-bar span, 
      .header-top-bar select, 
      .header-top-bar .top-banner-promo, 
      .header-top-bar .top-link-item {
        color: ${textColor} !important;
      }
      .header-top-bar svg {
        color: ${textColor} !important;
        stroke: ${textColor} !important;
      }
    `;

    try {
      localStorage.setItem('sds_active_theme', JSON.stringify(theme));
    } catch (e) {}
  };

  // Fetch active theme from backend API
  const fetchActiveTheme = async () => {
    try {
      const themes = await getThemes();
      if (Array.isArray(themes) && themes.length > 0) {
        setAllThemes(themes);
        const active = themes[0];
        setActiveThemeState(active);
        applyThemeToDocument(active);
      }
    } catch (err) {
      console.warn("Failed fetching active theme from API:", err);
    }
  };

  useEffect(() => {
    applyThemeToDocument(activeTheme);
    fetchActiveTheme();
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        activeTheme,
        allThemes,
        homeBgUrl: activeTheme?.home_bg_url || activeTheme?.home_background_url,
        videoBgUrl: activeTheme?.video_bg_url || activeTheme?.video_player_background_url,
        primaryColor: activeTheme?.primary_color,
        secondaryColor: activeTheme?.secondary_color,
        textColor: activeTheme?.text_color,
        refreshTheme: fetchActiveTheme
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
