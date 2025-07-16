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

import { Bookmark } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import LanguageSwitcher from '../components/common/LanguageSwitcher';
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
    <div className="min-h-screen bg-lightBg flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Bookmark className="h-12 w-12 text-primary" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-mainText">
          {t('app.title.desktop')}
        </h2>
        <p className="mt-2 text-center text-sm text-mainText/70">
          {t('app.tagline')}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-invertedText py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <h3 className="text-lg font-medium text-mainText mb-6">
            {t('auth.login.title')}
          </h3>
          
          {error && (
            <div className="mb-4 text-sm text-danger bg-danger/10 p-3 rounded-md">
              {error}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-mainText">
                {t('auth.email')}
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-lightBorder rounded-md shadow-sm placeholder-mainText/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-mainText">
                {t('auth.password')}
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-lightBorder rounded-md shadow-sm placeholder-mainText/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-invertedText bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? t('common.loading') : t('auth.login.button')}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <p className="text-center text-sm text-mainText">
              {t('auth.login.noAccount')}{' '}
              <Link to="/register" className="font-medium text-link hover:text-linkHover transition-colors duration-200">
                {t('auth.login.register')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
