import React from 'react';

const IconEnglish = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 7410 3900">
    <path fill="#b22234" d="M0 0h7410v3900H0z" />
    <path fill="#fff" d="M0 450h7410v300H0zM0 1050h7410v300H0zM0 1650h7410v300H0zM0 2250h7410v300H0zM0 2850h7410v300H0zM0 3450h7410v300H0z" />
    <path fill="#3c3b6e" d="M0 0h2964v2100H0z" />
    <g fill="#fff">
      {Array.from({ length: 9 }).map((_, row) =>
        Array.from({ length: row % 2 === 0 ? 6 : 5 }).map((_, col) => (
          <polygon
            key={`${row}-${col}`}
            points="247,90 323,303 547,303 367,439 433,653 247,528 61,653 127,439 -53,303 171,303"
            transform={`translate(${250 + col * 475 + (row % 2 ? 237 : 0)}, ${200 + row * 210}) scale(0.2)`}
          />
        ))
      )}
    </g>
  </svg>
);

export default IconEnglish;
