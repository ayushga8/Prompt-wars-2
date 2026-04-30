import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithLang } from './testUtils';
import TextToSpeech from '../components/TextToSpeech';

describe('TextToSpeech', () => {
  beforeEach(() => {
    // Mock speechSynthesis
    window.speechSynthesis = {
      speak: vi.fn(),
      cancel: vi.fn(),
      getVoices: vi.fn(() => []),
    };
  });

  it('renders the speak button when supported', () => {
    renderWithLang(<TextToSpeech text="Hello World" />);
    expect(screen.getByLabelText('Read aloud')).toBeInTheDocument();
  });

  it('does not render when speechSynthesis is not supported', () => {
    delete window.speechSynthesis;
    const { container } = renderWithLang(<TextToSpeech text="Hello World" />);
    expect(container.innerHTML).toBe('');
  });

  it('shows the speaker icon initially', () => {
    renderWithLang(<TextToSpeech text="Hello World" />);
    expect(screen.getByLabelText('Read aloud')).toHaveTextContent('🔊');
  });
});
