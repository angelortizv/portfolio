import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled, { createGlobalStyle } from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { useLanguage } from '../../../hooks/LanguageContext';
import { ISO_CSS } from '../../iso/iso-kit.mjs';
import { FIGURE_SVG } from './geometry.mjs';
import { mountRequestAnatomy } from './live.mjs';

/**
 * "Anatomy of an agent" — an interactive isometric bench model of one
 * LLM-agent run: the model core thinks, calls its tools (web search,
 * database, document drawer) and answers, while a dial gauge runs in near
 * real time. Built with the Anatomy isometric kit (MIT); the figure's
 * geometry lives in ./geometry.mjs and its behaviour in ./live.mjs.
 */

// The kit's stylesheet, plus tokens mapped onto the site's violet palette so
// the figure follows the theme toggle (html[data-theme] is set by the nav).
const IsoStyles = createGlobalStyle`
  ${ISO_CSS}

  .iso {
    --anatomy-card: #0e0824;
    --anatomy-text: var(--light-text-color);
    --anatomy-strong: var(--lightest-text-color);
    --anatomy-muted: var(--text-color);
    --anatomy-paper: #0e0824;
    --anatomy-face: #171039;
    --anatomy-top: #19113d;
    --anatomy-shade-0: #0a0520;
    --anatomy-shade-1: #0d0726;
    --anatomy-shade-2: #10092c;
    --anatomy-shade-3: #130c33;
    --anatomy-lit-top: #241654;
    --anatomy-lit-shade: #1b0f45;
    --anatomy-hi: #cdc6ee;
    --anatomy-mid: #6f6796;
    --anatomy-lo: #453d6e;
    --anatomy-faint: #2b2452;
    --anatomy-lit: var(--signal-color);
    --anatomy-halo: #030008;
    --anatomy-halo-opacity: 0.9;
    --anatomy-dot: #ece9ff;
    --anatomy-mono: var(--font-mono);
  }

  html[data-theme='light'] .iso {
    --anatomy-card: #ffffff;
    --anatomy-paper: #ffffff;
    --anatomy-face: #ffffff;
    --anatomy-top: #ffffff;
    --anatomy-shade-0: #ddd5f2;
    --anatomy-shade-1: #e5dff5;
    --anatomy-shade-2: #ece7f8;
    --anatomy-shade-3: #f3f0fb;
    --anatomy-lit-top: #f6f2ff;
    --anatomy-lit-shade: #e9e1fb;
    --anatomy-hi: #241a4e;
    --anatomy-mid: #8b84ab;
    --anatomy-lo: #b9b2d6;
    --anatomy-faint: #ddd8ef;
    --anatomy-halo: #8a82b0;
    --anatomy-halo-opacity: 0.3;
    --anatomy-dot: #241a4e;
  }

  .iso-pulse-dot {
    fill: var(--anatomy-lit);
  }
`;

const StyledAnatomySection = styled.section`
  max-width: 1000px;
  margin: 0 auto;

  .anatomy-intro {
    margin: -10px 0 32px;
    color: var(--light-text-color);
    font-size: var(--fz-lg);
    line-height: 1.5;
    max-width: 540px;
  }

  .iso-figure {
    margin: 0;
  }

  .iso-plate {
    border-radius: var(--border-radius, 14px);
    border: 1px solid var(--outline-light);
    box-shadow: 0 10px 30px -15px var(--bg-color-shadow);
  }

  .iso-stage {
    cursor: pointer;
    outline: none;

    &:focus-visible {
      outline: 1px solid var(--anatomy-muted);
      outline-offset: 6px;
    }

    svg {
      max-width: 680px;
    }
  }

  /* phones: let the machine fill the card edge to edge */
  @media (max-width: 600px) {
    .iso-stage {
      overflow: hidden;
    }

    .iso-stage svg {
      width: 124%;
      max-width: none;
      margin: -3% -12%;
    }
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }
`;

const Swatch = ({ mark }) => (
  <svg className="iso-swatch" data-mark={mark} viewBox="0 0 16 10" aria-hidden="true">
    <path d="M2 4.5 8 1.5 14 4.5 14 6 8 9 2 6Z" />
    <path className="iso-swatch-crease" d="M2 4.5 8 7.5 14 4.5" />
  </svg>
);

Swatch.propTypes = {
  mark: PropTypes.string.isRequired,
};

const RequestAnatomy = () => {
  const revealContainer = useRef(null);
  const figureRoot = useRef(null);
  const { t, lang } = useLanguage();

  useEffect(() => {
    if (sr) {
      sr.reveal(revealContainer.current, srConfig());
    }
  }, []);

  useEffect(
    () =>
      mountRequestAnatomy(figureRoot.current, {
        idle: t('anatomy_state_idle'),
        ready: t('anatomy_state_ready'),
        task: t('anatomy_state_task'),
        thinking: t('anatomy_state_thinking'),
        web: t('anatomy_state_web'),
        db: t('anatomy_state_db'),
        docs: t('anatomy_state_docs'),
        answering: t('anatomy_state_answering'),
        done: t('anatomy_state_done'),
        tool: t('anatomy_state_tool'),
        tools: t('anatomy_state_tools'),
      }),
    [lang],
  );

  return (
    <StyledAnatomySection id="anatomy" ref={revealContainer}>
      <h2 className="numbered-heading">{t('anatomy_title')}</h2>
      <p className="anatomy-intro">{t('anatomy_subtitle')}</p>

      <IsoStyles />
      <div className="iso" ref={figureRoot}>
        <figure className="iso-figure">
          <div className="iso-plate">
            <div className="iso-plate-corners">
              <span className="iso-plate-corner" data-corner="fig">
                Fig 01
              </span>
              <span className="iso-plate-corner" data-corner="title">
                {t('anatomy_fig_title')}
              </span>
              <span className="iso-plate-corner" data-corner="hint">
                {t('anatomy_hint')}
              </span>
              <span className="iso-plate-corner" data-corner="readout" data-readout>
                {`${t('anatomy_state_idle')} · ${t('anatomy_state_ready')}`}
              </span>
            </div>
            <div
              className="iso-stage"
              tabIndex={0}
              role="button"
              aria-label={t('anatomy_aria')}
              dangerouslySetInnerHTML={{ __html: FIGURE_SVG }}
            />
            <div className="sr-only" data-announce aria-live="polite" />
          </div>
          <figcaption className="iso-legend">
            <span className="iso-keys">
              <span className="iso-key">
                <Swatch mark="lit" />
                {t('anatomy_key_lit')}
              </span>
              <span className="iso-key">
                <Swatch mark="raised" />
                {t('anatomy_key_raised')}
              </span>
            </span>
            <span className="iso-caption">{t('anatomy_caption')}</span>
          </figcaption>
        </figure>
      </div>
    </StyledAnatomySection>
  );
};

export default RequestAnatomy;
