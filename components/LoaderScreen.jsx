'use client';

import { useState, useEffect } from 'react';

export default function LoaderScreen() {
  const [percent, setPercent] = useState(0);
  const [statusText, setStatusText] = useState('Crafting studio experience...');
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 15) + 10;
      if (current >= 100) {
        current = 100;
        setPercent(100);
        setStatusText('Studio Ready!');
        clearInterval(interval);
        setTimeout(() => {
          setHidden(true);
        }, 500);
      } else {
        setPercent(current);
        if (current > 50) setStatusText('Loading prop catalog...');
      }
    }, 120);

    return () => clearInterval(interval);
  }, []);

  if (hidden) return null;

  return (
    <div id="appLoader" className={`app-loader ${percent === 100 ? 'hide' : ''}`}>
      <div className="loader-backdrop-glow"></div>
      <div className="loader-content">
        <div className="logo-wrapper-loader">
          <svg className="loader-svg-ring" viewBox="0 0 200 200">
            <path
              className="draw-path-1"
              d="M 100,10 C 160,8 192,50 188,105 C 184,160 145,190 95,188 C 40,185 10,145 12,90 C 15,35 50,12 100,10 Z"
            />
            <path
              className="draw-path-2"
              d="M 105,15 C 155,18 185,55 180,100 C 175,150 140,182 90,180 C 45,178 18,140 20,95 C 22,42 60,13 105,15 Z"
            />
          </svg>
          <img src="/logo.png" alt="Get Jakes Logo" className="loader-logo-img" />
        </div>

        <div className="loader-text-group">
          <h1 className="loader-title">Get Jakes</h1>
          <p className="loader-subtitle">CAKE PROPS & TOPPERS</p>
        </div>

        <div className="loader-progress-box">
          <div className="loader-bar-bg">
            <div className="loader-bar-fill" style={{ width: `${percent}%` }}></div>
          </div>
          <div className="loader-status">
            <span>{statusText}</span>
            <span>{percent}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
