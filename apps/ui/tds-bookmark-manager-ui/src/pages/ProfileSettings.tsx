import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../stores/authStore';
import { User, Copy, Link, Eye, EyeOff, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface PasswordRequirement {
  regex: RegExp;
  label: string;
}

const PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
  { regex: /.{8,}/, label: 'auth.register.password.minLength' },
  { regex: /[A-Z]/, label: 'auth.register.password.uppercase' },
  { regex: /[a-z]/, label: 'auth.register.password.lowercase' },
  { regex: /[0-9]/, label: 'auth.register.password.number' },
  { regex: /[^A-Za-z0-9]/, label: 'auth.register.password.special' }
];

const ProfileSettings = () => {
  const { t } = useTranslation();
  const { user, updateProfile } = useAuthStore();
  
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: ''
  });
  
  const webhookUrl = user?.webhookUrl || 'https://api.example.com/webhook/user123';
  const apiToken = user?.apiToken || 'user-api-token-123';
  
  const bookmarkletCode = `javascript:(function(){
    var url = encodeURIComponent(document.location.href);
    var title = encodeURIComponent(document.title);
    var apiUrl = '${webhookUrl}?token=${apiToken}&url=' + url + '&title=' + title;
    
    fetch(apiUrl, {method: 'POST'})
    .then(response => response.json())
    .then(data => { alert('Bookmark saved!'); })
    .catch(error => { alert('Error saving bookmark'); });
  })();`;

  const getPasswordStrength = () => {
    if (!password) return 0;
    const requirementsMet = PASSWORD_REQUIREMENTS.filter(req => 
      req.regex.test(password)
    ).length;
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
      password: '',
      confirmPassword: ''
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

    if (password) {
      if (!PASSWORD_REQUIREMENTS.every(req => req.regex.test(password))) {
        newErrors.password = t('auth.register.errors.passwordRequirements');
        isValid = false;
      }

      if (password !== confirmPassword) {
        newErrors.confirmPassword = t('auth.register.errors.passwordMatch');
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const updateData: { firstName?: string; lastName?: string; password?: string } = {
        firstName,
        lastName
      };

      if (password) {
        updateData.password = password;
      }

      await updateProfile(updateData);
      toast.success(t('profile.notifications.updated'));
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(t('profile.notifications.error'));
    } finally {
      setLoading(false);
    }
  };
  
  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast.success(message);
      },
      () => {
        toast.error(t('common.error'));
      }
    );
  };

  const strength = getPasswordStrength();
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center mb-8">
        <User className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-2xl font-bold text-mainText">
          {t('profile.title')}
        </h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-invertedText rounded-lg shadow-sm border border-lightBorder overflow-hidden">
          <div className="px-6 py-5 border-b border-lightBorder">
            <h2 className="text-lg font-medium text-mainText">
              {t('profile.personalInfo.title')}
            </h2>
            <p className="mt-1 text-sm text-mainText/70">
              {t('profile.personalInfo.description')}
            </p>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
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
                    errors.firstName 
                      ? 'border-danger focus:border-danger focus:ring-danger' 
                      : 'border-lightBorder focus:border-primary focus:ring-primary'
                  }`}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-danger">{errors.firstName}</p>
                )}
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
                    errors.lastName 
                      ? 'border-danger focus:border-danger focus:ring-danger' 
                      : 'border-lightBorder focus:border-primary focus:ring-primary'
                  }`}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-danger">{errors.lastName}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-mainText">
                  {t('auth.email')}
                </label>
                <input
                  id="email"
                  type="email"
                  value={user?.email}
                  disabled
                  className="mt-1 block w-full rounded-md shadow-sm border-lightBorder bg-lightBg cursor-not-allowed"
                />
                <p className="mt-1 text-sm text-mainText/70">
                  {t('profile.personalInfo.emailNotEditable')}
                </p>
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-mainText">
                  {t('profile.personalInfo.newPassword')}
                </label>
                <div className="relative mt-1">
                  <input
                    id="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`block w-full pr-10 rounded-md shadow-sm ${
                      errors.password 
                        ? 'border-danger focus:border-danger focus:ring-danger' 
                        : 'border-lightBorder focus:border-primary focus:ring-primary'
                    }`}
                    placeholder={t('profile.personalInfo.newPasswordPlaceholder')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-danger">{errors.password}</p>
                )}

                {/* Password strength indicator */}
                {password && (
                  <div className="mt-2">
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getStrengthColor(strength)} transition-all duration-300`}
                        style={{ width: `${strength}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Password requirements */}
                {password && (
                  <div className="mt-2 space-y-2">
                    {PASSWORD_REQUIREMENTS.map((req, index) => (
                      <div key={index} className="flex items-center text-sm">
                        {req.regex.test(password) ? (
                          <Check className="h-4 w-4 text-success mr-2" />
                        ) : (
                          <X className="h-4 w-4 text-danger mr-2" />
                        )}
                        <span className={req.regex.test(password) ? 'text-success' : 'text-danger'}>
                          {t(req.label)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {password && (
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
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 px-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-danger">{errors.confirmPassword}</p>
                  )}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-invertedText bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {loading ? t('common.loading') : t('profile.personalInfo.save')}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-invertedText rounded-lg shadow-sm border border-lightBorder overflow-hidden">
            <div className="px-6 py-5 border-b border-lightBorder">
              <h2 className="text-lg font-medium text-mainText">
                {t('profile.webhookSection.title')}
              </h2>
              <p className="mt-1 text-sm text-mainText/70">
                {t('profile.webhookSection.description')}
              </p>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-mainText mb-2">
                  {t('profile.webhookSection.url')}
                </label>
                <div className="flex rounded-md shadow-sm">
                  <input
                    type="text"
                    value={webhookUrl}
                    readOnly
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-l-md border border-lightBorder bg-lightBg text-mainText/80"
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(webhookUrl, t('profile.webhookSection.copied'))}
                    className="inline-flex items-center px-4 py-2 border border-l-0 border-lightBorder text-sm font-medium rounded-r-md text-mainText hover:bg-lightBg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    {t('profile.webhookSection.copy')}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-mainText mb-2">
                  {t('profile.webhookSection.token')}
                </label>
                <div className="flex rounded-md shadow-sm">
                  <input
                    type="text"
                    value={apiToken}
                    readOnly
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-l-md border border-lightBorder bg-lightBg text-mainText/80"
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(apiToken, t('profile.webhookSection.copied'))}
                    className="inline-flex items-center px-4 py-2 border border-l-0 border-lightBorder text-sm font-medium rounded-r-md text-mainText hover:bg-lightBg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    {t('profile.webhookSection.copy')}
                  </button>
                </div>
              </div>
              
              <div className="border-t border-lightBorder pt-6">
                <h3 className="text-lg font-medium text-mainText mb-3">
                  {t('profile.webhookSection.bookmarklet.title')}
                </h3>
                <p className="text-sm text-mainText/70 mb-4">
                  {t('profile.webhookSection.bookmarklet.description')}
                </p>
                
                <div className="inline-block">
                  <a
                    href={bookmarkletCode}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-invertedText bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
                    onClick={(e) => {
                      e.preventDefault();
                      copyToClipboard(bookmarkletCode, 'Bookmarklet copied to clipboard!');
                    }}
                  >
                    <Link className="h-4 w-4 mr-2" />
                    {t('profile.webhookSection.bookmarklet.link')}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;