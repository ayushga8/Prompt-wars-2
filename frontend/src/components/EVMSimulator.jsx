/**
 * @module components/EVMSimulator
 * @description Interactive Electronic Voting Machine simulator replicating
 * the real Indian EVM/VVPAT experience with candidate selection, VVPAT
 * verification slip, and confetti celebration.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import PropTypes from 'prop-types';
import { useLanguage } from '../i18n/LanguageContext';

/** @constant {number} VVPAT_DISPLAY_SECONDS - Duration the VVPAT slip is visible */
const VVPAT_DISPLAY_SECONDS = 7;

/**
 * EVM Simulator component with realistic voting flow.
 * @returns {JSX.Element}
 */
export default function EVMSimulator() {
  const { t } = useLanguage();

  const candidates = [
    { name: t('candidateA'), party: t('partyA'), symbol: '🌸' },
    { name: t('candidateB'), party: t('partyB'), symbol: '🌾' },
    { name: t('candidateC'), party: t('partyC'), symbol: '🔔' },
    { name: t('nota'), party: t('partyNota'), symbol: '✖️' },
  ];

  const [step, setStep] = useState('ready');
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [vvpatVisible, setVvpatVisible] = useState(false);
  const [countdown, setCountdown] = useState(VVPAT_DISPLAY_SECONDS);
  const timerRef = useRef(null);

  /** Selects a candidate during the voting step */
  const handleVote = useCallback((idx) => {
    if (step !== 'voting') return;
    setSelectedIdx(idx);
  }, [step]);

  /** Confirms the vote, triggers VVPAT display and countdown */
  const handlePress = useCallback(() => {
    if (selectedIdx === null) return;
    setStep('vvpat');
    setVvpatVisible(true);
    setCountdown(VVPAT_DISPLAY_SECONDS);

    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setVvpatVisible(false);
          setStep('done');
          confetti({ particleCount: 200, spread: 120, origin: { y: 0.5 }, zIndex: 1000 });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [selectedIdx]);

  /** Keyboard navigation handler for EVM buttons */
  const handleKeyDown = useCallback((e, idx) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleVote(idx);
    }
  }, [handleVote]);

  /** Resets the simulator to the initial state */
  const handleReset = useCallback(() => {
    setStep('ready');
    setSelectedIdx(null);
  }, []);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  return (
    <div className="evm-simulator" role="region" aria-label="EVM Simulator">
      <h3 className="gradient-text" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{t('evmTitle')}</h3>
      <p className="evm-subtitle">{t('evmSubtitle')}</p>

      {step === 'ready' && (
        <div className="evm-start fade-in">
          <div className="evm-machine glass">
            <div className="evm-screen" aria-live="polite">
              <p>{t('evmReady')}</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{t('evmReadySub')}</p>
            </div>
          </div>
          <button className="btn primary-btn" style={{ maxWidth: '300px', margin: '1.5rem auto 0' }} onClick={() => setStep('voting')} aria-label={t('startVoting')}>
            {t('startVoting')}
          </button>
        </div>
      )}

      {step === 'voting' && (
        <div className="evm-voting fade-in">
          <div className="evm-machine glass">
            <div className="evm-header">
              <span className="evm-led blink" aria-hidden="true"></span>
              <span>{t('ballotingUnit')}</span>
            </div>
            <div className="evm-candidates" role="radiogroup" aria-label="Candidate selection">
              {candidates.map((c, i) => (
                <div key={i} className={`evm-row ${selectedIdx === i ? 'selected' : ''}`}>
                  <span className="evm-serial">{i + 1}</span>
                  <span className="evm-name">{c.name}</span>
                  <span className="evm-party">{c.party}</span>
                  <span className="evm-symbol" aria-hidden="true">{c.symbol}</span>
                  <button className={`evm-btn ${selectedIdx === i ? 'pressed' : ''}`}
                    onClick={() => handleVote(i)} onKeyDown={(e) => handleKeyDown(e, i)}
                    role="radio" aria-checked={selectedIdx === i}
                    aria-label={`${c.name} — ${c.party}`} tabIndex={0}>
                    {selectedIdx === i ? '●' : '○'}
                  </button>
                </div>
              ))}
            </div>
          </div>
          <button className="btn success-btn" style={{ maxWidth: '300px', margin: '1.5rem auto 0' }}
            onClick={handlePress} disabled={selectedIdx === null}
            aria-label={selectedIdx === null ? t('selectCandidate') : t('confirmVote')}>
            {selectedIdx === null ? t('selectCandidate') : t('confirmVote')}
          </button>
        </div>
      )}

      {step === 'vvpat' && vvpatVisible && (
        <div className="evm-vvpat-view fade-in" role="status" aria-live="assertive">
          <div className="evm-machine glass">
            <div className="evm-header">
              <span className="evm-led blink" style={{ background: 'var(--success)' }} aria-hidden="true"></span>
              <span>{t('voteRecorded')}</span>
            </div>
          </div>
          <div className="vvpat-slip slide-down" aria-label="VVPAT verification slip">
            <div className="vvpat-paper">
              <p className="vvpat-title">{t('vvpatSlip')}</p>
              <div className="vvpat-detail">
                <span className="vvpat-symbol" aria-hidden="true">{candidates[selectedIdx].symbol}</span>
                <div>
                  <p className="vvpat-candidate">{candidates[selectedIdx].name}</p>
                  <p className="vvpat-party-name">{candidates[selectedIdx].party}</p>
                </div>
              </div>
              <p className="vvpat-timer" aria-live="polite">{t('slipVisible')} {countdown}s</p>
            </div>
          </div>
        </div>
      )}

      {step === 'done' && (
        <div className="evm-done fade-in" style={{ textAlign: 'center', padding: '2rem 0' }} role="status">
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }} aria-hidden="true">🎉</div>
          <h3 style={{ color: 'var(--success)', marginBottom: '0.5rem' }}>{t('voteCast')}</h3>
          <p style={{ color: 'var(--text-secondary)' }}>{t('voteCastSub')}</p>
          <button className="btn outline-btn" style={{ maxWidth: '200px', margin: '1.5rem auto 0' }} onClick={handleReset} aria-label={t('tryAgainEvm')}>
            {t('tryAgainEvm')}
          </button>
        </div>
      )}
    </div>
  );
}
