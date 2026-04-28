import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithLang } from './testUtils';
import EVMSimulator from '../components/EVMSimulator';

describe('EVMSimulator', () => {
  it('renders the simulator in ready state', () => {
    renderWithLang(<EVMSimulator />);
    expect(screen.getByText('Interactive EVM Simulator')).toBeInTheDocument();
    expect(screen.getByText('Start Voting')).toBeInTheDocument();
  });

  it('transitions to voting state when Start Voting is clicked', () => {
    renderWithLang(<EVMSimulator />);
    fireEvent.click(screen.getByText('Start Voting'));
    expect(screen.getByText(/Balloting Unit/)).toBeInTheDocument();
    expect(screen.getByText('Candidate A')).toBeInTheDocument();
    expect(screen.getByText('NOTA')).toBeInTheDocument();
  });

  it('allows candidate selection and enables confirm button', () => {
    renderWithLang(<EVMSimulator />);
    fireEvent.click(screen.getByText('Start Voting'));

    // Initially confirm should be disabled
    expect(screen.getByText('Select a candidate first')).toBeDisabled();

    // Select a candidate
    const voteButton = screen.getByLabelText(/Candidate A/);
    fireEvent.click(voteButton);

    // Confirm button should now be enabled
    expect(screen.getByText('Confirm & Cast Vote')).not.toBeDisabled();
  });

  it('supports keyboard navigation for voting', () => {
    renderWithLang(<EVMSimulator />);
    fireEvent.click(screen.getByText('Start Voting'));

    const voteButton = screen.getByLabelText(/Candidate B/);
    fireEvent.keyDown(voteButton, { key: 'Enter' });

    expect(screen.getByText('Confirm & Cast Vote')).not.toBeDisabled();
  });
});
