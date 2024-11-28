import React, { useState, useEffect, useRef } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const StyledGallerySection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;

  h2 {
    font-size: clamp(24px, 5vw, var(--fz-heading));
  }

  .gallery-grid {
    ${({ theme }) => theme.mixins.resetList};
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    grid-gap: 15px;
    position: relative;
    margin-top: 50px;
  }

  .more-button {
    ${({ theme }) => theme.mixins.button};
    margin: 80px auto 0;
  }
`;

const StyledPhoto = styled.li`
  position: relative;
  cursor: pointer;
  transition: var(--transition);

  .photo-inner {
    ${({ theme }) => theme.mixins.boxShadow};
    position: relative;
    height: 80%;
    padding: 0;
    border-radius: var(--border-radius);
    overflow: hidden;
    transition: var(--transition);

    &:hover {
      transform: scale(1.05);
    }

    img {
      width: 100%;
      height: auto;
      display: block;
    }

    .photo-description {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.7);
      color: var(--light-slate);
      padding: 5px;
      font-size: var(--fz-sm);
      text-align: center;
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

  if (!data.photos || !data.photos.edges) {
    console.error('Error: No images found in the specified directory');
    return <div>No images found</div>;
  }

  const [showMore, setShowMore] = useState(false);
  const revealTitle = useRef(null);
  const revealPhotos = useRef([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    sr.reveal(revealTitle.current, {});
    revealPhotos.current.forEach((ref, i) => sr.reveal(ref, {}, i * 100));
  }, []);

  const GRID_LIMIT = 6;
  const photos = data.photos.edges.filter(({ node }) => node);
  const firstSix = photos.slice(0, GRID_LIMIT);
  const photosToShow = showMore ? photos : firstSix;

  return (
    <StyledGallerySection>
      <h2 className="numbered-heading" ref={revealTitle}>
        Some things from my life in pictures
      </h2>

      <ul className="gallery-grid">
        <TransitionGroup component={null}>
          {photosToShow.map(({ node }, i) => (
            <CSSTransition
              key={i}
              classNames="fadeup"
              timeout={300}
              exit={false}>
              <StyledPhoto
                ref={el => (revealPhotos.current[i] = el)}>
                <div className="photo-inner">
                  <img
                    src={node.childImageSharp.gatsbyImageData.images.fallback.src}
                    alt={node.name}
                  />
                  <div className="photo-description">{node.name}</div>
                </div>
              </StyledPhoto>
            </CSSTransition>
          ))}
        </TransitionGroup>
      </ul>

      {photos.length > GRID_LIMIT && (
        <button className="more-button" onClick={() => setShowMore(!showMore)}>
          {showMore ? 'Show Less' : 'Show More'}
        </button>
      )}
    </StyledGallerySection>
  );
};

export default Gallery;
