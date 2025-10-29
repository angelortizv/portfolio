import React, { useEffect, useState } from 'react';

const ScrollProgressBar = () => {
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrolled / height) * 100;
      setScroll(progress);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '4px',
        width: `${scroll}%`,
        backgroundColor: 'var(--primary-color)', 
        transition: 'width 0.2s ease-out',
        zIndex: 9999,
      }}
    />
  );
};

export default ScrollProgressBar;
