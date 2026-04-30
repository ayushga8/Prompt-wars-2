/**
 * @module components/ElectionStats
 * @description Animated election statistics dashboard with intersection observer-triggered
 * count-up animations. Displays key Indian election metrics.
 */

import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useLanguage } from '../i18n/LanguageContext';

/** @constant {number} DEFAULT_ANIMATION_DURATION - Default count animation duration in ms */
const DEFAULT_ANIMATION_DURATION = 2000;

/** @constant {number} INTERSECTION_THRESHOLD - Viewport intersection ratio to trigger animation */
const INTERSECTION_THRESHOLD = 0.3;

/**
 * Election statistics dashboard with animated counters.
 * @returns {JSX.Element}
 */
export default function ElectionStats() {
  const { t } = useLanguage();

  const stats = [
    { label: t('statRegistered'), icon: '👥', target: 96.9, suffix: ' Cr', decimals: 1 },
    { label: t('statPolling'), icon: '🏫', target: 10.35, suffix: ' Lakh', decimals: 2 },
    { label: t('statEvm'), icon: '🗳️', target: 55, suffix: ' Lakh', decimals: 0 },
    { label: t('statSeats'), icon: '🏛️', target: 543, suffix: '', decimals: 0 },
    { label: t('statParties'), icon: '🏴', target: 2800, suffix: '+', decimals: 0 },
    { label: t('statDays'), icon: '📊', target: 1, suffix: ' Day', decimals: 0 },
  ];

  return (
    <div className="election-stats">
      <h3 className="gradient-text" style={{ fontSize: '1.5rem', marginBottom: '0.5rem', textAlign: 'center' }}>
        {t('statsTitle')}
      </h3>
      <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '2rem' }}>
        {t('statsSubtitle')}
      </p>
      <div className="stats-grid">
        {stats.map((s, i) => (
          <div key={i} className="stat-card glass" style={{ animationDelay: `${i * 0.1}s` }}>
            <span className="stat-icon">{s.icon}</span>
            <div className="stat-display">
              <AnimatedCounter target={s.target} suffix={s.suffix} decimals={s.decimals} />
            </div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Animated counter that counts up from 0 to a target value when scrolled into view.
 * Uses IntersectionObserver to trigger the animation only when visible.
 *
 * @param {Object} props
 * @param {number} props.target - The target number to count up to
 * @param {string} [props.suffix=''] - Text suffix appended after the number
 * @param {number} [props.decimals=0] - Number of decimal places to display
 * @param {number} [props.duration=2000] - Animation duration in milliseconds
 * @returns {JSX.Element}
 */
function AnimatedCounter({ target, suffix = '', decimals = 0, duration = DEFAULT_ANIMATION_DURATION }) {
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
            const eased = 1 - Math.pow(1 - progress, 3); // Cubic ease-out
            setCount(eased * target);
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: INTERSECTION_THRESHOLD }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  const formatted = decimals > 0
    ? count.toFixed(decimals)
    : Math.floor(count).toLocaleString('en-IN');

  return <span ref={ref}>{formatted}{suffix}</span>;
}

AnimatedCounter.propTypes = {
  target: PropTypes.number.isRequired,
  suffix: PropTypes.string,
  decimals: PropTypes.number,
  duration: PropTypes.number,
};
