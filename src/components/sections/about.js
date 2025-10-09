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
              Hello! I am <strong>Angelo Ortiz Vega</strong>, a <strong>Software Engineer and AI Practitioner</strong> with over four years of experience
              developing scalable and efficient digital products for startups and organizations. I combine technical expertise in
              software engineering with strong problem-solving skills, business insight, and user-centered design.
              Skilled in <strong>Python</strong> development with frameworks such as <strong>Flask</strong> and <strong>FastAPI</strong>,
              cloud integrations with <strong>AWS</strong>, and modern full stack technologies including <strong>React</strong>,
              <strong>Angular</strong>, and <strong>Node.js</strong>.
            </p>

            <p>
              My work in <strong>Artificial Intelligence</strong> spans building and integrating <strong>machine learning models</strong>
              into production systems, designing <strong>data pipelines</strong>, and applying automation to optimize workflows.
              I’ve developed predictive systems, intelligent agents, and RPA solutions using frameworks like
              <strong>scikit-learn</strong>, <strong>TensorFlow</strong>, and <strong>PyTorch</strong>.
              I’m passionate about bridging the gap between AI research and real-world applications that improve efficiency,
              sustainability, and user experience.
            </p>

            <p>
              I am currently completing a degree in <strong>Computer Engineering</strong> at the
              <a href="https://www.tec.ac.cr/" target="_blank" rel="noreferrer">
                Technological Institute of Costa Rica
              </a>, strengthening my theoretical and analytical foundation.
              The program focuses on the sciences and technologies that enable the design, construction, implementation,
              and maintenance of computer systems — both hardware and software.
            </p>

            <p>
              In parallel, I have worked as a <strong>university lecturer</strong> for over three years, teaching
              <strong>Artificial Intelligence</strong>, <strong>Data Analysis</strong>, <strong>Full Stack Development</strong>, and
              <strong>UX Design</strong> at
              <a href="https://ucreativa.ac.cr/" target="_blank" rel="noreferrer">
                Universidad Creativa de Costa Rica
              </a>,
              with a focus on practical, project-based learning and real-world applications.
            </p>

            <p>
              When I’m not at the computer, I’m usually hiking, reading, hanging out with friends,
              or curating <a href="https://open.spotify.com/playlist/20xTpMDhxDFpACSRXHZzOC?si=2050bd00d9b048bb" target="_blank" rel="noreferrer">
                Spotify
              </a> playlists.
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
