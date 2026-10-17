import React from 'react';

// Stylised twelve-ray burst, used only as a generic "Claude" skill glyph
const rays = Array.from({ length: 12 }, (_, i) => i * 30);

const IconClaude = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48px" height="48px">
    <rect width="48" height="48" rx="8" fill="#2B1A12" />
    <g stroke="#D97757" strokeWidth="3.2" strokeLinecap="round">
      {rays.map(angle => (
        <line
          key={angle}
          x1="24"
          y1="24"
          x2="24"
          y2={angle % 60 === 0 ? 8 : 12}
          transform={`rotate(${angle} 24 24)`}
        />
      ))}
    </g>
    <circle cx="24" cy="24" r="3.5" fill="#D97757" />
  </svg>
);

export default IconClaude;
