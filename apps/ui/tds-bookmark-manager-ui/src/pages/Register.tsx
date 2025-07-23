/**
 * Register.tsx
 *
 * Purpose:
 * - Provides the user registration interface.
 * - Handles new user account creation with advanced password validation.
 *
 * Logic Overview:
 * 1. Uses `useState` for all form fields (first name, last name, email, password, confirm password), password visibility, loading state, and validation errors.
 * 2. Defines `PASSWORD_REQUIREMENTS` with regex and i18n labels for password strength validation.
 * 3. Uses `useTranslation` for internationalization and `useNavigate` for redirection after registration.
 * 4. Integrates with `useAuthStore` to call the `register` function.
 * 5. `getPasswordStrength` and `getStrengthColor`: Functions for displaying password strength feedback.
 * 6. `validateForm`: Performs client-side validation for all form fields:
 *    - Checks for required fields.
 *    - Validates email format.
 *    - Checks password against `PASSWORD_REQUIREMENTS`.
 *    - Ensures password and confirm password match.
 * 7. `handleSubmit`:
 *    - Prevents default form submission.
 *    - Calls `validateForm`; if invalid, stops execution.
 *    - Sets `loading` state.
 *    - Calls `register` from `useAuthStore` with a `CreateUserDto` object.
 *    - On success, shows a success toast and navigates to the dashboard (`/`).
 *    - On error, logs the error and attempts to translate specific API error messages (e.g., email already exists) or falls back to a generic error toast.
 *    - Resets `loading` state in `finally` block.
 * 8. Renders:
 *    - A header with app title and tagline, and `LanguageSwitcher`.
 *    - A registration form with input fields for user details and password.
 *    - Real-time password strength indicator and requirement checklist.
 *    - Toggle buttons for password visibility.
 *    - A submit button (disabled during loading).
 *    - A link to the login page.
 *
 * Last Updated:
 * 2025-07-16 by Cline (Added file header documentation and corrected register call)
 */
import { useState } from 'react';

import { Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { CreateUserDto } from '@tds/tds-bm-common';

import ErrorMessage from '../components/common/ErrorMessage';
import FormCard from '../components/common/FormCard';
import InputField from '../components/common/InputField';
import LinkText from '../components/common/LinkText';
import PrimaryButton from '../components/common/PrimaryButton';
import AuthLayout from '../components/layout/AuthLayout';
import { useAuthStore } from '../stores/authStore';

interface PasswordRequirement {
  regex: RegExp;
  label: string;
}

const PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
  { regex: /.{8,}/, label: 'auth.register.password.minLength' },
  { regex: /[A-Z]/, label: 'auth.register.password.uppercase' },
  { regex: /[a-z]/, label: 'auth.register.password.lowercase' },
  { regex: /[0-9]/, label: 'auth.register.password.number' },
  { regex: /[^A-Za-z0-9]/, label: 'auth.register.password.special' },
];

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register } = useAuthStore();

  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Calculate password strength and requirements met
  const getPasswordStrength = () => {
    const requirementsMet = PASSWORD_REQUIREMENTS.filter((req) => req.regex.test(password)).length;

    if (requirementsMet === 0) return 0;
    return (requirementsMet / PASSWORD_REQUIREMENTS.length) * 100;
  };

  const getStrengthColor = (strength: number) => {
    if (strength < 40) return 'bg-red-500';
    if (strength < 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const validateForm = () => {
    const newErrors = {
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    };

    let isValid = true;

    if (!username.trim()) {
      newErrors.username = t('auth.register.errors.usernameRequired');
      isValid = false;
    }

    if (!firstName.trim()) {
      newErrors.firstName = t('auth.register.errors.firstNameRequired');
      isValid = false;
    }

    if (!lastName.trim()) {
      newErrors.lastName = t('auth.register.errors.lastNameRequired');
      isValid = false;
    }

    if (!email.trim()) {
      newErrors.email = t('auth.register.errors.emailRequired');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t('auth.register.errors.emailInvalid');
      isValid = false;
    }

    if (!password) {
      newErrors.password = t('auth.register.errors.passwordRequired');
      isValid = false;
    } else if (!PASSWORD_REQUIREMENTS.every((req) => req.regex.test(password))) {
      newErrors.password = t('auth.register.errors.passwordRequirements');
      isValid = false;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = t('auth.register.errors.passwordMatch');
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      await register({ username, email, password, firstName, lastName });
      toast.success(t('auth.register.success'));
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
      // Check if it's a structured API error from Axios
      const apiErrorMessageKey = (error as any)?.response?.data?.message;

      if (apiErrorMessageKey) {
        // Use the specific error key for translation
        // The 'exists' function checks if the translation key is present
        const specificMessage = t(`apiErrors.${apiErrorMessageKey}`, {
          defaultValue: t('common.error'),
        });
        toast.error(specificMessage);
      } else {
        // Fallback to the generic error message
        toast.error(t('common.error'));
      }
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength();

  return (
    <AuthLayout titleKey="app.title.desktop">
      <FormCard title={t('auth.register.title')}>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <InputField
              id="firstName"
              label={t('auth.register.firstName')}
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder={t('auth.register.firstNamePlaceholder')}
              error={errors.firstName}
            />

            <InputField
              id="lastName"
              label={t('auth.register.lastName')}
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder={t('auth.register.lastNamePlaceholder')}
              error={errors.lastName}
            />
          </div>

          <InputField
            id="email"
            label={t('auth.email')}
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('auth.register.emailPlaceholder')}
            error={errors.email}
          />

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-mainText">
                {t('auth.username')}
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`mt-1 block w-full rounded-md shadow-sm ${
                  errors.username ? 'border-danger focus:border-danger focus:ring-danger' : 'border-lightBorder focus:border-primary focus:ring-primary'
                }`}
                placeholder={t('auth.register.usernamePlaceholder')}
              />
              {errors.username && <p className="mt-1 text-sm text-danger">{errors.username}</p>}
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-mainText">
                  {t('auth.register.firstName')}
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={`mt-1 block w-full rounded-md shadow-sm ${
                    errors.firstName ? 'border-danger focus:border-danger focus:ring-danger' : 'border-lightBorder focus:border-primary focus:ring-primary'
                  }`}
                  placeholder={t('auth.register.firstNamePlaceholder')}
                />
                {errors.firstName && <p className="mt-1 text-sm text-danger">{errors.firstName}</p>}
              </div>
            </div>
          )}

          {/* Password requirements */}
          <div className="mt-2 space-y-2">
            {PASSWORD_REQUIREMENTS.map((req, index) => (
              <div key={index} className="flex items-center text-sm">
                {req.regex.test(password) ? <Check className="h-4 w-4 text-success mr-2" /> : <X className="h-4 w-4 text-danger mr-2" />}
                <span className={req.regex.test(password) ? 'text-success' : 'text-danger'}>{t(req.label)}</span>
              </div>
            ))}
          </div>

          <InputField
            id="confirmPassword"
            label={t('auth.register.confirmPassword')}
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder={t('auth.register.confirmPasswordPlaceholder')}
            error={errors.confirmPassword}
          />

          <div>
            <PrimaryButton type="submit" loading={loading}>
              {t('auth.register.button')}
            </PrimaryButton>
          </div>
        </form>

        <div className="mt-6">
          <p className="text-center text-sm text-mainText">
            {t('auth.register.hasAccount')}{' '}
            <LinkText to="/login">
              {t('auth.register.login')}
            </LinkText>
          </p>
        </div>
      </FormCard>
    </AuthLayout>
  );
};

export default Register;
