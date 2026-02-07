import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { Icon } from '@components/icons';
import { useLanguage } from '../../hooks/LanguageContext';

const StyledSkillsSection = styled.section`
  max-width: 900px;
  margin: 0 auto;

  .skills-intro {
    margin: -10px 0 40px;
    color: var(--light-text-color);
    font-size: var(--fz-lg);
    line-height: 1.5;
    max-width: 540px;
  }
`;

const CategoryCard = styled.article`
  background: var(--light-bg-color);
  border: 1px solid var(--outline-light);
  border-radius: var(--border-radius);
  padding: 1.5rem 1.75rem;
  margin-bottom: 1.25rem;
  transition: var(--transition);

  &:hover {
    border-color: var(--primary-color-tint);
    box-shadow: 0 4px 20px -2px var(--primary-color-tint);
  }
`;

const CategoryHeader = styled.header`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--outline-light);

  .category-accent {
    width: 4px;
    height: 24px;
    border-radius: 2px;
    background: var(--primary-color);
  }

  h3 {
    margin: 0;
    font-size: var(--fz-md);
    font-family: var(--font-mono);
    color: var(--primary-color);
    font-weight: 500;
  }
`;

const SkillGrid = styled.ul`
  ${({ theme }) => theme.mixins.resetList};
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const SkillPill = styled.li`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: var(--bg-color);
  border: 1px solid var(--outline-light);
  border-radius: var(--border-radius);
  color: var(--light-text-color);
  font-family: var(--font-mono);
  font-size: var(--fz-xs);
  transition: var(--transition);
  cursor: default;

  .pill-icon {
    flex-shrink: 0;
    width: 22px;
    height: 22px;
    color: var(--light-text-color);
    transition: var(--transition);
  }

  &:hover {
    border-color: var(--primary-color);
    color: var(--primary-color);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px -4px var(--primary-color-tint);

    .pill-icon {
      color: var(--primary-color);
    }
  }
`;

// Icon component expects exact names (e.g. 'HTML', 'CSS', 'REST API', 'GCP', 'AWS')
const SKILL_CATEGORIES = {
  dw: ['TypeScript', 'React', 'Gatsby', 'Angular', 'GraphQL', 'HTML', 'CSS', 'REST API'],
  ds: ['Python', 'Tableau', 'PostgreSQL', 'R'],
  di: ['AWS', 'GCP', 'Docker', 'Git', 'Firebase', 'Jenkins'],
  ml: ['Python', 'TensorFlow', 'PyTorch', 'scikit-learn', 'Jupyter'],
};

const Skills = () => {
  const revealContainer = useRef(null);
  const { t } = useLanguage();

  useEffect(() => {
    if (sr) {
      sr.reveal(revealContainer.current, srConfig());
    }
  }, []);

  const categoryKeys = [
    { key: 'dw', titleKey: 'skills_text_dw' },
    { key: 'ds', titleKey: 'skills_text_ds' },
    { key: 'ml', titleKey: 'skills_text_ml' },
    { key: 'di', titleKey: 'skills_text_di' },
  ];

  return (
    <StyledSkillsSection id="skills" ref={revealContainer}>
      <h2 className="numbered-heading">{t('skills_text_title')}</h2>
      <p className="skills-intro">{t('skills_text_subtitle')}</p>

      {categoryKeys.map(({ key, titleKey }) => (
        <CategoryCard key={key}>
          <CategoryHeader>
            <div className="category-accent" aria-hidden="true" />
            <h3>{t(titleKey)}</h3>
          </CategoryHeader>
          <SkillGrid>
            {SKILL_CATEGORIES[key].map(skill => (
              <SkillPill key={skill}>
                <span className="pill-icon" aria-hidden="true">
                  <Icon name={skill} />
                </span>
                <span>{skill}</span>
              </SkillPill>
            ))}
          </SkillGrid>
        </CategoryCard>
      ))}
    </StyledSkillsSection>
  );
};

export default Skills;
