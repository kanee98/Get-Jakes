'use client';

import { useState, useEffect } from 'react';

const DEFAULT_FALLBACK = '/images/hero_cake_prop.png';

/**
 * SafeImage Component
 * Prevents broken image icons by validating image URLs and falling back gracefully.
 */
export default function SafeImage({ src, alt = 'Get Jakes Cake Prop', fallback = DEFAULT_FALLBACK, style = {}, className = '', ...props }) {
  const [imgSrc, setImgSrc] = useState(src || fallback);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!src || src.trim() === '' || src === 'Test' || src === 'undefined' || src === 'null') {
      setImgSrc(fallback);
      setHasError(true);
    } else {
      setImgSrc(src);
      setHasError(false);
    }
  }, [src, fallback]);

  return (
    <img
      {...props}
      src={imgSrc}
      alt={alt}
      className={className}
      style={{ ...style }}
      onError={(e) => {
        if (!hasError) {
          setHasError(true);
          setImgSrc(fallback);
        }
      }}
    />
  );
}
