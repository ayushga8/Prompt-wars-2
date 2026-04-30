/**
 * @module components/ModuleContent
 * @description Renders the content of a learning module including explanation text,
 * timeline steps, interactive components (EVM, eligibility checker), and quiz sections.
 */

import PropTypes from 'prop-types';
import { useLanguage } from '../i18n/LanguageContext';
import Timeline from './Timeline';
import Quiz from './Quiz';
import EVMSimulator from './EVMSimulator';
import ElectionStats from './ElectionStats';
import EligibilityChecker from './EligibilityChecker';
import Certificate from './Certificate';
import TextToSpeech from './TextToSpeech';

/**
 * Module content renderer that adapts layout based on the active module.
 *
 * @param {Object} props
 * @param {Object} props.module - Module data object
 * @param {boolean} props.isCompleted - Whether this module's quiz has been passed
 * @param {Function} props.onComplete - Callback when module quiz is completed
 * @param {string} props.userName - Current user's display name
 * @param {number} props.badgeCount - Number of badges earned
 * @param {number} props.totalModules - Total completable modules
 * @returns {JSX.Element}
 */
export default function ModuleContent({ module, isCompleted, onComplete, userName, badgeCount, totalModules }) {
  const { t } = useLanguage();

  if (module.id === 'overview') {
    return (
      <div className="module-view fade-in">
        <div className="welcome-banner">
          <h2 className="gradient-text">{t('welcomeTitle')}</h2>
          <div className="explanation-row">
            <p>{module.explanation}</p>
            <TextToSpeech text={module.explanation} />
          </div>
        </div>
        <ElectionStats />
        <Timeline steps={module.timelineSteps} />
        <div style={{ marginTop: '3rem' }}>
          <Certificate userName={userName} badgeCount={badgeCount} totalModules={totalModules} />
        </div>
      </div>
    );
  }

  return (
    <div className="module-view fade-in" key={module.id}>
      <div className="module-header">
        <span className="module-icon-large">{module.icon}</span>
        <div>
          <h2 className="gradient-text">{module.title}</h2>
          {isCompleted && <span className="completed-tag">{t('completed')}</span>}
        </div>
      </div>

      <div className="explanation-row">
        <p className="module-explanation">{module.explanation}</p>
        <TextToSpeech text={module.explanation} />
      </div>

      {module.id === 'registration' && (
        <>
          <h3 className="section-title">{t('checkEligibilityTitle')}</h3>
          <EligibilityChecker />
        </>
      )}

      <h3 className="section-title">{t('timelineTitle')}</h3>
      <Timeline steps={module.timelineSteps} />

      {module.id === 'voting' && (
        <>
          <h3 className="section-title">{t('tryItTitle')}</h3>
          <EVMSimulator />
        </>
      )}

      {module.quiz.length > 0 && (
        <>
          <h3 className="section-title">{t('quizTitle')}</h3>
          <Quiz
            questions={module.quiz}
            moduleId={module.id}
            isCompleted={isCompleted}
            onAllCorrect={() => onComplete(module.id)}
          />
        </>
      )}
    </div>
  );
}

ModuleContent.propTypes = {
  module: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    explanation: PropTypes.string.isRequired,
    timelineSteps: PropTypes.array.isRequired,
    quiz: PropTypes.array.isRequired,
  }).isRequired,
  isCompleted: PropTypes.bool.isRequired,
  onComplete: PropTypes.func.isRequired,
  userName: PropTypes.string.isRequired,
  badgeCount: PropTypes.number.isRequired,
  totalModules: PropTypes.number.isRequired,
};
