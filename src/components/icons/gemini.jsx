import React from 'react';

// Stylised four-point sparkle, used only as a generic "Gemini" skill glyph
const IconGemini = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48px" height="48px">
    <defs>
      <linearGradient id="geminiGradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#4285F4" />
        <stop offset="100%" stopColor="#9B72CB" />
      </linearGradient>
    </defs>
    <rect width="48" height="48" rx="8" fill="#14182B" />
    <path
      d="M24 6 C25.5 17 31 22.5 42 24 C31 25.5 25.5 31 24 42 C22.5 31 17 25.5 6 24 C17 22.5 22.5 17 24 6 Z"
      fill="url(#geminiGradient)"
    />
  </svg>
);

export default IconGemini;
