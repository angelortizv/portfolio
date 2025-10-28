import React, { useEffect, useState } from 'react';
import IconZoomIn from './icons/IconZoomIn';
import IconZoomOut from './icons/IconZoomOut';
import IconCursor from './icons/IconCursor';
import { useLanguage } from '../hooks/LanguageContext';
import IconRevert from './icons/IconRevert';

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


    // === Large Cursor ===
    useEffect(() => {
        const applyBigCursor = () => {
            const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='90' height='90' viewBox='0 0 48 48' fill='#3b83f6'>
                <circle cx='24' cy='24' r='18' fill-opacity='0.85' />
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
            if (styleEl && styleEl.parentNode) styleEl.parentNode.removeChild(styleEl);
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
        document.documentElement.style.fontSize = `${zoomLevel * 100}%`;
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


    if (!isOpen) return null;


    return (
        <div style={modalStyles.backdrop} onClick={onClose}>
            <div style={modalStyles.modal} onClick={e => e.stopPropagation()}>
                <h2>{t("accessibility_text_title")}</h2>

                <div style={modalStyles.grid}>
                    {/* Zoom In */}
                    <div>
                        <button
                            style={modalStyles.button}
                            onClick={handleZoomIn}
                            title={t("accessibility_text_zoomIn")}
                        >
                            <IconZoomIn />
                        </button>
                        <div style={modalStyles.label}>{t("accessibility_text_zoomIn")}</div>
                    </div>

                    {/* Zoom Out */}
                    <div>
                        <button
                            style={modalStyles.button}
                            onClick={handleZoomOut}
                            title={t("accessibility_text_zoomOut")}
                        >
                            <IconZoomOut />
                        </button>
                        <div style={modalStyles.label}>{t("accessibility_text_zoomOut")}</div>
                    </div>

                    {/* Cursor */}
                    <div>
                        <button
                            style={modalStyles.button}
                            onClick={() => setBigCursor(!bigCursor)}
                            title={t("accessibility_text_biggerCursor")}
                        >
                            <IconCursor />
                        </button>
                        <div style={modalStyles.label}>{t("accessibility_text_biggerCursor")}</div>
                    </div>


                    {/* Undo */}
                    <div>
                        <button
                            style={modalStyles.button}
                            onClick={() => { setBigCursor(false); handleResetZoom(); }}
                            title={t("accessibility_text_undoChanges")}
                        >
                            <IconRevert />
                        </button>
                        <div style={modalStyles.label}>{t("accessibility_text_undoChanges")}</div>
                    </div>

                </div>

                <button style={modalStyles.closeButton} onClick={onClose}>
                    {t("general_close")}
                </button>
            </div>
        </div>
    );
};

export default AccessibilityModal;
