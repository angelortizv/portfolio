import React, { useState, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import { navDelay, loaderDelay } from '@utils';
import { usePrefersReducedMotion } from '@hooks';
import { translations } from '../../config';
import TypeAnimation from 'react-type-animation';
// import { email } from '@config';

const StyledHeroSection = styled.section`
  ${({ theme }) => theme.mixins.flexCenter};
  flex-direction: column;
  align-items: flex-start;
  min-height: 100vh;
  padding: 0;

  @media (max-width: 480px) and (min-height: 700px) {
    padding-bottom: 10vh;
  }

  h1 {
    margin: 0 0 30px 4px;
    color: var(--primary-color);
    font-family: var(--font-mono);
    font-size: clamp(var(--fz-sm), 5vw, var(--fz-md));
    font-weight: 400;

    @media (max-width: 480px) {
      margin: 0 0 20px 2px;
    }
  }

  h3 {
    margin-top: 10px;
    color: var(--slate);
    line-height: 0.9;
  }

  p {
    margin: 20px 0 0;
  }

  .email-link {
    ${({ theme }) => theme.mixins.bigButton};
    margin-top: 50px;
  }
`;

const shuffleArray = array => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const Hero = () => {
  const [isMounted, setIsMounted] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const seq = [];
  for (const greeting of shuffleArray(translations)) {
    seq.push(`✨❯ ${greeting.flag} 👋 ${greeting.text}`);
    seq.push(1000);
    seq.push(`✨❯`);
    seq.push(1000);
  }

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const timeout = setTimeout(() => setIsMounted(true), navDelay);
    return () => clearTimeout(timeout);
  }, []);

  const one = <TypeAnimation cursor={true} sequence={seq} wrapper="h1" repeat={Infinity} />;
  //const one = <TypeAnimation cursor={true} sequence={seq} wrapper="h1" repeat={Infinity} />;
  const two = <h2 className="big-heading">Angelo Ortiz.</h2>;
  const three = (
    <h3 className="big-heading" style={{ fontSize: 30 }}>
      Computer Engineer, AI & Data, Full Stack Development, University Lecturer.
    </h3>
  );
  const four = (
    <>
      <p>
        Software Engineer with over four years of experience developing scalable and efficient
        digital products for startups and organizations, combining technical expertise with strong
        problem-solving skills, business insight, and user-centered design. Skilled in Python
        development with frameworks such as Flask and FastAPI, cloud integrations with AWS, and
        modern full stack technologies including React, Angular, and Nodejs.
      </p>
    </>
  );
  const five = (
    <a className="email-link" href="/angelo-v2.pdf" target="_blank" rel="noreferrer">
      View Resume
    </a>
  );

  const items = [one, two, three, four, five];

  return (
    <StyledHeroSection>
      {prefersReducedMotion ? (
        <>
          {items.map((item, i) => (
            <div key={i}>{item}</div>
          ))}
        </>
      ) : (
        <TransitionGroup component={null}>
          {isMounted &&
            items.map((item, i) => (
              <CSSTransition key={i} classNames="fadeup" timeout={loaderDelay}>
                <div style={{ transitionDelay: `${i + 1}00ms` }}>{item}</div>
              </CSSTransition>
            ))}
        </TransitionGroup>
      )}
    </StyledHeroSection>
  );
};

export default Hero;
