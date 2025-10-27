import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Layout, Hero, About, Skills, Jobs, Featured, Projects, Gallery, Contact } from '@components';
import { LanguageProvider } from '../hooks/LanguageContext';

const StyledMainContainer = styled.main`
  counter-reset: section;
`;

const IndexPage = ({ location }) => (
  <LanguageProvider>
    <Layout location={location}>
      <StyledMainContainer className="fillHeight">
        <Hero />
        <About />
        <Skills />
        <Jobs />
        <Featured />
        <Projects />
        <Gallery />
        <Contact />
      </StyledMainContainer>
    </Layout>
  </LanguageProvider>
);

IndexPage.propTypes = {
  location: PropTypes.object.isRequired,
};

export default IndexPage;
