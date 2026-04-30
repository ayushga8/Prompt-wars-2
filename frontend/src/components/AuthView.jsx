/**
 * @module components/AuthView
 * @description Authentication view supporting Google Sign-In and Email OTP login.
 * Provides a two-step OTP flow: enter name/email → receive and verify OTP code.
 * All text is internationalized via the LanguageContext.
 */

import { useState, useCallback } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { useLanguage } from '../i18n/LanguageContext';
import PropTypes from 'prop-types';

/** @constant {string} BACKEND_URL - Base URL for backend API calls (empty for same-origin) */
const BACKEND_URL = '';

/** @constant {number} ERROR_DISPLAY_MS - Duration to show error messages before auto-clearing */
const ERROR_DISPLAY_MS = 5000;

/** @constant {number} OTP_CODE_LENGTH - Expected length of the OTP code */
const OTP_CODE_LENGTH = 6;

/**
 * Authentication view component with dual login methods.
 *
 * @param {Object} props
 * @param {Function} props.onOtpLogin - Callback invoked on successful OTP verification with (displayName, email)
 * @returns {JSX.Element} The authentication form UI
 */
export default function AuthView({ onOtpLogin }) {
  const { t } = useLanguage();
  const [step, setStep] = useState('email'); // 'email' | 'otp'
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /** Displays an error message that auto-clears after ERROR_DISPLAY_MS */
  const showError = useCallback((msg) => {
    setError(msg);
    setTimeout(() => setError(''), ERROR_DISPLAY_MS);
  }, []);

  /** Initiates Google Sign-In via Firebase popup */
  const handleGoogle = useCallback(async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      showError(err.message);
    }
  }, [showError]);

  /** Validates name/email fields and requests OTP delivery */
  const handleSendOtp = useCallback(async () => {
    if (!firstName.trim() || !lastName.trim()) return showError(t('errorName'));
    if (!email.trim() || !email.includes('@')) return showError(t('errorEmail'));
    
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() })
      });
      const data = await res.json();
      if (res.ok) {
        setStep('otp');
      } else {
        showError(data.error || t('errorOtpFailed'));
      }
    } catch {
      showError(t('errorServer'));
    } finally {
      setLoading(false);
    }
  }, [firstName, lastName, email, showError, t]);

  /** Verifies the entered OTP code against the backend */
  const handleVerifyOtp = useCallback(async () => {
    if (otp.length !== OTP_CODE_LENGTH) return showError(t('errorOtp'));

    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), otp })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onOtpLogin(`${firstName.trim()} ${lastName.trim()}`, email.trim());
      } else {
        showError(data.error || t('errorOtpInvalid'));
      }
    } catch {
      showError(t('errorServer'));
    } finally {
      setLoading(false);
    }
  }, [otp, email, firstName, lastName, onOtpLogin, showError, t]);

  return (
    <section className="auth-view" aria-label="Authentication">
      <div className="auth-container glass">
        <h1 className="gradient-text">{t('authTitle')}</h1>
        <p className="subtitle">{t('authSubtitle')}</p>

        <div className="auth-box" role="form" aria-label="Sign in form">
          <h2>{t('signIn')}</h2>

          <button className="btn google-btn" onClick={handleGoogle} aria-label={t('signInGoogle')}>
            <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M17.64 9.2045c0-.6381-.0573-1.2518-.1636-1.8409H9v3.4814h4.8436c-.2086 1.125-.8427 2.0782-1.7959 2.7164v2.2581h2.9082c1.7018-1.5668 2.6836-3.874 2.6836-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.4673-.806 5.9564-2.1805l-2.9082-2.2581c-.8059.54-1.8368.859-3.0482.859-2.344 0-4.3282-1.5832-5.036-3.7105H.9573v2.3318C2.4382 15.9832 5.4818 18 9 18z" fill="#34A853"/>
              <path d="M3.964 10.71c-.18-.54-.2822-1.1168-.2822-1.71s.1023-1.17.2823-1.71V4.9582H.9573C.3477 6.1732 0 7.5477 0 9s.3477 2.8268.9573 4.0418L3.964 10.71z" fill="#FBBC05"/>
              <path d="M9 3.5795c1.3214 0 2.5077.4541 3.4405 1.346l2.5813-2.5814C13.4632.8918 11.426 0 9 0 5.4818 0 2.4382 2.0168.9573 4.9582L3.964 7.29C4.6718 5.1627 6.656 3.5795 9 3.5795z" fill="#EA4335"/>
            </svg>
            {t('signInGoogle')}
          </button>

          <div className="divider"><span>{t('or')}</span></div>

          {step === 'email' ? (
            <div className="email-step">
              <label htmlFor="auth-first-name" className="sr-only">{t('firstName')}</label>
              <input id="auth-first-name" className="input-field" placeholder={t('firstName')} value={firstName} onChange={e => setFirstName(e.target.value)} autoComplete="given-name" />
              <label htmlFor="auth-last-name" className="sr-only">{t('lastName')}</label>
              <input id="auth-last-name" className="input-field" placeholder={t('lastName')} value={lastName} onChange={e => setLastName(e.target.value)} autoComplete="family-name" />
              <label htmlFor="auth-email" className="sr-only">{t('emailPlaceholder')}</label>
              <input id="auth-email" className="input-field" type="email" placeholder={t('emailPlaceholder')} value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
              <button className="btn primary-btn" onClick={handleSendOtp} disabled={loading} aria-label={t('sendOtp')}>
                {loading ? t('sending') : t('sendOtp')}
              </button>
            </div>
          ) : (
            <div className="otp-step">
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>{t('otpSentTo')} <strong>{email}</strong></p>
              <label htmlFor="auth-otp" className="sr-only">{t('enterOtp')}</label>
              <input id="auth-otp" className="input-field" placeholder={t('enterOtp')} maxLength={OTP_CODE_LENGTH} value={otp} onChange={e => setOtp(e.target.value)} autoComplete="one-time-code" inputMode="numeric" pattern="[0-9]*" />
              <button className="btn success-btn" onClick={handleVerifyOtp} disabled={loading} aria-label={t('verifyOtp')}>
                {loading ? t('verifying') : t('verifyOtp')}
              </button>
              <button className="text-btn" onClick={() => setStep('email')} aria-label="Go back">{t('back')}</button>
            </div>
          )}
        </div>

        {error && <div className="error-msg" role="alert">{error}</div>}
      </div>
    </section>
  );
}

AuthView.propTypes = {
  /** Callback invoked on successful OTP login with (displayName, email) */
  onOtpLogin: PropTypes.func.isRequired,
};
