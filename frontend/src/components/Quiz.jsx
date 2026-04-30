/**
 * @module components/Quiz
 * @description Quiz engine with AI-powered explanations for incorrect answers.
 * Supports retry, confetti on perfect score, and module-based reset.
 */

import { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import PropTypes from 'prop-types';
import { useLanguage } from '../i18n/LanguageContext';

const BACKEND_URL = '';

/**
 * Quiz component that renders questions, validates answers, and provides AI explanations.
 *
 * @param {Object} props
 * @param {Array} props.questions - Array of quiz question objects
 * @param {string} props.moduleId - Module ID used to reset quiz on module change
 * @param {boolean} props.isCompleted - Whether this quiz has already been passed
 * @param {Function} props.onAllCorrect - Callback fired when all answers are correct
 * @returns {JSX.Element}
 */
export default function Quiz({ questions, moduleId, isCompleted, onAllCorrect }) {
  const { lang, t } = useLanguage();
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [allCorrect, setAllCorrect] = useState(false);
  const [explanations, setExplanations] = useState({});
  const [loadingExplanations, setLoadingExplanations] = useState({});

  // Reset when module changes
  useEffect(() => {
    setAnswers({});
    setSubmitted(false);
    setAllCorrect(false);
    setExplanations({});
    setLoadingExplanations({});
  }, [moduleId]);

  /** Selects an answer option for a question */
  const handleSelect = useCallback((qIndex, optIndex) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qIndex]: optIndex }));
  }, [submitted]);

  /** Fetches AI explanation for an incorrectly answered question */
  const fetchExplanation = useCallback(async (qIndex, question, userAnswer, correctAnswer) => {
    setLoadingExplanations(prev => ({ ...prev, [qIndex]: true }));
    try {
      const res = await fetch(`${BACKEND_URL}/api/explain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, userAnswer, correctAnswer, lang })
      });
      const data = await res.json();
      if (data.explanation) {
        setExplanations(prev => ({ ...prev, [qIndex]: data.explanation }));
      }
    } catch {
      setExplanations(prev => ({ ...prev, [qIndex]: t('explainFallback') }));
    } finally {
      setLoadingExplanations(prev => ({ ...prev, [qIndex]: false }));
    }
  }, [lang, t]);

  /** Submits all answers, checks correctness, and triggers AI explanations for wrong answers */
  const handleSubmit = useCallback(() => {
    if (Object.keys(answers).length < questions.length) return;
    setSubmitted(true);

    const correct = questions.every((q, i) => answers[i] === q.correctIndex);
    setAllCorrect(correct);

    if (correct) {
      confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 }, zIndex: 1000 });
      setTimeout(() => onAllCorrect(), 500);
    } else {
      questions.forEach((q, i) => {
        if (answers[i] !== q.correctIndex) {
          fetchExplanation(i, q.question, q.options[answers[i]], q.options[q.correctIndex]);
        }
      });
    }
  }, [answers, questions, onAllCorrect, fetchExplanation]);

  /** Resets quiz state for a retry attempt */
  const handleRetry = useCallback(() => {
    setAnswers({});
    setSubmitted(false);
    setAllCorrect(false);
    setExplanations({});
    setLoadingExplanations({});
  }, []);

  if (isCompleted) {
    return (
      <div className="quiz-completed-banner">
        <span className="quiz-check">✅</span>
        <p>{t('quizCompleted')}</p>
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
                <div key={optIndex} className={cls} onClick={() => handleSelect(qIndex, optIndex)}>
                  {opt}
                </div>
              );
            })}
          </div>

          {submitted && answers[qIndex] !== q.correctIndex && (
            <div className="ai-explanation fade-in">
              <div className="ai-explanation-header">
                <span className="ai-icon">🤖</span>
                <span className="ai-label">{t('aiExplanation')}</span>
              </div>
              {loadingExplanations[qIndex] ? (
                <div className="ai-loading">
                  <span className="ai-dot"></span><span className="ai-dot"></span><span className="ai-dot"></span>
                </div>
              ) : explanations[qIndex] ? (
                <p className="ai-text">{explanations[qIndex]}</p>
              ) : (
                <p className="ai-text ai-fallback">{t('explainFallback')}</p>
              )}
            </div>
          )}
        </div>
      ))}

      <div className="quiz-actions">
        {!submitted ? (
          <button className="btn primary-btn" onClick={handleSubmit}
            disabled={Object.keys(answers).length < questions.length} style={{ maxWidth: '300px' }}>
            {t('submitAnswers')}
          </button>
        ) : allCorrect ? (
          <div className="quiz-result success"><span>🎉</span> {t('perfectScore')}</div>
        ) : (
          <div className="quiz-result-area">
            <div className="quiz-result fail">{t('tryAgain')}</div>
            <button className="btn outline-btn" onClick={handleRetry} style={{ maxWidth: '200px', marginTop: '1rem' }}>
              {t('retryQuiz')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

Quiz.propTypes = {
  questions: PropTypes.arrayOf(
    PropTypes.shape({
      question: PropTypes.string.isRequired,
      options: PropTypes.arrayOf(PropTypes.string).isRequired,
      correctIndex: PropTypes.number.isRequired,
    })
  ).isRequired,
  moduleId: PropTypes.string.isRequired,
  isCompleted: PropTypes.bool.isRequired,
  onAllCorrect: PropTypes.func.isRequired,
};
