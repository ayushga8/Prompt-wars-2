import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithLang } from './testUtils';
import Sidebar from '../components/Sidebar';

const sampleModules = [
  { id: 'overview', title: 'Overview', icon: '🏛️', explanation: '', timelineSteps: [{ title: 'a', description: 'b' }], quiz: [], badgeIcon: null, badgeLabel: '' },
  { id: 'registration', title: 'Voter Registration', icon: '📝', explanation: '', timelineSteps: [{ title: 'a', description: 'b' }], quiz: [{ question: 'q', options: ['a', 'b', 'c', 'd'], correctIndex: 0 }], badgeIcon: '📝', badgeLabel: 'Registration Badge' },
  { id: 'voting', title: 'Voting Process', icon: '🗳️', explanation: '', timelineSteps: [{ title: 'a', description: 'b' }], quiz: [{ question: 'q', options: ['a', 'b', 'c', 'd'], correctIndex: 0 }], badgeIcon: '🗳️', badgeLabel: 'Voting Badge' },
];

describe('Sidebar', () => {
  it('renders all module titles', () => {
    renderWithLang(
      <Sidebar modules={sampleModules} activeModuleId="overview" completedModules={new Set()} onSelect={() => {}} progress={0} />
    );
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Voter Registration')).toBeInTheDocument();
    expect(screen.getByText('Voting Process')).toBeInTheDocument();
  });

  it('shows progress bar at 0%', () => {
    renderWithLang(
      <Sidebar modules={sampleModules} activeModuleId="overview" completedModules={new Set()} onSelect={() => {}} progress={0} />
    );
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('shows progress bar at 50%', () => {
    renderWithLang(
      <Sidebar modules={sampleModules} activeModuleId="overview" completedModules={new Set(['registration'])} onSelect={() => {}} progress={50} />
    );
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('marks active module', () => {
    renderWithLang(
      <Sidebar modules={sampleModules} activeModuleId="registration" completedModules={new Set()} onSelect={() => {}} progress={0} />
    );
    const registrationItem = screen.getByLabelText('Voter Registration');
    expect(registrationItem).toHaveAttribute('aria-current', 'page');
  });

  it('shows check mark for completed modules', () => {
    renderWithLang(
      <Sidebar modules={sampleModules} activeModuleId="overview" completedModules={new Set(['registration'])} onSelect={() => {}} progress={50} />
    );
    const completedItem = screen.getByLabelText(/Voter Registration.*Completed/);
    expect(completedItem).toBeInTheDocument();
  });

  it('calls onSelect when a module is clicked', () => {
    const onSelect = vi.fn();
    renderWithLang(
      <Sidebar modules={sampleModules} activeModuleId="overview" completedModules={new Set()} onSelect={onSelect} progress={0} />
    );
    fireEvent.click(screen.getByText('Voting Process'));
    expect(onSelect).toHaveBeenCalledWith('voting');
  });

  it('supports keyboard navigation with Enter key', () => {
    const onSelect = vi.fn();
    renderWithLang(
      <Sidebar modules={sampleModules} activeModuleId="overview" completedModules={new Set()} onSelect={onSelect} progress={0} />
    );
    const item = screen.getByText('Voter Registration').closest('[role="button"]');
    fireEvent.keyDown(item, { key: 'Enter' });
    expect(onSelect).toHaveBeenCalledWith('registration');
  });
});
