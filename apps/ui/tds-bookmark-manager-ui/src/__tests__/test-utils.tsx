/**
 * test-utils.tsx
 *
 * Purpose:
 * - Custom render utility for React Testing Library.
 * - Wraps components with necessary providers (e.g., i18n) for consistent testing.
 *
 * Logic Overview:
 * 1. Imports `rtlRender` from `@testing-library/react` and `I18nextProvider` from `react-i18next`.
 * 2. Imports the i18n configuration from `../i18n/config`.
 * 3. Defines a custom `render` function that wraps the `ui` (component under test) with `I18nextProvider`, ensuring translations are available during tests.
 * 4. Re-exports all utilities from `@testing-library/react` for convenience.
 * 5. Overrides the default `render` method with the custom one.
 *
 * Last Updated:
 * 2025-07-16 by Cline (Added file header documentation)
 */
import { render as rtlRender } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';

import i18n from '../i18n/config';

function render(ui: React.ReactElement, { ...renderOptions } = {}) {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
  };
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

// re-export everything
export * from '@testing-library/react';

// override render method
export { render };
