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
      const createUserDto: CreateUserDto = {
        email,
        password,
        firstName,
        lastName,
        username: email.split('@')[0], // Infer username from email
      };
      await register(createUserDto);
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

          <InputField
            id="password"
            label={t('auth.password')}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('auth.register.passwordPlaceholder')}
            error={errors.password}
          />
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
