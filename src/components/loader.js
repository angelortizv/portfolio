import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import anime from 'animejs';
import styled, { keyframes } from 'styled-components';
import { IconLoader } from '@components/icons';

const SEEN_KEY = 'portfolio-loader-seen';
const NAME = 'ANGELO ORTIZ';

const dots = 'radial-gradient(circle, var(--signal-color-tint) 1.5px, transparent 1.6px)';

// The whole logo (hexagon + A) breathes as one unit, from the very first paint, so the page
// never looks frozen while it is still hydrating.
const logoPulse = keyframes`
  0%, 100% {
    transform: scale(1);
    filter: drop-shadow(0 0 10px var(--glow-color));
  }
  50% {
    transform: scale(1.07);
    filter: drop-shadow(0 0 26px var(--glow-color));
  }
`;

const bootSweep = keyframes`
  0%   { transform: scaleX(0.05); }
  100% { transform: scaleX(0.5); }
`;

const StyledLoader = styled.div`
  position: fixed;
  inset: 0;
  z-index: 99;

  /* two halves that split open to reveal the page */
  .panel {
    position: absolute;
    left: 0;
    width: 100%;
    height: 50%;
    background-color: var(--dark-bg-color);
    /* glow layer covers the panel; dot layer tiles */
    background-size: 100% 100%, 32px 32px;
    will-change: transform;
  }

  .panel.top {
    top: 0;
    background-image: radial-gradient(60vmax 40vmax at 50% 100%, var(--glow-color), transparent 70%),
      ${dots};
    background-position: 0 0, 0 0;
  }

  .panel.bottom {
    bottom: 0;
    background-image: radial-gradient(
        70vmax 36vmax at 50% 0%,
        var(--signal-color-tint),
        transparent 70%
      ),
      ${dots};
    background-position: 0 0, 0 -50vh;
  }

  .stage {
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
  }

  /* the logo sits exactly on the seam between the two halves; the name hangs below it */
  .logo-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 96px;
    height: 96px;
    margin: -48px 0 0 -48px;
    animation: ${logoPulse} 1.4s ease-in-out infinite;

    @media (prefers-reduced-motion: reduce) {
      animation: none;
    }

    svg {
      display: block;
      width: 100%;
      height: 100%;
      fill: none;
      user-select: none;
    }
  }

  &.booting {
    .progress .bar i {
      animation: ${bootSweep} 1.2s ease-in-out infinite alternate;
    }
  }

  .wordmark {
    position: absolute;
    top: calc(50% + 78px);
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    padding-left: 0.4em; /* balances the trailing letter-spacing */
    font-family: var(--font-mono);
    font-size: var(--fz-sm);
    letter-spacing: 0.4em;
    color: var(--light-text-color);
    white-space: pre;

    .ch {
      opacity: 0;
    }
  }

  .progress-wrap {
    position: absolute;
    bottom: clamp(28px, 6vh, 56px);
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    pointer-events: none;
  }

  .progress {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
    letter-spacing: 0.2em;
    color: var(--text-color);

    .bar {
      width: 140px;
      height: 1px;
      background: var(--outline-light);
      overflow: hidden;

      i {
        display: block;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, var(--signal-color), var(--signal-soft));
        transform: scaleX(0);
        transform-origin: left center;
      }
    }
  }
`;

const Loader = ({ onReveal, finishLoading }) => {
  const rootRef = useRef(null);
  const timeline = useRef(null);
  const finished = useRef(false);
  const revealed = useRef(false);
  const [percent, setPercent] = useState(0);
  const [booting, setBooting] = useState(true);

  const reveal = () => {
    if (revealed.current) {
      return;
    }
    revealed.current = true;
    window.dispatchEvent(new Event('portfolio:reveal'));
    onReveal();
  };

  const finish = () => {
    if (finished.current) {
      return;
    }
    finished.current = true;
    reveal();
    try {
      window.sessionStorage.setItem(SEEN_KEY, '1');
    } catch (e) {
      // storage unavailable: the intro simply plays again next visit
    }
    finishLoading();
  };

  useEffect(() => {
    // Play once per browser session, and never for users who prefer reduced motion
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(SEEN_KEY) === '1';
    } catch (e) {
      seen = false;
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (seen || reduced) {
      finish();
      return;
    }

    setBooting(false);
    const q = sel => rootRef.current.querySelectorAll(sel);
    const counter = { value: 0 };

    const tl = anime.timeline({ easing: 'easeInOutQuart', complete: finish });
    timeline.current = tl;

    tl
      // 1. the counter and the progress bar run while the logo keeps pulsing (CSS)
      .add({
        targets: counter,
        value: 100,
        duration: 1400,
        round: 1,
        easing: 'easeInOutSine',
        update: () => setPercent(counter.value),
      })
      .add(
        {
          targets: q('.progress .bar i'),
          scaleX: [0, 1],
          duration: 1400,
          easing: 'easeInOutSine',
        },
        0,
      )
      // 2. the name types in, letter by letter
      .add(
        {
          targets: q('.wordmark .ch'),
          opacity: [0, 1],
          translateY: [8, 0],
          duration: 380,
          delay: anime.stagger(32),
          easing: 'easeOutQuart',
        },
        700,
      )
      // the page mounts underneath just before the curtain opens
      .add({ targets: rootRef.current, duration: 1, begin: reveal }, 1700)
      // 3. content steps back, then the two halves split open
      .add(
        {
          targets: [q('.stage')[0], q('.progress')[0]],
          opacity: [1, 0],
          scale: [1, 0.94],
          duration: 320,
          easing: 'easeInQuad',
        },
        1850,
      )
      .add(
        {
          targets: q('.panel.top'),
          translateY: ['0%', '-100%'],
          duration: 750,
          easing: 'easeInOutExpo',
        },
        1950,
      )
      .add(
        {
          targets: q('.panel.bottom'),
          translateY: ['0%', '100%'],
          duration: 750,
          easing: 'easeInOutExpo',
        },
        1950,
      );

    // Safety net: never leave the visitor on the intro if the timeline stalls
    const watchdog = setTimeout(finish, 8000);

    // Any click or key press skips the intro
    const skip = () => {
      tl.pause();
      finish();
    };
    window.addEventListener('click', skip);
    window.addEventListener('keydown', skip);
    return () => {
      clearTimeout(watchdog);
      window.removeEventListener('click', skip);
      window.removeEventListener('keydown', skip);
      tl.pause();
    };
  }, []);

  return (
    <StyledLoader className={`loader${booting ? ' booting' : ''}`} ref={rootRef}>
      <Helmet bodyAttributes={{ class: `hidden` }} />

      <div className="panel top" />
      <div className="panel bottom" />

      <div className="stage">
        <div className="logo-wrapper">
          <IconLoader />
        </div>
        <div className="wordmark" aria-hidden="true">
          {NAME.split('').map((c, i) => (
            <span className="ch" key={i}>
              {c}
            </span>
          ))}
        </div>
      </div>

      <div className="progress-wrap" aria-hidden="true">
        <div className="progress">
          <span>{String(percent).padStart(3, '0')}</span>
          <div className="bar">
            <i />
          </div>
        </div>
      </div>
    </StyledLoader>
  );
};

Loader.propTypes = {
  onReveal: PropTypes.func.isRequired,
  finishLoading: PropTypes.func.isRequired,
};

export default Loader;
