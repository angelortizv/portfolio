import React, { useEffect, useRef } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
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

    -ms-overflow-style: none; /* IE y Edge */
    scrollbar-width: none; /* Firefox */
    &::-webkit-scrollbar {
      display: none; /* Chrome, Safari */
    }
  }

  .photo-card {
    flex: 0 0 350px;
    position: relative;
    border-radius: var(--border-radius);
    overflow: hidden;
    transition: transform 0.4s ease;
    box-shadow: var(--box-shadow);
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--navy);
    cursor: pointer;

    &:hover {
      transform: scale(1.04);
    }

    img {
      width: 100%;
      height: 400px;
      object-fit: cover;
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
  }

  .scroll-buttons {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 1.5rem;

    button {
      background: none;
      border: 5px solid var(--light-slate);
      color: var(--primary-color);
      padding: 8px 14px;
      border-radius: 6px;
      font-size: 2rem;
      cursor: pointer;
      transition: 0.3s;

      &:hover {
        background: var(--light-slate);
        color: var(--navy);
      }
    }
  }
`;

const Gallery = () => {
  const data = useStaticQuery(graphql`
    query {
      photos: allFile(filter: { relativeDirectory: { eq: "gallery" } }) {
        edges {
          node {
            childImageSharp {
              gatsbyImageData(layout: FULL_WIDTH)
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

  useEffect(() => {
    if (prefersReducedMotion) {return;}
    sr.reveal(revealContainer.current, srConfig());
  }, []);

  if (photos.length === 0) {return <div>No images found</div>;}

  const orderedPhotos = photos.sort(() => Math.random() - 0.5);

  const scroll = direction => {
    const { current } = scrollRef;
    if (!current) {return;}
    const scrollAmount = direction === 'left' ? -400 : 400;
    current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <StyledGallerySection id="gallery" ref={revealContainer}>
      <h2 className="numbered-heading">{t('gallery_text_title')}</h2>

      <div className="gallery-wrapper" ref={scrollRef}>
        {orderedPhotos.map(({ node }, i) => {
          const imageData = node.childImageSharp?.gatsbyImageData?.images?.fallback?.src;
          if (!imageData) {return null;}

          return (
            <div className="photo-card" key={i}>
              <img src={imageData} alt={node.name} />
              <div className="photo-description">{node.name}</div>
            </div>
          );
        })}
      </div>

      <div className="scroll-buttons">
        <button onClick={() => scroll('left')}>⟵</button>
        <button onClick={() => scroll('right')}>⟶</button>
      </div>
    </StyledGallerySection>
  );
};

export default Gallery;
