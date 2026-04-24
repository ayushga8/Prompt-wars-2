export default function Timeline({ steps }) {
  return (
    <div className="timeline">
      {steps.map((step, i) => (
        <div key={i} className={`timeline-item ${i % 2 === 0 ? 'left' : 'right'}`}>
          <div className="timeline-dot">
            <span className="dot-number">{i + 1}</span>
          </div>
          <div className="timeline-content glass">
            <h4>{step.title}</h4>
            <p>{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
