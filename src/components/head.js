import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { useLocation } from '@reach/router';
import { useStaticQuery, graphql } from 'gatsby';
import { socialMedia } from '@config';
import { useLanguage } from '../hooks/LanguageContext';

// https://www.gatsbyjs.com/docs/add-seo-component/

const Head = ({ title, description, image }) => {
  const { pathname } = useLocation();
  const { t, lang } = useLanguage();

  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            defaultTitle: title
            defaultDescription: description
            siteUrl
            defaultImage: image
          }
        }
      }
    `,
  );

  const { defaultTitle, defaultDescription, siteUrl, defaultImage } = site.siteMetadata;
  const metaDesc = t('meta_description') || defaultDescription;

  const seo = {
    title: title || t('meta_title') || defaultTitle,
    description: description || metaDesc,
    image: `${siteUrl}${image || defaultImage}`,
    url: `${siteUrl}${pathname}`,
  };

  // Structured data so search engines connect the site, the socials and the blog
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Angelo Ortiz Vega',
    jobTitle: 'Technical Lead, Implementations · AI Engineer',
    worksFor: { '@type': 'Organization', name: 'Silia' },
    alumniOf: { '@type': 'CollegeOrUniversity', name: 'Instituto Tecnológico de Costa Rica' },
    address: { '@type': 'PostalAddress', addressLocality: 'Cartago', addressCountry: 'CR' },
    url: siteUrl,
    image: seo.image,
    sameAs: [...(socialMedia || []).map(({ url }) => url), 'https://angelortizv.com'],
  };

  return (
    <Helmet title={title} defaultTitle={seo.title} titleTemplate={`%s | ${defaultTitle}`}>
      <html lang={lang === 'es' ? 'es' : 'en'} />

      <meta name="description" content={seo.description} />
      <meta name="image" content={seo.image} />

      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.image} />
      <meta property="og:url" content={seo.url} />
      <meta property="og:type" content="website" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={seo.title} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />

      <meta name="google-site-verification" content="DCl7VAf9tcz6eD9gb67NfkNnJ1PKRNcg8qQiwpbx9Lk" />

      <script type="application/ld+json">{JSON.stringify(personSchema)}</script>
    </Helmet>
  );
};

export default Head;

Head.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
};

Head.defaultProps = {
  title: null,
  description: null,
  image: null,
};
