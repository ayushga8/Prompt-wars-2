/**
 * @module components/Timeline
 * @description Animated step-by-step timeline component for visualizing
 * election processes. Alternates items left/right for visual interest.
 */

import PropTypes from 'prop-types';

/**
 * Timeline component rendering an alternating left-right step sequence.
 *
 * @param {Object} props
 * @param {Array<{title: string, description: string}>} props.steps - Timeline step data
 * @returns {JSX.Element}
 */
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

Timeline.propTypes = {
  /** Array of timeline steps, each with a title and description */
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
};
