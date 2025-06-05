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