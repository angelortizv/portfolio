import React, { useEffect, useRef } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import styled from 'styled-components';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';
import { useLanguage } from '../../hooks/LanguageContext';
import { srConfig } from '../../config';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Keyboard, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const StyledGallerySection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 4rem;

  h2 {
    font-size: clamp(24px, 5vw, var(--fz-heading));
    margin-bottom: 2rem;
  }

  .swiper {
    width: 100%;
    max-width: 1100px;
    border-radius: var(--border-radius);
    overflow: hidden;
  }

  .swiper-slide {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .photo-card {
    position: relative;
    width: 100%;
    height: 400px;
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
      height: 100%;
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

  .swiper-button-next,
  .swiper-button-prev {
    color: var(--lightest-slate);
    transition: 0.3s;
    &:hover {
      color: var(--primary-color);
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
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {return;}
    sr.reveal(revealContainer.current, srConfig());
  }, []);

  if (photos.length === 0) {
    return <div>No images found</div>;
  }

  const orderedPhotos = photos.sort(() => Math.random() - 0.5);

  return (
    <StyledGallerySection id="gallery" ref={revealContainer}>
      <h2 className="numbered-heading">{t('gallery_text_title')}</h2>

      <Swiper
        modules={[Navigation, Pagination, Keyboard, Autoplay]}
        navigation
        keyboard={{ enabled: true }}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        loop={true}
        slidesPerView={3}
        spaceBetween={30}
        breakpoints={{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {orderedPhotos.map(({ node }, i) => {
          const imageData = node.childImageSharp?.gatsbyImageData?.images?.fallback?.src;
          if (!imageData) {return null;}

          return (
            <SwiperSlide key={i}>
              <div className="photo-card">
                <img src={imageData} alt={node.name} />
                <div className="photo-description">{node.name}</div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </StyledGallerySection>
  );
};

export default Gallery;
