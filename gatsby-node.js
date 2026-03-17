/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const crypto = require('crypto');
const Parser = require('rss-parser');

// Define FeedBlog so the type exists even when RSS returns no items
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  createTypes(`
    type FeedBlog implements Node {
      id: ID!
      title: String
      link: String
      pubDate: String
      content: String
      guid: String
    }
  `);
};

// Source blog from RSS; on 404 or error we create no nodes (build does not fail)
exports.sourceNodes = async ({ actions, createNodeId }) => {
  const url = process.env.GATSBY_BLOG_RSS_URL || 'https://angelortizv.com/index.xml';
  const { createNode } = actions;
  const parser = new Parser();

  try {
    const feed = await parser.parseURL(url);
    const items = feed.items || [];
    items.forEach(item => {
      const nodeId = createNodeId(item.guid || item.link || item.title || Math.random().toString());
      const digest = crypto.createHash('md5').update(JSON.stringify(item)).digest('hex');
      createNode({
        id: nodeId,
        parent: null,
        children: [],
        title: item.title || '',
        link: item.link || '',
        pubDate: item.pubDate || item.isoDate || '',
        content: item.content || item['content:encoded'] || '',
        guid: item.guid || '',
        internal: {
          type: 'FeedBlog',
          contentDigest: digest,
        },
      });
    });
  } catch (err) {
    // 404, network error, or invalid feed: do not throw so build succeeds
    console.warn('[gatsby-node] Blog RSS unavailable:', err.message || err);
  }
};

// Expose build date to client for footer "last updated"
if (typeof process !== 'undefined') {
  process.env.GATSBY_BUILD_DATE = new Date().toISOString();
}

const path = require('path');

// https://www.gatsbyjs.org/docs/node-apis/#onCreateWebpackConfig
exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  // https://www.gatsbyjs.org/docs/debugging-html-builds/#fixing-third-party-modules
  if (stage === 'build-html' || stage === 'develop-html') {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /scrollreveal/,
            use: loaders.null(),
          },
          {
            test: /animejs/,
            use: loaders.null(),
          },
          {
            test: /miniraf/,
            use: loaders.null(),
          },
        ],
      },
    });
  }

  actions.setWebpackConfig({
    resolve: {
      alias: {
        '@components': path.resolve(__dirname, 'src/components'),
        '@config': path.resolve(__dirname, 'src/config'),
        '@fonts': path.resolve(__dirname, 'src/fonts'),
        '@hooks': path.resolve(__dirname, 'src/hooks'),
        '@images': path.resolve(__dirname, 'src/images'),
        '@pages': path.resolve(__dirname, 'src/pages'),
        '@styles': path.resolve(__dirname, 'src/styles'),
        '@utils': path.resolve(__dirname, 'src/utils'),
      },
    },
  });
};
