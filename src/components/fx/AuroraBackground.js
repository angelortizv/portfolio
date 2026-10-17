import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import DotGrid from './DotGrid';

const SEEN_KEY = 'portfolio-loader-seen';

// Static violet glow, a fallback dot texture, and (when WebGL2 is available) an interactive dot
// grid on top. The whole layer lives outside Layout so it persists across page navigations.
const Wrapper = styled.div`
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  opacity: var(--aurora-opacity);
  transition: opacity 0.4s ease;
  background: radial-gradient(60vmax 45vmax at 8% -5%, rgba(124, 92, 255, 0.32), transparent 70%),
    radial-gradient(55vmax 45vmax at 100% 38%, rgba(109, 77, 255, 0.2), transparent 70%),
    radial-gradient(50vmax 40vmax at 25% 108%, rgba(167, 139, 250, 0.16), transparent 70%);

  /* dot texture (static fallback) — hidden once the WebGL grid is running */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(circle, var(--signal-color-tint) 1.5px, transparent 1.6px);
    background-size: 32px 32px;
    mask-image: radial-gradient(ellipse 70% 60% at 50% 0%, #000 20%, transparent 75%);
    -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 0%, #000 20%, transparent 75%);
  }

  &[data-gl='true']::after {
    display: none;
  }

  .grid {
    position: absolute;
    inset: 0;
    mask-image: radial-gradient(ellipse 90% 85% at 50% 30%, #000 25%, transparent 88%);
    -webkit-mask-image: radial-gradient(ellipse 90% 85% at 50% 30%, #000 25%, transparent 88%);
  }
`;

const AuroraBackground = () => {
  // null until the client decides: the canvas is never part of the server render
  const [grid, setGrid] = useState(null);
  const [glReady, setGlReady] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(SEEN_KEY) === '1';
    } catch (e) {
      seen = false;
    }
    // On a fresh visit to the home page the dots wait for the loader's curtain to open
    setGrid({ waitForIntro: window.location.pathname === '/' && !seen });
  }, []);

  return (
    <Wrapper aria-hidden="true" data-gl={glReady ? 'true' : 'false'}>
      {grid && (
        <div className="grid">
          <DotGrid waitForIntro={grid.waitForIntro} onReady={() => setGlReady(true)} />
        </div>
      )}
    </Wrapper>
  );
};

export default AuroraBackground;
