import { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

const BACKEND_URL = '';
export default function AuthView({ onOtpLogin }) {
  const [step, setStep] = useState('email'); // 'email' | 'otp'
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const showError = (msg) => {
    setError(msg);
    setTimeout(() => setError(''), 5000);
  };

  const handleGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      showError(err.message);
    }
  };

  const handleSendOtp = async () => {
    if (!firstName.trim() || !lastName.trim()) return showError('Please enter your first and last name.');
    if (!email.trim() || !email.includes('@')) return showError('Please enter a valid email address.');
    
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
        showError(data.error || 'Failed to send OTP.');
      }
    } catch {
      showError('Unable to reach the server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) return showError('Please enter a 6-digit OTP.');

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
        showError(data.error || 'Invalid OTP.');
      }
    } catch {
      showError('Unable to reach the server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-view" aria-label="Authentication">
      <div className="auth-container glass">
        <h1 className="gradient-text">Election Process Education</h1>
        <p className="subtitle">Understand the election process, timelines, and steps in an interactive and easy-to-follow way.</p>

        <div className="auth-box" role="form" aria-label="Sign in form">
          <h2>Sign In</h2>

          <button className="btn google-btn" onClick={handleGoogle} aria-label="Sign in with Google">
            <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M17.64 9.2045c0-.6381-.0573-1.2518-.1636-1.8409H9v3.4814h4.8436c-.2086 1.125-.8427 2.0782-1.7959 2.7164v2.2581h2.9082c1.7018-1.5668 2.6836-3.874 2.6836-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.4673-.806 5.9564-2.1805l-2.9082-2.2581c-.8059.54-1.8368.859-3.0482.859-2.344 0-4.3282-1.5832-5.036-3.7105H.9573v2.3318C2.4382 15.9832 5.4818 18 9 18z" fill="#34A853"/>
              <path d="M3.964 10.71c-.18-.54-.2822-1.1168-.2822-1.71s.1023-1.17.2823-1.71V4.9582H.9573C.3477 6.1732 0 7.5477 0 9s.3477 2.8268.9573 4.0418L3.964 10.71z" fill="#FBBC05"/>
              <path d="M9 3.5795c1.3214 0 2.5077.4541 3.4405 1.346l2.5813-2.5814C13.4632.8918 11.426 0 9 0 5.4818 0 2.4382 2.0168.9573 4.9582L3.964 7.29C4.6718 5.1627 6.656 3.5795 9 3.5795z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>

          <div className="divider"><span>OR</span></div>

          {step === 'email' ? (
            <div className="email-step">
              <label htmlFor="auth-first-name" className="sr-only">First Name</label>
              <input id="auth-first-name" className="input-field" placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} autoComplete="given-name" />
              <label htmlFor="auth-last-name" className="sr-only">Last Name</label>
              <input id="auth-last-name" className="input-field" placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} autoComplete="family-name" />
              <label htmlFor="auth-email" className="sr-only">Email Address</label>
              <input id="auth-email" className="input-field" type="email" placeholder="Enter your email address" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
              <button className="btn primary-btn" onClick={handleSendOtp} disabled={loading} aria-label="Send OTP to email">
                {loading ? 'Sending...' : 'Send OTP via Email'}
              </button>
            </div>
          ) : (
            <div className="otp-step">
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>An OTP has been sent to <strong>{email}</strong></p>
              <label htmlFor="auth-otp" className="sr-only">Enter 6-digit OTP</label>
              <input id="auth-otp" className="input-field" placeholder="Enter 6-digit OTP" maxLength={6} value={otp} onChange={e => setOtp(e.target.value)} autoComplete="one-time-code" inputMode="numeric" pattern="[0-9]*" />
              <button className="btn success-btn" onClick={handleVerifyOtp} disabled={loading} aria-label="Verify OTP">
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
              <button className="text-btn" onClick={() => setStep('email')} aria-label="Go back to email entry">← Back</button>
            </div>
          )}
        </div>

        {error && <div className="error-msg" role="alert">{error}</div>}
      </div>
    </section>
  );
}
