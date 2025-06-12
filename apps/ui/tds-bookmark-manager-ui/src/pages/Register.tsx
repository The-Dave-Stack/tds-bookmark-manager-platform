import { Bookmark, Check, Eye, EyeOff, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import LanguageSwitcher from '../components/common/LanguageSwitcher';
import toast from 'react-hot-toast';
import { useAuthStore } from '../stores/authStore';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

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

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
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
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    };

    let isValid = true;

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
      await register(email, password, firstName, lastName);
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
    <div className="min-h-screen bg-lightBg flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Bookmark className="h-12 w-12 text-primary" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-mainText">{t('app.title.desktop')}</h2>
        <p className="mt-2 text-center text-sm text-mainText/70">{t('app.tagline')}</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-invertedText py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <h3 className="text-lg font-medium text-mainText mb-6">{t('auth.register.title')}</h3>

          <form className="space-y-6" onSubmit={handleSubmit}>
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

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-mainText">
                  {t('auth.register.lastName')}
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={`mt-1 block w-full rounded-md shadow-sm ${
                    errors.lastName ? 'border-danger focus:border-danger focus:ring-danger' : 'border-lightBorder focus:border-primary focus:ring-primary'
                  }`}
                  placeholder={t('auth.register.lastNamePlaceholder')}
                />
                {errors.lastName && <p className="mt-1 text-sm text-danger">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-mainText">
                {t('auth.email')}
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`mt-1 block w-full rounded-md shadow-sm ${
                  errors.email ? 'border-danger focus:border-danger focus:ring-danger' : 'border-lightBorder focus:border-primary focus:ring-primary'
                }`}
                placeholder={t('auth.register.emailPlaceholder')}
              />
              {errors.email && <p className="mt-1 text-sm text-danger">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-mainText">
                {t('auth.password')}
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full pr-10 rounded-md shadow-sm ${
                    errors.password ? 'border-danger focus:border-danger focus:ring-danger' : 'border-lightBorder focus:border-primary focus:ring-primary'
                  }`}
                  placeholder={t('auth.register.passwordPlaceholder')}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center">
                  {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-danger">{errors.password}</p>}

              {/* Password strength indicator */}
              {password && (
                <div className="mt-2">
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full ${getStrengthColor(strength)} transition-all duration-300`} style={{ width: `${strength}%` }} />
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
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-mainText">
                {t('auth.register.confirmPassword')}
              </label>
              <div className="relative mt-1">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`block w-full pr-10 rounded-md shadow-sm ${
                    errors.confirmPassword
                      ? 'border-danger focus:border-danger focus:ring-danger'
                      : 'border-lightBorder focus:border-primary focus:ring-primary'
                  }`}
                  placeholder={t('auth.register.confirmPasswordPlaceholder')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-sm text-danger">{errors.confirmPassword}</p>}
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-invertedText bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? t('common.loading') : t('auth.register.button')}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <p className="text-center text-sm text-mainText">
              {t('auth.register.hasAccount')}{' '}
              <Link to="/login" className="font-medium text-link hover:text-linkHover transition-colors duration-200">
                {t('auth.register.login')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
