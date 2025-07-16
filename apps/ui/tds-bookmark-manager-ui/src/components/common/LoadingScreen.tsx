/**
 * LoadingScreen.tsx
 *
 * Purpose:
 * - Displays a full-screen loading indicator with a spinner and loading text.
 * - Used to provide visual feedback to the user during asynchronous operations or initial app loading.
 *
 * Logic Overview:
 * 1. Uses `Loader2` icon from `lucide-react` for the spinning animation.
 * 2. Uses `useTranslation` to get the translated "Loading..." text.
 * 3. Renders a centered container with the spinner and text.
 *
 * Last Updated:
 * 2025-07-16 by Cline (Added file header documentation)
 */
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
