import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';
import styled from 'styled-components';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';
import { useLanguage } from '../../hooks/LanguageContext';
import { srConfig } from '../../config';

const StyledGallerySection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 4rem;

  h2 {
    font-size: clamp(24px, 5vw, var(--fz-heading));
    margin-bottom: 2rem;
  }

  .gallery-wrapper {
    width: 100%;
    max-width: 1100px;
    overflow-x: auto;
    overflow-y: hidden;
    display: flex;
    gap: 30px;
    scroll-behavior: smooth;
    padding-bottom: 1rem;
    -ms-overflow-style: none;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }

  .photo-card {
    flex: 0 0 350px;
    position: relative;
    border-radius: var(--border-radius);
    overflow: hidden;
    transition: transform 0.4s ease;
    box-shadow: 0 10px 30px -15px var(--bg-color-shadow);
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--light-bg-color);
    cursor: pointer;

    @media (max-width: 768px) {
      flex: 0 0 280px;
    }
  }

  .photo-card:hover {
    transform: scale(1.04);
  }

  .photo-card.no-motion:hover {
    transform: none;
  }

  .photo-card img,
  .photo-card .gatsby-image-wrapper {
    width: 100%;
    height: 400px;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    .photo-card img,
    .photo-card .gatsby-image-wrapper {
      height: 320px;
    }
  }

  .photo-card {
    border: none;
    font: inherit;
    text-align: left;
  }

  .photo-description {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: var(--light-bg-color);
    color: var(--lightest-text-color);
    padding: 10px;
    font-size: var(--fz-sm);
    text-align: center;
    backdrop-filter: blur(4px);
  }

  .scroll-buttons {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 1.5rem;

    button {
      background: none;
      border: 2px solid var(--lightest-bg-color);
      color: var(--primary-color);
      padding: 8px 14px;
      border-radius: 6px;
      font-size: 1.25rem;
      cursor: pointer;
      transition: var(--transition);

      &:hover {
        background: var(--primary-color-tint);
        border-color: var(--primary-color);
      }
    }
  }

  .gallery-more {
    margin-top: 1.5rem;

    button {
      font-family: var(--font-mono);
      font-size: var(--fz-sm);
      color: var(--primary-color);
      background: none;
      border: none;
      padding: 8px 0;
      cursor: pointer;
      text-decoration: underline;
      text-underline-offset: 3px;

      &:hover {
        opacity: 0.85;
      }
    }
  }
`;

const LightboxOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: rgba(2, 12, 27, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  cursor: pointer;
`;

const LightboxContent = styled.div`
  max-width: 90vw;
  max-height: 90vh;
  cursor: default;

  img,
  .gatsby-image-wrapper {
    max-width: 90vw;
    max-height: 85vh;
    width: auto;
    height: auto;
    object-fit: contain;
    border-radius: var(--border-radius);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  }
`;

const LightboxCaption = styled.p`
  margin-top: 12px;
  font-family: var(--font-mono);
  font-size: var(--fz-sm);
  color: var(--text-color);
  text-align: center;
`;

const LightboxNav = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: var(--light-bg-color);
  border: 1px solid var(--lightest-bg-color);
  color: var(--primary-color);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);

  &:hover {
    background: var(--primary-color-tint);
  }

  &.prev {
    left: 20px;
  }
  &.next {
    right: 20px;
  }
`;

const Gallery = () => {
  const data = useStaticQuery(graphql`
    query GalleryPhotos {
      photos: allFile(
        filter: {
          relativeDirectory: { eq: "gallery" }
          extension: { regex: "/(jpg|jpeg|png|webp)/" }
        }
      ) {
        edges {
          node {
            childImageSharp {
              gatsbyImageData(layout: FULL_WIDTH, placeholder: BLURRED)
            }
            name
          }
        }
      }
    }
  `);

  const photos = data?.photos?.edges || [];
  const { t } = useLanguage();
  const revealContainer = useRef(null);
  const scrollRef = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const orderedPhotos = useMemo(
    () => [...photos].sort((a, b) => (a.node.name || '').localeCompare(b.node.name || '')),
    [photos],
  );

  useEffect(() => {
    if (prefersReducedMotion) {return;}
    sr.reveal(revealContainer.current, srConfig());
  }, [prefersReducedMotion]);

  const scroll = useCallback(direction => {
    if (!scrollRef.current) {return;}
    const amount = direction === 'left' ? -380 : 380;
    scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  }, []);

  const handleKeyDown = useCallback(
    e => {
      if (lightboxIndex === null) {return;}
      if (e.key === 'Escape') {setLightboxIndex(null);}
      if (e.key === 'ArrowLeft') {setLightboxIndex(i => (i <= 0 ? orderedPhotos.length - 1 : i - 1));}
      if (e.key === 'ArrowRight') {setLightboxIndex(i => (i >= orderedPhotos.length - 1 ? 0 : i + 1));}
    },
    [lightboxIndex, orderedPhotos.length],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const openLightbox = index => setLightboxIndex(index);
  const closeLightbox = e => {
    if (e.target === e.currentTarget) {setLightboxIndex(null);}
  };

  if (photos.length === 0) {
    return (
      <StyledGallerySection id="gallery" ref={revealContainer}>
        <h2 className="numbered-heading">{t('gallery_text_title')}</h2>
        <p style={{ color: 'var(--text-color)', fontFamily: 'var(--font-mono)' }}>
          {t('gallery_empty')}
        </p>
      </StyledGallerySection>
    );
  }

  const currentLightboxNode = lightboxIndex !== null ? orderedPhotos[lightboxIndex]?.node : null;

  return (
    <StyledGallerySection id="gallery" ref={revealContainer}>
      <h2 className="numbered-heading">{t('gallery_text_title')}</h2>

      <div className="gallery-wrapper" ref={scrollRef} role="list">
        {orderedPhotos.map(({ node }, i) => {
          const imageData = node.childImageSharp?.gatsbyImageData;
          if (!imageData) {return null;}
          const fullIndex = orderedPhotos.findIndex(p => p.node === node);

          return (
            <button
              type="button"
              className={`photo-card ${prefersReducedMotion ? 'no-motion' : ''}`}
              key={node.name || i}
              onClick={() => openLightbox(fullIndex)}
              aria-label={t('gallery_open_lightbox')}>
              <GatsbyImage image={imageData} alt={node.name || ''} />
              <span className="photo-description">{node.name || ''}</span>
            </button>
          );
        })}
      </div>

      <div className="scroll-buttons">
        <button type="button" onClick={() => scroll('left')} aria-label={t('gallery_scroll_left')}>
          ←
        </button>
        <button
          type="button"
          onClick={() => scroll('right')}
          aria-label={t('gallery_scroll_right')}>
          →
        </button>
      </div>

      {lightboxIndex !== null && currentLightboxNode && (
        <LightboxOverlay
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label={t('gallery_lightbox_label')}>
          <LightboxContent onClick={e => e.stopPropagation()}>
            {orderedPhotos.length > 1 && (
              <>
                <LightboxNav
                  type="button"
                  className="prev"
                  onClick={e => {
                    e.stopPropagation();
                    setLightboxIndex(i => (i <= 0 ? orderedPhotos.length - 1 : i - 1));
                  }}
                  aria-label={t('gallery_prev')}>
                  ←
                </LightboxNav>
                <LightboxNav
                  type="button"
                  className="next"
                  onClick={e => {
                    e.stopPropagation();
                    setLightboxIndex(i => (i >= orderedPhotos.length - 1 ? 0 : i + 1));
                  }}
                  aria-label={t('gallery_next')}>
                  →
                </LightboxNav>
              </>
            )}
            {currentLightboxNode.childImageSharp?.gatsbyImageData ? (
              <GatsbyImage
                image={currentLightboxNode.childImageSharp.gatsbyImageData}
                alt={currentLightboxNode.name || ''}
              />
            ) : null}
            <LightboxCaption>{currentLightboxNode.name || ''}</LightboxCaption>
          </LightboxContent>
        </LightboxOverlay>
      )}
    </StyledGallerySection>
  );
};

export default Gallery;
