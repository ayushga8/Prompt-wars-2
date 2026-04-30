import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithLang } from './testUtils';
import Certificate from '../components/Certificate';

describe('Certificate', () => {
  it('shows locked state when not all modules are completed', () => {
    renderWithLang(
      <Certificate userName="Test User" badgeCount={2} totalModules={5} />
    );
    expect(screen.getByText('🔒')).toBeInTheDocument();
    expect(screen.getByText(/Certificate Locked/i)).toBeInTheDocument();
  });

  it('shows progress bar in locked state', () => {
    renderWithLang(
      <Certificate userName="Test User" badgeCount={3} totalModules={5} />
    );
    expect(screen.getByText(/3 of 5/)).toBeInTheDocument();
  });

  it('shows ready state when all modules are completed', () => {
    renderWithLang(
      <Certificate userName="Test User" badgeCount={5} totalModules={5} />
    );
    expect(screen.getByText('🎓')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Download/ })).toBeInTheDocument();
  });

  it('shows language selection buttons in ready state', () => {
    renderWithLang(
      <Certificate userName="Test User" badgeCount={5} totalModules={5} />
    );
    expect(screen.getByText('English')).toBeInTheDocument();
    // Hindi button shows the Hindi script label "हिन्दी"
    expect(screen.getByText('हिन्दी')).toBeInTheDocument();
  });

  it('displays the user name in the ready message', () => {
    renderWithLang(
      <Certificate userName="Ayush" badgeCount={5} totalModules={5} />
    );
    expect(screen.getByText(/Ayush/)).toBeInTheDocument();
  });
});
