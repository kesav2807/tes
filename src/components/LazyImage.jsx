import React, { useState } from 'react';

export const LazyImage = ({
  src,
  alt = '',
  className = '',
  style = {},
  fallbackSrc = 'https://placehold.co/400x400/e2e8f0/64748b?text=SDS+Crackers',
  loading = 'lazy',
  decoding = 'async',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  const finalSrc = hasError ? fallbackSrc : (src || fallbackSrc);

  return (
    <div
      className={`lazy-image-container ${className}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        display: 'inline-block',
        verticalAlign: 'middle',
        ...style
      }}
    >
      {!isLoaded && (
        <div
          className="skeleton-shimmer"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            zIndex: 1
          }}
        />
      )}
      <img
        src={finalSrc}
        alt={alt}
        loading={loading}
        decoding={decoding}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          width: '100%',
          height: '100%',
          objectFit: style.objectFit || 'cover',
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out',
          display: 'block'
        }}
        {...props}
      />
    </div>
  );
};

export default LazyImage;
