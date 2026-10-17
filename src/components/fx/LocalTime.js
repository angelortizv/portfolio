import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.35; }
`;

const Pill = styled.p`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 7px 14px;
  border: 1px solid var(--outline-light);
  border-radius: 999px;
  background: var(--signal-color-tint);
  backdrop-filter: blur(8px);
  font-family: var(--font-mono);
  font-size: var(--fz-xxs);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--light-text-color);
  white-space: nowrap;

  /* doubled selector: the hero's own p margin rule would otherwise win */
  && {
    margin: 0 0 40px 4px;
  }

  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--signal-color);
    animation: ${pulse} 2s ease-in-out infinite;

    @media (prefers-reduced-motion: reduce) {
      animation: none;
    }
  }
`;

const format = (zone, locale) => {
  const parts = new Intl.DateTimeFormat(locale, {
    timeZone: zone,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date());
  const get = type => (parts.find(p => p.type === type) || {}).value || '';
  return `${get('weekday').replace('.', '')} ${get('hour')}:${get('minute')}`;
};

// Live local time for a fixed place. Rendered only on the client so the server and the
// browser can never disagree (and the visitor's own time zone never leaks in).
const LocalTime = ({ place, zone, offset, locale }) => {
  const [now, setNow] = useState('');

  useEffect(() => {
    const tick = () => setNow(format(zone, locale));
    tick();
    const id = window.setInterval(tick, 15000);
    return () => window.clearInterval(id);
  }, [zone, locale]);

  if (!now) {
    return null;
  }

  return (
    <Pill>
      <span className="dot" aria-hidden="true" />
      <span>
        {place} {now} · {offset}
      </span>
    </Pill>
  );
};

LocalTime.propTypes = {
  place: PropTypes.string.isRequired,
  zone: PropTypes.string.isRequired,
  offset: PropTypes.string.isRequired,
  locale: PropTypes.string,
};

export default LocalTime;
