import Timeline from './Timeline';
import Quiz from './Quiz';
import EVMSimulator from './EVMSimulator';
import ElectionStats from './ElectionStats';
import EligibilityChecker from './EligibilityChecker';
import Certificate from './Certificate';

export default function ModuleContent({ module, isCompleted, onComplete, userName, badgeCount, totalModules }) {
  if (module.id === 'overview') {
    return (
      <div className="module-view fade-in">
        <div className="welcome-banner">
          <h2 className="gradient-text">Welcome to the Election Process Explorer!</h2>
          <p>{module.explanation}</p>
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
          {isCompleted && <span className="completed-tag">✅ Completed</span>}
        </div>
      </div>

      <p className="module-explanation">{module.explanation}</p>

      {module.id === 'registration' && (
        <>
          <h3 className="section-title">Check Your Eligibility</h3>
          <EligibilityChecker />
        </>
      )}

      <h3 className="section-title">Step-by-Step Timeline</h3>
      <Timeline steps={module.timelineSteps} />

      {module.id === 'voting' && (
        <>
          <h3 className="section-title">Try It Yourself</h3>
          <EVMSimulator />
        </>
      )}

      {module.quiz.length > 0 && (
        <>
          <h3 className="section-title">Knowledge Check</h3>
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
