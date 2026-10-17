import React, { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import anime from 'animejs';
import styled, { keyframes } from 'styled-components';
import { IconLoader } from '@components/icons';
import { useLanguage } from '../hooks/LanguageContext';

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

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .skip-hint {
    position: absolute;
    bottom: clamp(28px, 6vh, 56px);
    left: 0;
    right: 0;
    text-align: center;
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text-color);
    opacity: 0;
    pointer-events: none;
  }
`;

const Loader = ({ onReveal, finishLoading }) => {
  const rootRef = useRef(null);
  const timeline = useRef(null);
  const finished = useRef(false);
  const mounted = useRef(false);
  const curtainStarted = useRef(false);
  const { t } = useLanguage();

  // The page mounts underneath early, while the screen is just the pulsing logo, so all that
  // React work is done long before the curtain starts moving.
  const mountPage = () => {
    if (mounted.current) {
      return;
    }
    mounted.current = true;
    onReveal();
  };

  // Tells the hero and the dot grid to begin their own entrances as the curtain opens
  const openCurtain = () => {
    if (curtainStarted.current) {
      return;
    }
    curtainStarted.current = true;
    window.__introPending = false;
    window.dispatchEvent(new Event('portfolio:reveal'));
  };

  const finish = () => {
    if (finished.current) {
      return;
    }
    finished.current = true;
    mountPage();
    openCurtain();
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
      return undefined;
    }

    window.__introPending = true;
    const q = sel => rootRef.current.querySelectorAll(sel);

    const tl = anime.timeline({ easing: 'easeInOutQuart', complete: finish });
    timeline.current = tl;

    tl
      // the page mounts right away, hidden behind the loader
      .add({ targets: rootRef.current, duration: 1, begin: mountPage }, 250)
      // the name types in
      .add(
        {
          targets: q('.wordmark .ch'),
          opacity: [0, 1],
          translateY: [8, 0],
          duration: 300,
          delay: anime.stagger(24),
          easing: 'easeOutQuart',
        },
        250,
      )
      // a quiet hint that the intro can be skipped
      .add({ targets: q('.skip-hint'), opacity: [0, 0.8], duration: 400, easing: 'linear' }, 600)
      // content steps back, then the two halves split open
      .add(
        {
          targets: [q('.stage')[0], q('.skip-hint')[0]],
          opacity: 0,
          scale: 0.94,
          duration: 260,
          easing: 'easeInQuad',
        },
        1000,
      )
      .add(
        {
          targets: q('.panel.top'),
          translateY: ['0%', '-100%'],
          duration: 700,
          easing: 'easeInOutExpo',
          begin: openCurtain,
        },
        1100,
      )
      .add(
        {
          targets: q('.panel.bottom'),
          translateY: ['0%', '100%'],
          duration: 700,
          easing: 'easeInOutExpo',
        },
        1100,
      );

    // Safety net: never leave the visitor on the intro if the timeline stalls
    const watchdog = setTimeout(finish, 6000);

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
    <StyledLoader className="loader" ref={rootRef} role="status" aria-live="polite">
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

      <span className="sr-only">{t('loader_loading')}</span>
      <p className="skip-hint" aria-hidden="true">
        {t('loader_skip')}
      </p>
    </StyledLoader>
  );
};

Loader.propTypes = {
  onReveal: PropTypes.func.isRequired,
  finishLoading: PropTypes.func.isRequired,
};

export default Loader;
