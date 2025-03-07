import React from 'react';
import styled from 'styled-components';
import { Icon } from '@components/icons';
import { socialMedia } from '@config';

const StyledFooter = styled.footer`
  ${({ theme }) => theme.mixins.flexCenter};
  flex-direction: column; /* Stack items vertically */
  margin-top: 20px; /* Space above the footer to separate it from the content */
  height: auto;
  min-height: 70px;
  padding: 15px;
  text-align: center;
`;

const StyledSocialLinks = styled.div`
  display: block; /* Always show the social links */
  width: 100%;
  max-width: 270px;
  margin: 0 auto;

  ul {
    ${({ theme }) => theme.mixins.flexBetween};
    padding: 0;
    margin: 0;
    list-style: none;

    li {
      margin: 0 10px; /* Space between the icons */
    }

    a {
      padding: 10px;
      svg {
        width: 24px; /* Slightly increase icon size for better visibility */
        height: 24px;
        transition: transform 0.2s ease;

        &:hover {
          transform: scale(1.2); /* Add hover effect for icons */
        }
      }
    }
  }
`;

const AboutFooter = () => (
  <StyledFooter>
    <StyledSocialLinks>
      <ul>
        {socialMedia &&
          socialMedia.map(({ name, url }, i) => (
            <li key={i}>
              <a href={url} aria-label={name} target="_blank" rel="noopener noreferrer">
                <Icon name={name} />
              </a>
            </li>
          ))}
      </ul>
    </StyledSocialLinks>
  </StyledFooter>
);

export default AboutFooter;