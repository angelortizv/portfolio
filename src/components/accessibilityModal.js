import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import IconZoomIn from './icons/IconZoomIn';
import IconZoomOut from './icons/IconZoomOut';
import IconCursor from './icons/IconCursor';
import { useLanguage } from '../hooks/LanguageContext';
import { useKeyboardShortcuts } from '../hooks/KeyboardShortcutsContext';
import IconRevert from './icons/IconRevert';
import IconGrayscale from './icons/IconGrayscale';
import IconInvert from './icons/IconInvert';

const modalStyles = {
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'var(--bg-color, #fff)',
    color: 'var(--text-color, #000)',
    padding: '2rem',
    borderRadius: '12px',
    maxWidth: '420px',
    width: '90%',
    textAlign: 'center',
    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1rem',
    justifyItems: 'center',
    marginTop: '1.5rem',
    marginBottom: '1.5rem',
  },
  button: {
    background: 'var(--highlight-tint, #f0f0f0)',
    border: 'none',
    borderRadius: '20px',
    width: '160px',
    height: '90px',
    display: 'flex',
    cursor: 'pointer',
    transition: 'background 0.2s ease',
  },
  buttonHover: {
    background: 'var(--primary-color, #64ffda)',
  },
  label: {
    marginTop: '0.25rem',
    fontSize: '0.85rem',
    color: 'var(--text-color, #333)',
  },
  closeButton: {
    marginTop: '1rem',
    padding: '0.5rem 1.25rem',
    cursor: 'pointer',
    borderRadius: '6px',
    border: '1px solid var(--primary-color, #64ffda)',
    background: 'none',
    color: 'var(--primary-color, #64ffda)',
    transition: 'all 0.2s ease',
  },
};

const STYLE_ID = 'big-cursor-style';

const AccessibilityModal = ({ isOpen, onClose }) => {
  const [bigCursor, setBigCursor] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const { t } = useLanguage();
  const { openShortcuts } = useKeyboardShortcuts();

  const [isGrayscale, setIsGrayscale] = useState(false);
  const [isInverted, setIsInverted] = useState(false);

  useEffect(() => {
    document.documentElement.style.filter = isGrayscale ? 'grayscale(100%)' : 'none';
  }, [isGrayscale]);

  useEffect(() => {
    const currentFilter = document.documentElement.style.filter || '';
    const hasGrayscale = currentFilter.includes('grayscale');
    const newFilter = isInverted
      ? `${hasGrayscale ? 'grayscale(100%) ' : ''}invert(100%) hue-rotate(180deg)`
      : hasGrayscale
        ? 'grayscale(100%)'
        : 'none';

    document.documentElement.style.filter = newFilter;
  }, [isInverted, isGrayscale]);

  // === Large Cursor ===
  useEffect(() => {
    const applyBigCursor = () => {
      const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 32 32' aria-hidden='true' role='img'>
                        <path
                            d='M6 5 L6 25 L11 20 L15 30 L18 29 L14 19 L21 19 L6 5 Z'
                            fill='#ffffff'
                            stroke='#0b1220'
                            stroke-width='0.9'
                            stroke-linejoin='round'
                            stroke-linecap='round'
                        />
                    </svg>`;

      const uri = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
      const css = `
                .big-cursor, .big-cursor * {
                cursor: url("${uri}") 24 24, auto !important;
                }

                .big-cursor button,
                .big-cursor a,
                .big-cursor [role="button"],
                .big-cursor input,
                .big-cursor textarea {
                cursor: pointer !important;
                }
            `;

      let styleEl = document.getElementById(STYLE_ID);
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = STYLE_ID;
        document.head.appendChild(styleEl);
      }
      styleEl.textContent = css;

      document.documentElement.classList.add('big-cursor');
    };

    const removeBigCursor = () => {
      const styleEl = document.getElementById(STYLE_ID);
      if (styleEl && styleEl.parentNode) {styleEl.parentNode.removeChild(styleEl);}
      document.documentElement.classList.remove('big-cursor');
    };

    if (bigCursor) {
      applyBigCursor();
    } else {
      removeBigCursor();
    }

    return () => {
      removeBigCursor();
    };
  }, [bigCursor]);

  // === Zoom ===
  useEffect(() => {
    //document.documentElement.style.fontSize = `${zoomLevel * 100}%`;
    document.body.style.zoom = zoomLevel;
  }, [zoomLevel]);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 2)); // máx 200%
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.5)); // mín 50%
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  if (!isOpen) {return null;}

  return (
    /* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */
    <div
      style={modalStyles.backdrop}
      onClick={onClose}
      onKeyDown={e => {
        if (e.key === 'Escape') {onClose();}
      }}
      role="presentation">
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <div
        style={modalStyles.modal}
        onClick={e => e.stopPropagation()}
        onKeyDown={e => {
          if (e.key === 'Escape') {onClose();}
          e.stopPropagation();
        }}
        role="dialog"
        aria-modal="true">
        <h2>{t('accessibility_text_title')}</h2>

        <div style={modalStyles.grid}>
          {/* Zoom In */}
          <div>
            <button
              style={modalStyles.button}
              onClick={handleZoomIn}
              title={t('accessibility_text_zoomIn')}>
              <IconZoomIn />
            </button>
            <div style={modalStyles.label}>{t('accessibility_text_zoomIn')}</div>
          </div>

          {/* Zoom Out */}
          <div>
            <button
              style={modalStyles.button}
              onClick={handleZoomOut}
              title={t('accessibility_text_zoomOut')}>
              <IconZoomOut />
            </button>
            <div style={modalStyles.label}>{t('accessibility_text_zoomOut')}</div>
          </div>

          {/* Grayscale */}
          <div>
            <button
              style={modalStyles.button}
              onClick={() => setIsGrayscale(prev => !prev)}
              title={t('accessibility_text_grayscale')}>
              <IconGrayscale />
            </button>
            <div style={modalStyles.label}>{t('accessibility_text_grayscale')}</div>
          </div>

          {/* Invert */}
          <div>
            <button
              style={modalStyles.button}
              onClick={() => setIsInverted(!isInverted)}
              title={t('accessibility_text_invert')}>
              <IconInvert />
            </button>
            <div style={modalStyles.label}>{t('accessibility_text_invert')}</div>
          </div>

          {/* Cursor */}
          <div>
            <button
              style={modalStyles.button}
              onClick={() => setBigCursor(!bigCursor)}
              title={t('accessibility_text_biggerCursor')}>
              <IconCursor />
            </button>
            <div style={modalStyles.label}>{t('accessibility_text_biggerCursor')}</div>
          </div>

          {/* Undo */}
          <div>
            <button
              style={modalStyles.button}
              onClick={() => {
                setBigCursor(false);
                handleResetZoom();
                setIsGrayscale(false);
                setIsInverted(false);
              }}
              title={t('accessibility_text_undoChanges')}>
              <IconRevert />
            </button>
            <div style={modalStyles.label}>{t('accessibility_text_undoChanges')}</div>
          </div>
        </div>

        <div style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>
          <button
            type="button"
            style={{ ...modalStyles.closeButton, marginRight: '8px' }}
            onClick={() => {
              onClose();
              openShortcuts();
            }}
            title={t('shortcuts_title')}>
            {t('accessibility_text_shortcuts')}
          </button>
        </div>

        <button style={modalStyles.closeButton} onClick={onClose}>
          {t('general_close')}
        </button>
      </div>
    </div>
  );
};

AccessibilityModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AccessibilityModal;
