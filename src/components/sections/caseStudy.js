import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';
import { useLanguage } from '../../hooks/LanguageContext';

const StyledCaseStudy = styled.section`
  max-width: 1000px;
  padding-top: 0;

  .card {
    position: relative;
    display: grid;
    grid-template-columns: 1.4fr 1fr;
    gap: 40px;
    padding: clamp(28px, 5vw, 56px);
    border-radius: 24px;
    overflow: hidden;
    color: #fff;
    background: linear-gradient(135deg, #5b3df5 0%, #7c5cff 55%, #a78bfa 100%);

    /* dot texture, same language as the page background */
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image: radial-gradient(circle, rgba(255, 255, 255, 0.22) 1.5px, transparent 1.6px);
      background-size: 32px 32px;
      mask-image: linear-gradient(135deg, #000 0%, transparent 70%);
      -webkit-mask-image: linear-gradient(135deg, #000 0%, transparent 70%);
      pointer-events: none;
    }

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 28px;
    }
  }

  .content,
  .aside {
    position: relative;
  }

  .label {
    display: block;
    margin-bottom: 22px;
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.8);
  }

  h2 {
    margin: 0;
    color: #fff;
    font-size: clamp(30px, 5vw, 52px);
    font-weight: 300;
    line-height: 1.08;
    letter-spacing: -0.02em;
  }

  .aside {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: 28px;
  }

  p {
    margin: 0;
    color: rgba(255, 255, 255, 0.92);
    font-size: var(--fz-lg);
    line-height: 1.45;
  }

  .cta {
    align-self: flex-start;
    padding: 14px 22px;
    border-radius: 999px;
    background: #fff;
    color: #1c0f5c;
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    white-space: nowrap;
    transition: var(--transition);

    &:hover,
    &:focus-visible {
      color: #1c0f5c;
      transform: translateY(-2px);
      box-shadow: 0 12px 30px -10px rgba(0, 0, 0, 0.45);
    }
  }
`;

const CaseStudy = () => {
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { t } = useLanguage();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }
    sr.reveal(revealContainer.current, srConfig());
  }, [prefersReducedMotion]);

  return (
    <StyledCaseStudy id="case-study" ref={revealContainer}>
      <div className="card">
        <div className="content">
          <span className="label">{t('case_study_traxion_tag')}</span>
          <h2>{t('case_study_traxion_headline')}</h2>
        </div>

        <div className="aside">
          <p>{t('case_study_traxion_role')}</p>
          <a
            className="cta"
            href={t('case_study_traxion_url')}
            target="_blank"
            rel="noopener noreferrer">
            {t('case_study_traxion_cta')}
          </a>
        </div>
      </div>
    </StyledCaseStudy>
  );
};

export default CaseStudy;
