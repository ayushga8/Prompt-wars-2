/**
 * @module components/BadgeBar
 * @description Displays earned and locked achievement badges in the navigation bar.
 * Shows earned badges with their icons and locked placeholders for remaining modules.
 */

import PropTypes from 'prop-types';
import { useLanguage } from '../i18n/LanguageContext';

/**
 * Badge bar component showing earned and locked achievement badges.
 *
 * @param {Object} props
 * @param {Array<{icon: string, label: string}>} props.badges - Array of earned badge objects
 * @param {number} props.totalModules - Total number of earnable modules (excludes overview)
 * @returns {JSX.Element} Row of badge icons
 */
export default function BadgeBar({ badges, totalModules }) {
  const { t } = useLanguage();
  return (
    <div className="badge-bar">
      {badges.map((b, i) => (
        <div key={i} className="badge earned" data-tooltip={b.label}>
          {b.icon}
        </div>
      ))}
      {Array.from({ length: totalModules - badges.length }).map((_, i) => (
        <div key={`locked-${i}`} className="badge locked" data-tooltip={t('badgeLocked')}>
          🔒
        </div>
      ))}
    </div>
  );
}

BadgeBar.propTypes = {
  /** Array of earned badge objects, each with icon and label */
  badges: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  /** Total number of earnable modules (excludes the overview module) */
  totalModules: PropTypes.number.isRequired,
};
