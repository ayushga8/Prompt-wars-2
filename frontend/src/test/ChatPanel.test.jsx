import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithLang } from './testUtils';
import ChatPanel from '../components/ChatPanel';

// Mock fetch for API calls
global.fetch = vi.fn();

// Mock scrollIntoView which is not available in jsdom
beforeEach(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

describe('ChatPanel', () => {
  it('renders the chat panel with title', () => {
    renderWithLang(<ChatPanel moduleContext="Indian Elections" onClose={() => {}} />);
    expect(screen.getByText(/AI Election Tutor/)).toBeInTheDocument();
  });

  it('shows initial greeting message with module context', () => {
    renderWithLang(<ChatPanel moduleContext="Voting Process" onClose={() => {}} />);
    expect(screen.getByText(/Voting Process/)).toBeInTheDocument();
  });

  it('renders input field and send button', () => {
    renderWithLang(<ChatPanel moduleContext="Indian Elections" onClose={() => {}} />);
    expect(screen.getByPlaceholderText(/Ask about elections/)).toBeInTheDocument();
    expect(screen.getByLabelText('Send message')).toBeInTheDocument();
  });

  it('disables send button when input is empty', () => {
    renderWithLang(<ChatPanel moduleContext="Indian Elections" onClose={() => {}} />);
    expect(screen.getByLabelText('Send message')).toBeDisabled();
  });

  it('enables send button when text is entered', () => {
    renderWithLang(<ChatPanel moduleContext="Indian Elections" onClose={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText(/Ask about elections/), { target: { value: 'Hello' } });
    expect(screen.getByLabelText('Send message')).not.toBeDisabled();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    renderWithLang(<ChatPanel moduleContext="Indian Elections" onClose={onClose} />);
    fireEvent.click(screen.getByLabelText('Close chat panel'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
