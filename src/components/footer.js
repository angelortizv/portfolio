import React from 'react';
import styled from 'styled-components';
import { Icon } from '@components/icons';
import { socialMedia } from '@config';
import ScrollToTop from './scrollToTop';
import { useLanguage } from '../hooks/LanguageContext';
import { useKeyboardShortcuts } from '../hooks/KeyboardShortcutsContext';

const StyledFooter = styled.footer`
  ${({ theme }) => theme.mixins.flexCenter};
  flex-direction: column;
  height: auto;
  min-height: 70px;
  padding: 15px;
  text-align: center;
`;

const StyledSocialLinks = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
    width: 100%;
    max-width: 270px;
    margin: 0 auto 10px;
    color: var(--light-slate);
  }

  ul {
    ${({ theme }) => theme.mixins.flexBetween};
    padding: 0;
    margin: 0;
    list-style: none;

    a {
      padding: 10px;
      svg {
        width: 20px;
        height: 20px;
      }
    }
  }
`;

const StyledCredit = styled.div`
  color: var(--light-slate);
  font-family: var(--font-mono);
  font-size: var(--fz-xxs);
  line-height: 1;

  a {
    padding: 10px;
  }

  .footer-shortcuts {
    margin-top: 10px;

    button {
      font-family: inherit;
      font-size: inherit;
      color: inherit;
      background: none;
      border: none;
      padding: 10px;
      cursor: pointer;
      text-decoration: underline;
      text-underline-offset: 2px;

      &:hover {
        color: var(--primary-color);
      }
    }
  }

  .github-stats {
    margin-top: 10px;

    & > span {
      display: inline-flex;
      align-items: center;
      margin: 0 7px;
    }
    svg {
      display: inline-block;
      margin-right: 5px;
      width: 14px;
      height: 14px;
    }
  }
`;

const formatBuildDate = isoString => {
  if (!isoString) {return '';}
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(date);
};

const Footer = () => {
  const { t } = useLanguage();
  const { openShortcuts } = useKeyboardShortcuts();
  const buildDate = typeof process !== 'undefined' && process.env.GATSBY_BUILD_DATE;
  const lastUpdated = formatBuildDate(buildDate);

  return (
    <StyledFooter>
      <StyledSocialLinks>
        <ul>
          {socialMedia &&
            socialMedia.map(({ name, url }, i) => (
              <li key={i}>
                <a href={url} aria-label={name}>
                  <Icon name={name} />
                </a>
              </li>
            ))}
        </ul>
      </StyledSocialLinks>

      <StyledCredit tabIndex={-1}>
        <a href="https://github.com/bchiang7/v4">
          <div>{t('footer_text_designed')} Brittany Chiang</div>
        </a>
        <br />
        <a href="https://www.angelortizv.com/authors/angelo-ortiz-vega/">
          <div>{t('footer_text_build')} Angelo Ortiz</div>
        </a>
        {lastUpdated && (
          <div className="footer-updated" style={{ marginTop: '8px', opacity: 0.8 }}>
            {t('footer_last_updated')} {lastUpdated}
          </div>
        )}
        <div className="footer-shortcuts">
          <button type="button" onClick={openShortcuts}>
            {t('accessibility_text_shortcuts')}
          </button>
        </div>
      </StyledCredit>

      <ScrollToTop className="scrollToTop" />
    </StyledFooter>
  );
};

export default Footer;
