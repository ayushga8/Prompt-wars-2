/**
 * @module components/Sidebar
 * @description Navigation sidebar with module list, progress bar, and completion status.
 * Supports keyboard navigation and ARIA landmarks.
 */

import PropTypes from 'prop-types';
import { useLanguage } from '../i18n/LanguageContext';

/**
 * Sidebar navigation component displaying learning modules and progress.
 *
 * @param {Object} props
 * @param {Array} props.modules - Array of module objects
 * @param {string} props.activeModuleId - Currently selected module ID
 * @param {Set<string>} props.completedModules - Set of completed module IDs
 * @param {Function} props.onSelect - Callback when a module is selected
 * @param {number} props.progress - Overall progress percentage (0-100)
 * @returns {JSX.Element}
 */
export default function Sidebar({ modules, activeModuleId, completedModules, onSelect, progress }) {
  const { t } = useLanguage();
  return (
    <aside className="sidebar glass" aria-label="Learning module navigation">
      <h3>{t('learningModules')}</h3>

      <div className="progress-section" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label={`${t('progress')}: ${progress}%`}>
        <div className="progress-label">
          <span>{t('progress')}</span>
          <span className="progress-pct">{progress}%</span>
        </div>
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <nav aria-label="Module list">
        <ul className="nav-list" role="list">
          {modules.map((mod) => {
            const isActive = mod.id === activeModuleId;
            const isCompleted = completedModules.has(mod.id);
            let statusClass = '';
            if (isCompleted) statusClass = 'completed';
            else if (isActive && mod.id !== 'overview') statusClass = 'in-progress';

            return (
              <li
                key={mod.id}
                className={`nav-item ${isActive ? 'active' : ''} ${statusClass}`}
                onClick={() => onSelect(mod.id)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(mod.id); } }}
                role="button"
                tabIndex={0}
                aria-current={isActive ? 'page' : undefined}
                aria-label={`${mod.title}${isCompleted ? ` (${t('completed')})` : ''}`}
              >
                <span className="nav-icon" aria-hidden="true">{mod.icon}</span>
                <span className="nav-label">{mod.title}</span>
                {isCompleted && <span className="check-mark" aria-hidden="true">✓</span>}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

Sidebar.propTypes = {
  modules: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
    })
  ).isRequired,
  activeModuleId: PropTypes.string.isRequired,
  completedModules: PropTypes.instanceOf(Set).isRequired,
  onSelect: PropTypes.func.isRequired,
  progress: PropTypes.number.isRequired,
};
