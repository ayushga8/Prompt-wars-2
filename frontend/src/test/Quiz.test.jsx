import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithLang } from './testUtils';
import Quiz from '../components/Quiz';

const sampleQuestions = [
  {
    question: 'What is the minimum voting age in India?',
    options: ['16 years', '18 years', '21 years', '25 years'],
    correctIndex: 1
  },
  {
    question: 'Which form is used to register as a new voter?',
    options: ['Form 1', 'Form 6', 'Form 8', 'Form 11'],
    correctIndex: 1
  }
];

describe('Quiz', () => {
  it('renders all questions and options', () => {
    renderWithLang(
      <Quiz questions={sampleQuestions} moduleId="test" isCompleted={false} onAllCorrect={() => {}} />
    );
    expect(screen.getByText(/What is the minimum voting age/)).toBeInTheDocument();
    expect(screen.getByText(/Which form is used/)).toBeInTheDocument();
    expect(screen.getByText('18 years')).toBeInTheDocument();
    expect(screen.getByText('Form 6')).toBeInTheDocument();
  });

  it('shows completed banner when quiz is already done', () => {
    renderWithLang(
      <Quiz questions={sampleQuestions} moduleId="test" isCompleted={true} onAllCorrect={() => {}} />
    );
    expect(screen.getByText(/already completed this quiz/)).toBeInTheDocument();
  });

  it('disables submit until all questions are answered', () => {
    renderWithLang(
      <Quiz questions={sampleQuestions} moduleId="test" isCompleted={false} onAllCorrect={() => {}} />
    );
    const submitBtn = screen.getByText('Submit Answers');
    expect(submitBtn).toBeDisabled();

    // Answer only the first question
    fireEvent.click(screen.getByText('18 years'));
    expect(submitBtn).toBeDisabled();

    // Answer the second question
    fireEvent.click(screen.getByText('Form 6'));
    expect(submitBtn).not.toBeDisabled();
  });

  it('shows success when all answers are correct', () => {
    const onAllCorrect = vi.fn();
    renderWithLang(
      <Quiz questions={sampleQuestions} moduleId="test" isCompleted={false} onAllCorrect={onAllCorrect} />
    );

    fireEvent.click(screen.getByText('18 years'));
    fireEvent.click(screen.getByText('Form 6'));
    fireEvent.click(screen.getByText('Submit Answers'));

    expect(screen.getByText(/Perfect score/)).toBeInTheDocument();
  });

  it('shows failure and retry button when answers are wrong', () => {
    renderWithLang(
      <Quiz questions={sampleQuestions} moduleId="test" isCompleted={false} onAllCorrect={() => {}} />
    );

    fireEvent.click(screen.getByText('16 years')); // wrong
    fireEvent.click(screen.getByText('Form 6'));    // correct
    fireEvent.click(screen.getByText('Submit Answers'));

    expect(screen.getByText(/Some answers were incorrect/)).toBeInTheDocument();
    expect(screen.getByText('Retry Quiz')).toBeInTheDocument();
  });

  it('resets quiz on retry', () => {
    renderWithLang(
      <Quiz questions={sampleQuestions} moduleId="test" isCompleted={false} onAllCorrect={() => {}} />
    );

    fireEvent.click(screen.getByText('16 years'));
    fireEvent.click(screen.getByText('Form 1'));
    fireEvent.click(screen.getByText('Submit Answers'));
    fireEvent.click(screen.getByText('Retry Quiz'));

    // Submit should be disabled again (no answers selected)
    expect(screen.getByText('Submit Answers')).toBeDisabled();
  });
});
