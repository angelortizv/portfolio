import React from 'react';

// Stylised six-petal ring, used only as a generic "OpenAI" skill glyph
const petals = Array.from({ length: 6 }, (_, i) => i * 60);

const IconOpenAI = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48px" height="48px">
    <rect width="48" height="48" rx="8" fill="#0F2A24" />
    <g fill="none" stroke="#10A37F" strokeWidth="2.6" strokeLinecap="round">
      {petals.map(angle => (
        <rect
          key={angle}
          x="19"
          y="8"
          width="10"
          height="17"
          rx="5"
          transform={`rotate(${angle} 24 24)`}
        />
      ))}
    </g>
  </svg>
);

export default IconOpenAI;
