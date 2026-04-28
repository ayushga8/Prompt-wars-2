import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithLang } from './testUtils';
import EligibilityChecker from '../components/EligibilityChecker';

describe('EligibilityChecker', () => {
  it('renders the eligibility form', () => {
    renderWithLang(<EligibilityChecker />);
    expect(screen.getByText(/Am I Eligible to Vote/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date of Birth/i)).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
  });

  it('disables check button until both fields are filled', () => {
    renderWithLang(<EligibilityChecker />);
    const checkBtn = screen.getByText('Check Eligibility');
    expect(checkBtn).toBeDisabled();
  });

  it('shows eligible result for adult Indian citizen', () => {
    renderWithLang(<EligibilityChecker />);

    // Set DOB to 25 years ago
    const dob = new Date();
    dob.setFullYear(dob.getFullYear() - 25);
    const dobStr = dob.toISOString().split('T')[0];
    fireEvent.change(screen.getByLabelText(/Date of Birth/i), { target: { value: dobStr } });

    // Select Yes for citizen
    fireEvent.click(screen.getByText('Yes'));
    fireEvent.click(screen.getByText('Check Eligibility'));

    expect(screen.getByText(/Congratulations/)).toBeInTheDocument();
    expect(screen.getByText(/eligible to vote/)).toBeInTheDocument();
  });

  it('shows not eligible for non-citizen', () => {
    renderWithLang(<EligibilityChecker />);

    const dob = new Date();
    dob.setFullYear(dob.getFullYear() - 25);
    fireEvent.change(screen.getByLabelText(/Date of Birth/i), { target: { value: dob.toISOString().split('T')[0] } });
    fireEvent.click(screen.getByText('No'));
    fireEvent.click(screen.getByText('Check Eligibility'));

    expect(screen.getByText(/Only Indian citizens/)).toBeInTheDocument();
  });

  it('shows too young message for minors', () => {
    renderWithLang(<EligibilityChecker />);

    const dob = new Date();
    dob.setFullYear(dob.getFullYear() - 15);
    fireEvent.change(screen.getByLabelText(/Date of Birth/i), { target: { value: dob.toISOString().split('T')[0] } });
    fireEvent.click(screen.getByText('Yes'));
    fireEvent.click(screen.getByText('Check Eligibility'));

    expect(screen.getByText(/minimum voting age/)).toBeInTheDocument();
  });
});
