import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import EligibilityChecker from '../components/EligibilityChecker';

describe('EligibilityChecker', () => {
  it('renders the eligibility checker form', () => {
    render(<EligibilityChecker />);
    expect(screen.getByText('Am I Eligible to Vote?')).toBeInTheDocument();
    expect(screen.getByLabelText('Date of Birth')).toBeInTheDocument();
    expect(screen.getByText('Check Eligibility')).toBeInTheDocument();
  });

  it('disables check button when form is incomplete', () => {
    render(<EligibilityChecker />);
    const button = screen.getByText('Check Eligibility');
    expect(button).toBeDisabled();
  });

  it('shows eligible result for a valid adult citizen', () => {
    render(<EligibilityChecker />);

    const dobInput = screen.getByLabelText('Date of Birth');
    fireEvent.change(dobInput, { target: { value: '2000-01-01' } });

    const yesRadio = screen.getByLabelText('Yes, I am an Indian citizen');
    fireEvent.click(yesRadio);

    const button = screen.getByText('Check Eligibility');
    fireEvent.click(button);

    expect(screen.getByText(/Congratulations/)).toBeInTheDocument();
  });

  it('shows not eligible for non-citizens', () => {
    render(<EligibilityChecker />);

    const dobInput = screen.getByLabelText('Date of Birth');
    fireEvent.change(dobInput, { target: { value: '2000-01-01' } });

    const noRadio = screen.getByLabelText('No, I am not an Indian citizen');
    fireEvent.click(noRadio);

    const button = screen.getByText('Check Eligibility');
    fireEvent.click(button);

    expect(screen.getByText(/Only Indian citizens/)).toBeInTheDocument();
  });

  it('shows not eligible for underage users', () => {
    render(<EligibilityChecker />);

    // Set DOB to a recent year (will be under 18)
    const currentYear = new Date().getFullYear();
    const dobInput = screen.getByLabelText('Date of Birth');
    fireEvent.change(dobInput, { target: { value: `${currentYear - 10}-06-15` } });

    const yesRadio = screen.getByLabelText('Yes, I am an Indian citizen');
    fireEvent.click(yesRadio);

    const button = screen.getByText('Check Eligibility');
    fireEvent.click(button);

    expect(screen.getByText(/minimum voting age/)).toBeInTheDocument();
  });
});
