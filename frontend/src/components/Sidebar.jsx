export default function Sidebar({ modules, activeModuleId, completedModules, onSelect, progress }) {
  return (
    <aside className="sidebar glass">
      <h3>Learning Modules</h3>

      <div className="progress-section">
        <div className="progress-label">
          <span>Progress</span>
          <span className="progress-pct">{progress}%</span>
        </div>
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <ul className="nav-list">
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
            >
              <span className="nav-icon">{mod.icon}</span>
              <span className="nav-label">{mod.title}</span>
              {isCompleted && <span className="check-mark">✓</span>}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
