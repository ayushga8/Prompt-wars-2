/**
 * @module components/EligibilityChecker
 * @description Interactive voter eligibility checker tool.
 * Calculates voting eligibility based on the January 1st qualifying date rule
 * used by the Election Commission of India.
 */

import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useLanguage } from '../i18n/LanguageContext';

/** @constant {number} MIN_VOTING_AGE - Minimum age to be eligible to vote in India */
const MIN_VOTING_AGE = 18;

/**
 * Voter eligibility checker component.
 * @returns {JSX.Element}
 */
export default function EligibilityChecker() {
  const { t } = useLanguage();
  const [dob, setDob] = useState('');
  const [citizen, setCitizen] = useState('');
  const [result, setResult] = useState(null);

  /**
   * Calculates voter eligibility based on DOB and citizenship.
   * Uses the January 1st qualifying date as per ECI rules.
   */
  const checkEligibility = useCallback(() => {
    if (!dob || !citizen) return;

    const birthDate = new Date(dob);
    const today = new Date();
    const qualifyingDate = new Date(today.getFullYear(), 0, 1);
    let age = qualifyingDate.getFullYear() - birthDate.getFullYear();
    const m = qualifyingDate.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && qualifyingDate.getDate() < birthDate.getDate())) age--;

    const isOldEnough = age >= MIN_VOTING_AGE;
    const isCitizen = citizen === 'yes';

    if (isOldEnough && isCitizen) {
      setResult({ eligible: true, message: t('eligibleMsg')(age), tip: t('eligibleTip') });
    } else if (!isCitizen) {
      setResult({ eligible: false, message: t('notCitizenMsg'), tip: t('notCitizenTip') });
    } else {
      setResult({ eligible: false, message: t('tooYoungMsg')(age), tip: t('tooYoungTip') });
    }
  }, [dob, citizen, t]);

  return (
    <div className="eligibility-checker" role="region" aria-label={t('eligibilityTitle')}>
      <h3 className="gradient-text" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{t('eligibilityTitle')}</h3>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{t('eligibilitySub')}</p>

      <div className="checker-form" role="form" aria-label={t('eligibilityTitle')}>
        <div className="form-group">
          <label htmlFor="eligibility-dob">{t('dob')}</label>
          <input id="eligibility-dob" type="date" className="input-field" value={dob} onChange={e => setDob(e.target.value)} aria-required="true" />
        </div>
        <div className="form-group">
          <label id="citizen-label">{t('citizenQuestion')}</label>
          <div className="radio-group" role="radiogroup" aria-labelledby="citizen-label">
            <label className={`radio-option ${citizen === 'yes' ? 'selected' : ''}`}>
              <input type="radio" name="citizen" value="yes" onChange={e => setCitizen(e.target.value)} aria-label={t('yes')} /> {t('yes')}
            </label>
            <label className={`radio-option ${citizen === 'no' ? 'selected' : ''}`}>
              <input type="radio" name="citizen" value="no" onChange={e => setCitizen(e.target.value)} aria-label={t('no')} /> {t('no')}
            </label>
          </div>
        </div>
        <button className="btn primary-btn" onClick={checkEligibility} disabled={!dob || !citizen} style={{ maxWidth: '300px' }} aria-label={t('checkEligibility')}>
          {t('checkEligibility')}
        </button>
      </div>

      {result && (
        <div className={`eligibility-result fade-in ${result.eligible ? 'eligible' : 'not-eligible'}`} role="alert">
          <p className="result-message">{result.message}</p>
          <p className="result-tip">💡 {result.tip}</p>
        </div>
      )}
    </div>
  );
}
