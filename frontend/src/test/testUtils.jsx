import { render } from '@testing-library/react';
import { LanguageProvider } from '../i18n/LanguageContext';

/**
 * Render a component wrapped in LanguageProvider for testing.
 */
export function renderWithLang(ui, options = {}) {
  return render(
    <LanguageProvider>{ui}</LanguageProvider>,
    options
  );
}
