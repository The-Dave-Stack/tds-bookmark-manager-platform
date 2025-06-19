import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const LoadingScreen = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" data-testid="loader-icon" />
      <h2 className="text-xl font-semibold text-gray-900">{t('common.loading')}</h2>
    </div>
  );
};

export default LoadingScreen;
