/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

import React from 'react';
import { LanguageProvider } from './src/hooks/LanguageContext';
import { AuroraBackground } from './src/components/fx';

export const wrapRootElement = ({ element }) => (
  <LanguageProvider>
    <AuroraBackground />
    {element}
  </LanguageProvider>
);
