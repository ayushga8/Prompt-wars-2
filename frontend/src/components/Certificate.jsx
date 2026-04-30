/**
 * @module components/Certificate
 * @description PDF certificate generator for course completion.
 * Renders a visually styled certificate on an HTML Canvas element,
 * converts it to a PDF using jsPDF, and triggers a download.
 * Supports English and Hindi certificate languages.
 */

import { useState, useCallback } from 'react';
import { jsPDF } from 'jspdf';
import confetti from 'canvas-confetti';
import PropTypes from 'prop-types';
import { useLanguage } from '../i18n/LanguageContext';
import en from '../i18n/en';
import hi from '../i18n/hi';

/** @constant {Object} certStrings - Certificate text strings indexed by language code */
const certStrings = { en, hi };

/** @constant {number} CANVAS_WIDTH - Certificate canvas width in pixels */
const CANVAS_WIDTH = 1000;

/** @constant {number} CANVAS_HEIGHT - Certificate canvas height in pixels */
const CANVAS_HEIGHT = 700;

/**
 * Certificate component that generates and downloads a PDF certificate.
 * Locked state is shown when not all modules are completed.
 *
 * @param {Object} props
 * @param {string} props.userName - The user's display name for the certificate
 * @param {number} props.badgeCount - Number of badges earned so far
 * @param {number} props.totalModules - Total number of earnable modules
 * @returns {JSX.Element} Certificate UI (locked or ready state)
 */
export default function Certificate({ userName, badgeCount, totalModules }) {
  const { t } = useLanguage();
  const allComplete = badgeCount >= totalModules;
  const [certLang, setCertLang] = useState('en');

  /**
   * Generates the certificate as a Canvas image, converts to PDF, and triggers download.
   * Fires confetti animation on successful generation.
   */
  const handleDownload = useCallback(() => {
    const ct = certStrings[certLang] || en;
    const canvas = document.createElement('canvas');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    const ctx = canvas.getContext('2d');

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    grad.addColorStop(0, '#0b1120');
    grad.addColorStop(1, '#1a1a3e');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Outer border
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, 940, 640);

    // Inner decorative border
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.5)';
    ctx.lineWidth = 1;
    ctx.strokeRect(40, 40, 920, 620);

    // Title
    ctx.fillStyle = '#3b82f6';
    ctx.font = 'bold 42px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(ct.certTitle, 500, 120);

    // Subtitle
    ctx.fillStyle = '#94a3b8';
    ctx.font = '18px Inter, sans-serif';
    ctx.fillText(ct.certProgram, 500, 160);

    // Decorative line
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(300, 185);
    ctx.lineTo(700, 185);
    ctx.stroke();

    // "This certifies that"
    ctx.fillStyle = '#f1f5f9';
    ctx.font = '20px Inter, sans-serif';
    ctx.fillText(ct.certCertifies, 500, 240);

    // Name
    ctx.fillStyle = '#8b5cf6';
    ctx.font = 'bold 36px Outfit, sans-serif';
    ctx.fillText(userName || 'Student', 500, 300);

    // Body text
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '18px Inter, sans-serif';
    ctx.fillText(ct.certBody1, 500, 360);
    ctx.fillText(ct.certBody2, 500, 390);
    ctx.fillText(ct.certBody3, 500, 420);

    // Badges earned
    ctx.fillStyle = '#f1f5f9';
    ctx.font = '16px Inter, sans-serif';
    ctx.fillText(ct.certBadges, 500, 480);

    // Date
    ctx.fillStyle = '#64748b';
    ctx.font = '14px Inter, sans-serif';
    ctx.fillText(`${ct.certDate}: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`, 500, 540);

    // Footer
    ctx.fillStyle = '#475569';
    ctx.font = '12px Inter, sans-serif';
    ctx.fillText(ct.certFooter, 500, 620);

    // Generate PDF from canvas
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [CANVAS_WIDTH, CANVAS_HEIGHT]
    });
    pdf.addImage(imgData, 'PNG', 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    pdf.save('election-education-certificate.pdf');

    confetti({ particleCount: 200, spread: 120, origin: { y: 0.3 }, zIndex: 1000 });
  }, [certLang, userName]);

  if (!allComplete) {
    return (
      <div className="certificate-locked">
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
        <h3>{t('certLocked')}</h3>
        <p style={{ color: 'var(--text-secondary)' }}>
          {t('certLockedMsg')(totalModules)}
        </p>
        <div className="cert-progress">
          <div className="cert-progress-bar" style={{ width: `${(badgeCount / totalModules) * 100}%` }}></div>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{t('certModulesCompleted')(badgeCount, totalModules)}</p>
      </div>
    );
  }

  return (
    <div className="certificate-ready fade-in" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎓</div>
      <h3 className="gradient-text" style={{ fontSize: '1.5rem' }}>{t('certReady')(userName)}</h3>
      <p style={{ color: 'var(--text-secondary)', margin: '1rem 0' }}>
        {t('certReadyMsg')}
      </p>
      <div className="cert-lang-select" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{t('certLanguageLabel')}</span>
        <button className={`btn small ${certLang === 'en' ? 'primary-btn' : 'outline-btn'}`} onClick={() => setCertLang('en')} style={{ minWidth: '80px' }}>
          {t('certEnglish')}
        </button>
        <button className={`btn small ${certLang === 'hi' ? 'primary-btn' : 'outline-btn'}`} onClick={() => setCertLang('hi')} style={{ minWidth: '80px' }}>
          {t('certHindi')}
        </button>
      </div>
      <button className="btn success-btn" style={{ maxWidth: '300px', margin: '0 auto' }} onClick={handleDownload}>
        {t('downloadCert')}
      </button>
    </div>
  );
}

Certificate.propTypes = {
  /** The user's display name to print on the certificate */
  userName: PropTypes.string.isRequired,
  /** Number of badges/modules the user has completed */
  badgeCount: PropTypes.number.isRequired,
  /** Total number of completable modules (excludes overview) */
  totalModules: PropTypes.number.isRequired,
};
