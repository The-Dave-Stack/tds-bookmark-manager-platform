import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Bookmark, Folder, BarChart3, Link2, Shield, ArrowRight } from 'lucide-react';
import LanguageSwitcher from '../components/common/LanguageSwitcher';

const LandingPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const features = [
    {
      icon: <Folder className="h-8 w-8 text-primary" />,
      title: t('landing.features.organization.title'),
      description: t('landing.features.organization.description')
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-primary" />,
      title: t('landing.features.insights.title'),
      description: t('landing.features.insights.description')
    },
    {
      icon: <Link2 className="h-8 w-8 text-primary" />,
      title: t('landing.features.quickAdd.title'),
      description: t('landing.features.quickAdd.description')
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: t('landing.features.security.title'),
      description: t('landing.features.security.description')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Bookmark className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-semibold text-gray-900">
                {t('app.title')}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <button
                onClick={() => navigate('/login')}
                className="text-gray-700 hover:text-gray-900 font-medium"
              >
                {t('auth.login.title')}
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white font-medium transition-colors duration-200"
              >
                {t('auth.register.title')}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              {t('landing.hero.title')}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              {t('landing.hero.subtitle')}
            </p>
            <button
              onClick={() => navigate('/register')}
              className="inline-flex items-center px-6 py-3 rounded-lg bg-primary hover:bg-primary/90 text-white font-medium text-lg transition-colors duration-200"
            >
              {t('landing.hero.cta')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
          <div className="mt-16">
            <img
              src="https://images.pexels.com/photos/3888151/pexels-photo-3888151.jpeg"
              alt="Bookmark Manager Preview"
              className="rounded-2xl shadow-2xl w-full object-cover"
              style={{ maxHeight: '600px' }}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t('landing.features.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('landing.features.subtitle')}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="bg-primary/10 rounded-lg p-3 inline-block mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center bg-primary/10 rounded-full px-4 py-2 mb-8">
            <Shield className="h-5 w-5 text-primary mr-2" />
            <span className="text-primary font-medium">
              {t('landing.trust.badge')}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            {t('landing.trust.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            {t('landing.trust.description')}
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            {t('landing.cta.title')}
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10">
            {t('landing.cta.description')}
          </p>
          <button
            onClick={() => navigate('/register')}
            className="inline-flex items-center px-8 py-4 rounded-lg bg-white hover:bg-gray-50 text-primary font-medium text-lg transition-colors duration-200"
          >
            {t('landing.cta.button')}
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Bookmark className="h-8 w-8 text-primary" />
                <span className="ml-2 text-xl font-semibold">
                  {t('app.title')}
                </span>
              </div>
              <p className="text-gray-400">
                {t('landing.footer.tagline')}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">
                {t('landing.footer.product.title')}
              </h3>
              <ul className="space-y-2">
                <li>
                  <a href="#features" className="text-gray-400 hover:text-white transition-colors">
                    {t('landing.footer.product.features')}
                  </a>
                </li>
                <li>
                  <a href="#security" className="text-gray-400 hover:text-white transition-colors">
                    {t('landing.footer.product.security')}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">
                {t('landing.footer.company.title')}
              </h3>
              <ul className="space-y-2">
                <li>
                  <a href="#about" className="text-gray-400 hover:text-white transition-colors">
                    {t('landing.footer.company.about')}
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-gray-400 hover:text-white transition-colors">
                    {t('landing.footer.company.contact')}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">
                {t('landing.footer.legal.title')}
              </h3>
              <ul className="space-y-2">
                <li>
                  <a href="#privacy" className="text-gray-400 hover:text-white transition-colors">
                    {t('landing.footer.legal.privacy')}
                  </a>
                </li>
                <li>
                  <a href="#terms" className="text-gray-400 hover:text-white transition-colors">
                    {t('landing.footer.legal.terms')}
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} The Dave Stack. {t('landing.footer.copyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;