export default function Sidebar({ modules, activeModuleId, completedModules, onSelect, progress }) {
  return (
    <aside className="sidebar glass" aria-label="Learning module navigation">
      <h3>Learning Modules</h3>

      <div className="progress-section" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label={`Course progress: ${progress}%`}>
        <div className="progress-label">
          <span>Progress</span>
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
                aria-label={`${mod.title}${isCompleted ? ' (completed)' : ''}`}
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
