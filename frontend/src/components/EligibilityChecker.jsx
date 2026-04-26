import { useState } from 'react';

export default function EligibilityChecker() {
  const [dob, setDob] = useState('');
  const [citizen, setCitizen] = useState('');
  const [result, setResult] = useState(null);

  const checkEligibility = () => {
    if (!dob || !citizen) return;

    const birthDate = new Date(dob);
    const today = new Date();
    // Age on 1st January of current year (qualifying date in India)
    const qualifyingDate = new Date(today.getFullYear(), 0, 1);
    let age = qualifyingDate.getFullYear() - birthDate.getFullYear();
    const m = qualifyingDate.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && qualifyingDate.getDate() < birthDate.getDate())) age--;

    const isOldEnough = age >= 18;
    const isCitizen = citizen === 'yes';

    if (isOldEnough && isCitizen) {
      setResult({
        eligible: true,
        message: `✅ Congratulations! You are eligible to vote. You are ${age} years old and meet all requirements.`,
        tip: 'If you haven\'t registered yet, visit nvsp.in or your nearest ERO office to fill Form 6.'
      });
    } else if (!isCitizen) {
      setResult({
        eligible: false,
        message: '❌ Only Indian citizens are eligible to vote in Indian elections.',
        tip: 'If you are a Non-Resident Indian (NRI) with Indian citizenship, you can still register as an overseas voter.'
      });
    } else {
      setResult({
        eligible: false,
        message: `❌ You are currently ${age} years old. The minimum voting age in India is 18 years.`,
        tip: `You will be eligible to vote once you turn 18 on or before 1st January of the election year.`
      });
    }
  };

  return (
    <div className="eligibility-checker" role="region" aria-label="Voter Eligibility Checker">
      <h3 className="gradient-text" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Am I Eligible to Vote?</h3>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Check your eligibility to vote in Indian elections</p>

      <div className="checker-form" role="form" aria-label="Eligibility check form">
        <div className="form-group">
          <label htmlFor="eligibility-dob">Date of Birth</label>
          <input id="eligibility-dob" type="date" className="input-field" value={dob} onChange={e => setDob(e.target.value)} aria-required="true" />
        </div>
        <div className="form-group">
          <label id="citizen-label">Are you an Indian citizen?</label>
          <div className="radio-group" role="radiogroup" aria-labelledby="citizen-label">
            <label className={`radio-option ${citizen === 'yes' ? 'selected' : ''}`}>
              <input type="radio" name="citizen" value="yes" onChange={e => setCitizen(e.target.value)} aria-label="Yes, I am an Indian citizen" /> Yes
            </label>
            <label className={`radio-option ${citizen === 'no' ? 'selected' : ''}`}>
              <input type="radio" name="citizen" value="no" onChange={e => setCitizen(e.target.value)} aria-label="No, I am not an Indian citizen" /> No
            </label>
          </div>
        </div>
        <button className="btn primary-btn" onClick={checkEligibility} disabled={!dob || !citizen} style={{ maxWidth: '300px' }} aria-label="Check voter eligibility">
          Check Eligibility
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
