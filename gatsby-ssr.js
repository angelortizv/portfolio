/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

import React from 'react';
import { LanguageProvider } from './src/hooks/LanguageContext';
import Colors from './src/styles/colors';

// Inline script so loader and first paint use saved theme (or default dark)
const themeScript = `
(function() {
  var key = 'portfolio-theme';
  var saved = typeof localStorage !== 'undefined' && localStorage.getItem(key);
  var mode = saved === 'light' ? 'light' : 'dark';
  var colors = ${JSON.stringify(Colors)};
  var root = document.documentElement;
  for (var prop in colors[mode]) {
    root.style.setProperty(prop, colors[mode][prop]);
  }
})();
`;

export const onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([
    <script key="portfolio-theme-init" dangerouslySetInnerHTML={{ __html: themeScript }} />,
  ]);
};

export const wrapRootElement = ({ element }) => <LanguageProvider>{element}</LanguageProvider>;
