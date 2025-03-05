import { useEffect, useState } from 'react';

export function useScrollTo() {
  const [height, setHeight] = useState(80);

  useEffect(() => {
    const handleResize = () => {
      if (window.matchMedia('(max-width: 480px)')) {
        setHeight(56);
      } else {
        setHeight(80);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollToEl = e => {
    e.preventDefault();
    const hash = e.target.hash;
    const offsetTop = document?.querySelector(hash)?.offsetTop - height;

    scroll({
      top: offsetTop,
      behavior: 'smooth',
    });
  };

  return { scrollToEl };
}