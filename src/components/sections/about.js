import React, { useEffect, useRef } from 'react';
import { StaticImage } from 'gatsby-plugin-image';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';
import AboutFooter from '../aboutFooter';

const StyledAboutSection = styled.section`

  .inner {
    display: grid;
    grid-template-columns: 3fr 2fr;
    grid-gap: 50px;

    @media (max-width: 768px) {
      display: block;
    }
  }
`;
const StyledText = styled.div`
  ul.skills-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(140px, 200px));
    grid-gap: 0 10px;
    padding: 0;
    margin: 20px 0 0 0;
    overflow: hidden;
    list-style: none;

    li {
      position: relative;
      margin-bottom: 10px;
      padding-left: 20px;
      font-family: var(--font-mono);
      font-size: var(--fz-xs);

      &:before {
        content: '▹';
        position: absolute;
        left: 0;
        color: var(--green);
        font-size: var(--fz-sm);
        line-height: 12px;
      }
    }
  }
`;
const StyledPic = styled.div`
  position: relative;
  max-width: 300px;

  @media (max-width: 768px) {
    margin: 50px auto 0;
    width: 70%;
  }

  .wrapper {
    ${({ theme }) => theme.mixins.boxShadow};
    display: block;
    position: relative;
    width: 100%;
    border-radius: var(--border-radius);

    &:hover,
    &:focus {
      background: transparent;
      outline: 0;

      &:after {
        top: 15px;
        left: 15px;
      }

      .img {
        filter: none;
        mix-blend-mode: normal;
      }
    }

    .img {
      position: relative;
      border-radius: var(--border-radius);
      transition: var(--transition);
    }

    &:before,
    &:after {
      content: '';
      display: block;
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: var(--border-radius);
      transition: var(--transition);
    }

    &:before {
      top: 0;
      left: 0;
      mix-blend-mode: screen;
    }

    &:after {
      border: 2px solid var(--green);
      top: 20px;
      left: 20px;
      z-index: -1;
    }
  }
`;

const About = () => {
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealContainer.current, srConfig());
  }, []);

  return (
    <StyledAboutSection id="about" ref={revealContainer}>
      <h2 className="numbered-heading">About Me</h2>

      <div className="inner">
        <StyledText>
          <div>
            <p>
              Hello! My name is Angelo Ortiz Vega, a Computer Engineering Student based in Costa Rica. I enjoy
              creating things that live on the internet, whether that be websites, applications, or
              anything in between. My goal is to always build products that scale and impacts
              millions of people.
            </p>

            <p>
              I am currently studying a degree in Computer Engineering at the Technological
              Institute of Costa Rica. ({' '}
              <a href="https://www.tec.ac.cr/" target="_blank" rel="noreferrer">
                ITCR
              </a>{' '}
              ). Computer Engineer is based on sciences and technologies that allow the design,
              construction, implementation and maintenance of computer system components in both
              hardware and software.
            </p>

            <p>
              I also work as a professor of Artificial Intelligence and UX Design at {' '}
              <a href="https://ucreativa.ac.cr/" target="_blank" rel="noreferrer">
                Universidad Creativa
              </a>{' '}
              where I've taught courses such as Applied Artificial Intelligence and Fundamentals of Machine Learning & Deep Learning for the AI Certification.
            </p>

            <p>
              When I'm not at the computer, I'm usually hiking, reading, hanging out with my friends, or making {' '}
              <a href="https://open.spotify.com/playlist/20xTpMDhxDFpACSRXHZzOC?si=2050bd00d9b048bb" target="_blank" rel="noreferrer">
                Spotify
              </a>{' '} playlists.
            </p>
          </div>
        </StyledText>

        <StyledPic>
          <div className="wrapper">
            <StaticImage
              className="img"
              src="../../images/angelortizv-hiking.jpeg"
              width={500}
              quality={95}
              formats={['AUTO', 'WEBP', 'AVIF']}
              alt="Headshot"
            />
          </div>
          <AboutFooter />
        </StyledPic>

      </div>
    </StyledAboutSection>
  );
};

export default About;
