import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

const candidates = [
  { name: 'Candidate A', party: 'National Progress Party', symbol: '🌸' },
  { name: 'Candidate B', party: 'Democratic Alliance', symbol: '🌾' },
  { name: 'Candidate C', party: 'People\'s Front', symbol: '🔔' },
  { name: 'NOTA', party: 'None of the Above', symbol: '✖️' },
];

export default function EVMSimulator() {
  const [step, setStep] = useState('ready'); // ready | voting | vvpat | done
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [vvpatVisible, setVvpatVisible] = useState(false);
  const [countdown, setCountdown] = useState(7);
  const timerRef = useRef(null);

  const handleVote = (idx) => {
    if (step !== 'voting') return;
    setSelectedIdx(idx);
  };

  const handlePress = () => {
    if (selectedIdx === null) return;
    setStep('vvpat');
    setVvpatVisible(true);
    setCountdown(7);

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
  };

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  return (
    <div className="evm-simulator">
      <h3 className="gradient-text" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Interactive EVM Simulator</h3>
      <p className="evm-subtitle">Experience how Electronic Voting Machines work in Indian elections</p>

      {step === 'ready' && (
        <div className="evm-start fade-in">
          <div className="evm-machine glass">
            <div className="evm-screen">
              <p>🗳️ EVM is ready</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Press the button below to begin voting</p>
            </div>
          </div>
          <button className="btn primary-btn" style={{ maxWidth: '300px', margin: '1.5rem auto 0' }} onClick={() => setStep('voting')}>
            Start Voting
          </button>
        </div>
      )}

      {step === 'voting' && (
        <div className="evm-voting fade-in">
          <div className="evm-machine glass">
            <div className="evm-header">
              <span className="evm-led blink"></span>
              <span>Balloting Unit — Press the button next to your choice</span>
            </div>
            <div className="evm-candidates">
              {candidates.map((c, i) => (
                <div key={i} className={`evm-row ${selectedIdx === i ? 'selected' : ''}`}>
                  <span className="evm-serial">{i + 1}</span>
                  <span className="evm-name">{c.name}</span>
                  <span className="evm-party">{c.party}</span>
                  <span className="evm-symbol">{c.symbol}</span>
                  <button className={`evm-btn ${selectedIdx === i ? 'pressed' : ''}`} onClick={() => handleVote(i)}>
                    {selectedIdx === i ? '●' : '○'}
                  </button>
                </div>
              ))}
            </div>
          </div>
          <button
            className="btn success-btn"
            style={{ maxWidth: '300px', margin: '1.5rem auto 0' }}
            onClick={handlePress}
            disabled={selectedIdx === null}
          >
            {selectedIdx === null ? 'Select a candidate first' : 'Confirm & Cast Vote'}
          </button>
        </div>
      )}

      {step === 'vvpat' && vvpatVisible && (
        <div className="evm-vvpat-view fade-in">
          <div className="evm-machine glass">
            <div className="evm-header">
              <span className="evm-led blink" style={{ background: 'var(--success)' }}></span>
              <span>Vote Recorded Successfully</span>
            </div>
          </div>
          <div className="vvpat-slip slide-down">
            <div className="vvpat-paper">
              <p className="vvpat-title">VVPAT Slip</p>
              <div className="vvpat-detail">
                <span className="vvpat-symbol">{candidates[selectedIdx].symbol}</span>
                <div>
                  <p className="vvpat-candidate">{candidates[selectedIdx].name}</p>
                  <p className="vvpat-party-name">{candidates[selectedIdx].party}</p>
                </div>
              </div>
              <p className="vvpat-timer">Slip visible for {countdown}s</p>
            </div>
          </div>
        </div>
      )}

      {step === 'done' && (
        <div className="evm-done fade-in" style={{ textAlign: 'center', padding: '2rem 0' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
          <h3 style={{ color: 'var(--success)', marginBottom: '0.5rem' }}>Your Vote Has Been Cast!</h3>
          <p style={{ color: 'var(--text-secondary)' }}>The VVPAT slip has dropped into the sealed box. Thank you for participating in democracy!</p>
          <button className="btn outline-btn" style={{ maxWidth: '200px', margin: '1.5rem auto 0' }} onClick={() => { setStep('ready'); setSelectedIdx(null); }}>
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
