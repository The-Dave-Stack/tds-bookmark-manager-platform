import { Bookmark } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import LanguageSwitcher from '../common/LanguageSwitcher';

interface AuthLayoutProps {
  titleKey: string;
  children: React.ReactNode;
}

const AuthLayout = ({ titleKey, children }: AuthLayoutProps) => {
  const { t } = useTranslation();

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
          {t(titleKey)}
        </h2>
        <p className="mt-2 text-center text-sm text-mainText/70">
          {t('app.tagline')}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
