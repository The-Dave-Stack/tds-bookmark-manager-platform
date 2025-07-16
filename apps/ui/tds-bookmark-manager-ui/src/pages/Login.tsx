/**
 * Login.tsx
 *
 * Purpose:
 * - Provides the user login interface.
 * - Handles user authentication by interacting with the authentication store.
 *
 * Logic Overview:
 * 1. Uses `useState` for email, password, loading state, and error messages.
 * 2. Uses `useTranslation` for internationalization and `useNavigate` for redirection after login.
 * 3. Integrates with `useAuthStore` to call the `login` function.
 * 4. `handleSubmit`:
 *    - Prevents default form submission.
 *    - Performs basic client-side validation for empty fields.
 *    - Sets `loading` state.
 *    - Calls `login` from `useAuthStore`.
 *    - On success, shows a success toast and navigates to the dashboard (`/`).
 *    - On error, logs the error, sets an i18n error message, and shows an error toast.
 *    - Resets `loading` state in `finally` block.
 * 5. Renders:
 *    - A header with app title and tagline, and `LanguageSwitcher`.
 *    - A login form with email and password input fields.
 *    - An error message display area.
 *    - A submit button (disabled during loading).
 *    - A link to the registration page.
 *
 * Last Updated:
 * 2025-07-16 by Cline (Added file header documentation and i18n for error messages)
 */
import { useState } from 'react';

import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import ErrorMessage from '../components/common/ErrorMessage';
import FormCard from '../components/common/FormCard';
import InputField from '../components/common/InputField';
import LinkText from '../components/common/LinkText';
import PrimaryButton from '../components/common/PrimaryButton';
import AuthLayout from '../components/layout/AuthLayout';
import { useAuthStore } from '../stores/authStore';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError(t('auth.login.errors.emptyFields')); // Used i18n key
      return;
    }

    setLoading(true);

    try {
      await login({ email, password });
      toast.success(t('auth.login.success'));
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      setError(t('auth.login.error'));
      toast.error(t('auth.login.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout titleKey="app.title.desktop">
      <FormCard title={t('auth.login.title')}>
        <ErrorMessage message={error} />

        <form className="space-y-6" onSubmit={handleSubmit}>
          <InputField
            id="email"
            label={t('auth.email')}
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <InputField
            id="password"
            label={t('auth.password')}
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div>
            <PrimaryButton type="submit" loading={loading}>
              {t('auth.login.button')}
            </PrimaryButton>
          </div>
        </form>

        <div className="mt-6">
          <p className="text-center text-sm text-mainText">
            {t('auth.login.noAccount')}{' '}
            <LinkText to="/register">
              {t('auth.login.register')}
            </LinkText>
          </p>
        </div>
      </FormCard>
    </AuthLayout>
  );
};

export default Login;
