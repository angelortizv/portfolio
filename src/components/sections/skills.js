import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { Icon } from '@components/icons';
import { useLanguage } from '../../hooks/LanguageContext';

const StyledSkillsSection = styled.section`
  max-width: 1000px;
  margin: 0 auto;

  .skills-intro {
    margin: -10px 0 32px;
    color: var(--light-text-color);
    font-size: var(--fz-lg);
    line-height: 1.5;
    max-width: 540px;
  }

  .skills-groups {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    border-top: 1px solid var(--outline-light);

    @media (max-width: 900px) {
      grid-template-columns: 1fr;
    }
  }
`;

const Group = styled.div`
  padding: 28px 28px 8px 0;

  & + & {
    padding-left: 28px;
    border-left: 1px solid var(--outline-light);
  }

  @media (max-width: 900px) {
    padding: 24px 0 4px;

    & + & {
      padding-left: 0;
      border-left: 0;
      border-top: 1px solid var(--outline-light);
    }
  }

  h3 {
    margin: 0 0 18px;
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--signal-color);
  }
`;

const SkillList = styled.ul`
  ${({ theme }) => theme.mixins.resetList};
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const SkillPill = styled.li`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px 8px 10px;
  background: var(--highlight-tint);
  border: 1px solid var(--outline-light);
  border-radius: 999px;
  color: var(--light-text-color);
  font-family: var(--font-mono);
  font-size: var(--fz-xs);
  transition: var(--transition);
  cursor: default;

  .pill-icon {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    color: var(--light-text-color);
    transition: var(--transition);

    /* one accent: icons rest in monochrome and regain their color on hover */
    svg {
      filter: grayscale(1) brightness(1.25);
      opacity: 0.8;
      transition: var(--transition);
    }
  }

  &:hover {
    border-color: var(--primary-color);
    color: var(--primary-color);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px -4px var(--primary-color-tint);

    .pill-icon svg {
      filter: none;
      opacity: 1;
    }
  }
`;

// Icon component expects exact names (e.g. 'REST API', 'AWS', 'CI/CD')
const SKILL_GROUPS = [
  {
    titleKey: 'skills_text_ai',
    skills: [
      'LLM Agents',
      'Claude',
      'OpenAI',
      'Gemini',
      'Evals',
      'Python',
      'PyTorch',
      'scikit-learn',
    ],
  },
  {
    titleKey: 'skills_text_backend',
    skills: ['FastAPI', 'Node.js', 'REST API', 'PostgreSQL', 'Real-Time Systems', 'System Design'],
  },
  {
    titleKey: 'skills_text_frontend',
    skills: ['TypeScript', 'React', 'AWS', 'Docker', 'CI/CD'],
  },
];

const Skills = () => {
  const revealContainer = useRef(null);
  const { t } = useLanguage();

  useEffect(() => {
    if (sr) {
      sr.reveal(revealContainer.current, srConfig());
    }
  }, []);

  return (
    <StyledSkillsSection id="skills" ref={revealContainer}>
      <h2 className="numbered-heading">{t('skills_text_title')}</h2>
      <p className="skills-intro">{t('skills_text_subtitle')}</p>

      <div className="skills-groups">
        {SKILL_GROUPS.map(({ titleKey, skills }) => (
          <Group key={titleKey}>
            <h3>{t(titleKey)}</h3>
            <SkillList>
              {skills.map(skill => (
                <SkillPill key={skill}>
                  <span className="pill-icon" aria-hidden="true">
                    <Icon name={skill} />
                  </span>
                  <span>{skill}</span>
                </SkillPill>
              ))}
            </SkillList>
          </Group>
        ))}
      </div>
    </StyledSkillsSection>
  );
};

export default Skills;
