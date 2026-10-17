import React, { useState, useEffect } from 'react';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled, { css, keyframes } from 'styled-components';
import { navLinks } from '@config';
import { loaderDelay } from '@utils';
import { useScrollDirection, usePrefersReducedMotion } from '@hooks';
import { Menu } from '@components';
import { IconLogo } from '@components/icons';
import IconLight from './icons/light';
import IconDark from './icons/dark';
import Colors from '../styles/colors';
import { useLanguage } from '../hooks/LanguageContext';
import IconAccessibility from './icons/accessibility';
import AccessibilityModal from './accessibilityModal';

const StyledHeader = styled.header`
  ${({ theme }) => theme.mixins.flexBetween};
  position: fixed;
  top: 0;
  z-index: 11;
  padding: 0px 40px;
  width: 100%;
  height: var(--nav-height);
  background-color: transparent;
  filter: none !important;
  pointer-events: none !important;
  user-select: auto !important;
  transition: var(--transition);

  @media (max-width: 1080px) {
    padding: 0 30px;
  }
  @media (max-width: 768px) {
    padding: 0 16px;
  }

  @media (prefers-reduced-motion: no-preference) {
    ${props =>
    props.scrollDirection === 'up' &&
      !props.scrolledToTop &&
      css`
        height: var(--nav-scroll-height);
        transform: translateY(0px);
      `};

    ${props =>
    props.scrollDirection === 'down' &&
      !props.scrolledToTop &&
      css`
        height: var(--nav-scroll-height);
        transform: translateY(calc(var(--nav-scroll-height) * -1));
      `};
  }
`;

const logoSpin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

const logoPulse = keyframes`
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.18); }
`;

const StyledNav = styled.nav`
  ${({ theme }) => theme.mixins.flexBetween};
  position: relative;
  width: min(100%, 1120px);
  height: 60px;
  margin: 0 auto;
  padding: 0 14px 0 18px;
  color: var(--lightest-text-color);
  counter-reset: item 0;
  z-index: 12;
  pointer-events: auto;

  /* floating glass pill */
  border: 1px solid var(--outline-light);
  border-radius: 999px;
  background-color: var(--nav-bg);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow: 0 10px 30px -12px var(--bg-color-shadow);

  .logo {
    ${({ theme }) => theme.mixins.flexCenter};
    flex: 1;
    justify-content: flex-start;

    a {
      color: var(--primary-color);
      width: 42px;
      height: 42px;

      svg {
        fill: none;
        transition: var(--transition);
        user-select: none;
        overflow: visible;
      }

      /* hover / keyboard focus: the hexagon turns once and the A pulses */
      @media (prefers-reduced-motion: no-preference) {
        &:hover svg,
        &:focus-visible svg {
          filter: drop-shadow(0 0 8px var(--glow-color));
        }

        &:hover #Shape,
        &:focus-visible #Shape {
          transform-box: fill-box;
          transform-origin: center;
          animation: ${logoSpin} 1.1s cubic-bezier(0.65, 0, 0.35, 1) 1;
        }

        &:hover svg path,
        &:focus-visible svg path {
          transform-box: fill-box;
          transform-origin: center;
          animation: ${logoPulse} 1.1s ease-in-out 1;
        }
      }
    }
  }

  .theme-switch {
    button {
      background: none;
      border: none;
      padding: 0 !important;
      border-radius: var(--border-radius-circle);
      cursor: pointer;
      color: var(--primary-color);
      width: 48px;
      height: 48px;

      &:hover {
        background-color: var(--highlight-tint);
      }

      svg {
        width: 32px;
        height: 32px;
        fill: var(--primary-color);
        transition: var(--transition);
        user-select: none;
      }
    }
  }

  .theme-switch button.lang-toggle {
    width: auto;
    padding: 0 10px !important;
    border-radius: 999px;
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    letter-spacing: 0.08em;
    white-space: nowrap;
    color: var(--text-color);

    @media (max-width: 480px) {
      padding: 0 4px !important;
      font-size: var(--fz-xxs);
    }

    span.on {
      color: var(--primary-color);
      border-bottom: 1px solid var(--signal-color);
    }
  }

  .tools-switcher {
    flex: 1;
    justify-content: flex-end;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;

    @media (max-width: 480px) {
      gap: 0;
    }
  }
`;

const StyledLinks = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }

  ol {
    ${({ theme }) => theme.mixins.flexBetween};
    padding: 0;
    margin: 0;
    list-style: none;

    li {
      margin: 0 5px;
      position: relative;
      counter-increment: item 1;
      font-size: var(--fz-xxs);

      a {
        padding: 10px;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        font-weight: 400;
        color: var(--light-text-color);

        border-radius: 999px;

        &:hover,
        &:focus,
        &[aria-current='location'] {
          color: var(--contrast-color);
          background-color: var(--signal-color-tint);
        }
      }
    }
  }
  }
`;

const Nav = ({ isHome }) => {
  const [isMounted, setIsMounted] = useState(!isHome);
  const scrollDirection = useScrollDirection('down');
  const [scrolledToTop, setScrolledToTop] = useState(true);
  const [activeId, setActiveId] = useState('');
  const prefersReducedMotion = usePrefersReducedMotion();

  const THEME_KEY = 'portfolio-theme';
  const [IsDarkMode, setIsDarkMode] = useState(false);

  const [modalOpened, setModalOpened] = useState(false);

  // Restore theme from localStorage (or system preference) on mount
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const saved = window.localStorage.getItem(THEME_KEY);
    const mode = saved === 'dark' || saved === 'light' ? saved : 'dark';

    const root = window.document.documentElement;
    for (const prop in Colors[mode]) {
      root.style.setProperty(prop, Colors[mode][prop]);
    }
    setIsDarkMode(mode === 'dark');
  }, []);

  const { t, lang, toggleLang } = useLanguage();
  const isEnglish = lang === 'en';

  const handleScroll = () => {
    setScrolledToTop(window.pageYOffset < 50);
  };

  const toggleTheme = () => {
    const mode = IsDarkMode ? 'light' : 'dark';
    const root = window.document.documentElement;
    for (const prop in Colors[mode]) {
      root.style.setProperty(prop, Colors[mode][prop]);
    }
    window.localStorage.setItem(THEME_KEY, mode);
    setIsDarkMode(!IsDarkMode);
  };

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const timeout = setTimeout(() => {
      setIsMounted(true);
    }, 100);

    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Highlight the section currently under the reading line (home page only)
  useEffect(() => {
    if (!isHome) {
      return undefined;
    }
    const ids = (navLinks || []).map(({ url }) => url.replace('/#', ''));
    let ticking = false;
    const update = () => {
      ticking = false;
      const line = window.innerHeight * 0.35;
      const atBottom =
        window.innerHeight + window.pageYOffset >= document.documentElement.scrollHeight - 4;
      let current = '';
      ids.forEach(id => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) {
          current = id;
        }
      });
      setActiveId(atBottom ? ids[ids.length - 1] : current);
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [isHome]);

  const timeout = isHome ? loaderDelay : 0;
  const fadeClass = isHome ? 'fade' : '';
  const fadeDownClass = isHome ? 'fadedown' : '';

  const Logo = (
    <div className="logo" tabIndex="-1">
      {isHome ? (
        <a href="/" aria-label="home">
          <IconLogo />
        </a>
      ) : (
        <Link to="/" aria-label="home">
          <IconLogo />
        </Link>
      )}
    </div>
  );

  const ThemeSwitch = (
    <div className="theme-switch">
      <button
        type="button"
        aria-label={t('nav_theme_switch')}
        onClick={() => {
          toggleTheme();
        }}>
        {IsDarkMode ? <IconLight /> : <IconDark />}
      </button>
    </div>
  );

  const LangSwitch = (
    <div className="theme-switch">
      <button
        type="button"
        className="lang-toggle"
        onClick={toggleLang}
        aria-label={t('nav_lang_switch')}>
        <span className={isEnglish ? 'on' : ''}>EN</span>
        <span aria-hidden="true"> | </span>
        <span className={isEnglish ? '' : 'on'}>ES</span>
      </button>
    </div>
  );

  const OpenAccessibility = (
    <div className="theme-switch">
      <button
        type="button"
        aria-label={t('accessibility_text_title')}
        onClick={() => {
          setModalOpened(true);
        }}>
        <IconAccessibility />
      </button>
    </div>
  );

  return (
    <StyledHeader scrollDirection={scrollDirection} scrolledToTop={scrolledToTop}>
      <StyledNav>
        {prefersReducedMotion ? (
          <>
            {Logo}

            <StyledLinks>
              <ol>
                {navLinks &&
                  navLinks.map(({ url, name }, i) => (
                    <li key={i}>
                      <Link
                        to={url}
                        aria-current={activeId === url.replace('/#', '') ? 'location' : undefined}>
                        {t(`menu_text_${name}`)}
                      </Link>
                    </li>
                  ))}
              </ol>
            </StyledLinks>

            {ThemeSwitch}

            <Menu />
          </>
        ) : (
          <>
            <TransitionGroup component={null}>
              {isMounted && (
                <CSSTransition classNames={fadeClass} timeout={timeout}>
                  <>{Logo}</>
                </CSSTransition>
              )}
            </TransitionGroup>

            <StyledLinks>
              <ol>
                <TransitionGroup component={null}>
                  {isMounted &&
                    navLinks &&
                    navLinks.map(({ url, name }, i) => (
                      <CSSTransition key={i} classNames={fadeDownClass} timeout={timeout}>
                        <li key={i} style={{ transitionDelay: `${isHome ? i * 100 : 0}ms` }}>
                          <Link
                            to={url}
                            aria-current={
                              activeId === url.replace('/#', '') ? 'location' : undefined
                            }>
                            {t(`menu_text_${name}`)}
                          </Link>
                        </li>
                      </CSSTransition>
                    ))}
                </TransitionGroup>
              </ol>
            </StyledLinks>

            <AccessibilityModal isOpen={modalOpened} onClose={() => setModalOpened(false)} />

            <div className="tools-switcher">
              <TransitionGroup component={null}>
                {isMounted && (
                  <CSSTransition classNames={fadeClass} timeout={timeout}>
                    <>{ThemeSwitch}</>
                  </CSSTransition>
                )}
              </TransitionGroup>

              <TransitionGroup component={null}>
                {isMounted && (
                  <CSSTransition classNames={fadeClass} timeout={timeout}>
                    <>{OpenAccessibility}</>
                  </CSSTransition>
                )}
              </TransitionGroup>

              <TransitionGroup component={null}>
                {isMounted && (
                  <CSSTransition classNames={fadeClass} timeout={timeout}>
                    <>{LangSwitch}</>
                  </CSSTransition>
                )}
              </TransitionGroup>
            </div>

            <TransitionGroup component={null}>
              {isMounted && (
                <CSSTransition classNames={fadeClass} timeout={timeout}>
                  <Menu />
                </CSSTransition>
              )}
            </TransitionGroup>
          </>
        )}
      </StyledNav>
    </StyledHeader>
  );
};

Nav.propTypes = {
  isHome: PropTypes.bool,
};

export default Nav;
