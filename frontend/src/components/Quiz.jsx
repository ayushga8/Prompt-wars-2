import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

export default function Quiz({ questions, moduleId, isCompleted, onAllCorrect }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [allCorrect, setAllCorrect] = useState(false);

  // Reset when module changes
  useEffect(() => {
    setAnswers({});
    setSubmitted(false);
    setAllCorrect(false);
  }, [moduleId]);

  const handleSelect = (qIndex, optIndex) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qIndex]: optIndex }));
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length < questions.length) return;
    setSubmitted(true);

    const correct = questions.every((q, i) => answers[i] === q.correctIndex);
    setAllCorrect(correct);

    if (correct) {
      confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 }, zIndex: 1000 });
      setTimeout(() => onAllCorrect(), 500);
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setSubmitted(false);
    setAllCorrect(false);
  };

  if (isCompleted) {
    return (
      <div className="quiz-completed-banner">
        <span className="quiz-check">✅</span>
        <p>You've already completed this quiz and earned your badge!</p>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      {questions.map((q, qIndex) => (
        <div key={qIndex} className="quiz-question">
          <p className="question-text">{qIndex + 1}. {q.question}</p>
          <div className="quiz-options">
            {q.options.map((opt, optIndex) => {
              let cls = 'quiz-option';
              if (answers[qIndex] === optIndex) cls += ' selected';
              if (submitted) {
                if (optIndex === q.correctIndex) cls += ' correct';
                else if (answers[qIndex] === optIndex) cls += ' wrong';
              }
              return (
                <div
                  key={optIndex}
                  className={cls}
                  onClick={() => handleSelect(qIndex, optIndex)}
                >
                  {opt}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div className="quiz-actions">
        {!submitted ? (
          <button
            className="btn primary-btn"
            onClick={handleSubmit}
            disabled={Object.keys(answers).length < questions.length}
            style={{ maxWidth: '300px' }}
          >
            Submit Answers
          </button>
        ) : allCorrect ? (
          <div className="quiz-result success">
            <span>🎉</span> Perfect score! Badge unlocked!
          </div>
        ) : (
          <div className="quiz-result-area">
            <div className="quiz-result fail">
              Some answers were incorrect. Try again!
            </div>
            <button className="btn outline-btn" onClick={handleRetry} style={{ maxWidth: '200px', marginTop: '1rem' }}>
              Retry Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
