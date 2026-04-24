import { useState, useEffect, useRef } from 'react';

const stats = [
  { label: 'Registered Voters', value: 969000000, suffix: '', icon: '👥', display: '96.9 Cr' },
  { label: 'Polling Stations', value: 1035000, suffix: '', icon: '🏫', display: '10.35 Lakh' },
  { label: 'EVMs Used', value: 5500000, suffix: '', icon: '🗳️', display: '55 Lakh' },
  { label: 'Lok Sabha Seats', value: 543, suffix: '', icon: '🏛️', display: '543' },
  { label: 'Political Parties', value: 2800, suffix: '+', icon: '🏴', display: '2,800+' },
  { label: 'Days to Count', value: 1, suffix: '', icon: '📊', display: '1 Day' },
];

function AnimatedCounter({ target, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = Date.now();
          const animate = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count.toLocaleString('en-IN')}</span>;
}

export default function ElectionStats() {
  return (
    <div className="election-stats">
      <h3 className="gradient-text" style={{ fontSize: '1.5rem', marginBottom: '0.5rem', textAlign: 'center' }}>
        India's Election — By The Numbers
      </h3>
      <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '2rem' }}>
        The largest democratic exercise in the world
      </p>
      <div className="stats-grid">
        {stats.map((s, i) => (
          <div key={i} className="stat-card glass" style={{ animationDelay: `${i * 0.1}s` }}>
            <span className="stat-icon">{s.icon}</span>
            <div className="stat-value">
              <AnimatedCounter target={s.value} />
              {s.suffix}
            </div>
            <div className="stat-display">{s.display}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
