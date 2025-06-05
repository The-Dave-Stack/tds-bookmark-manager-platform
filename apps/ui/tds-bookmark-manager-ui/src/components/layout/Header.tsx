import { Bookmark, ChevronDown, LogOut, Menu, User } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import { useAuthStore } from '../../stores/authStore';
import LanguageSwitcher from '../common/LanguageSwitcher';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, clearUser } = useAuthStore();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  const handleLogout = async () => {
    try {
      clearUser();
      toast.success(t('auth.logout.success'));
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error(t('common.error'));
    }
  };
  
  return (
    <header className="bg-invertedText shadow-sm sticky top-0 z-10 border-b border-lightBorder">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <button
              type="button"
              className="p-2 rounded-md text-mainText hover:bg-lightBg md:hidden transition-colors duration-200"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar" // Added aria-label for accessibility and testing
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <Link to="/" className="flex items-center">
              <Bookmark className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-semibold text-mainText hidden sm:block">
                {t('app.title')}
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            
            {/* User Menu */}
            <div className="relative">
              <button
                type="button"
                className="flex items-center space-x-2 text-mainText hover:text-primary transition-colors duration-200"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <div className="bg-primary text-invertedText p-1 rounded-full">
                  <User className="h-5 w-5" />
                </div>
                <span className="hidden md:block">{user?.email}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-invertedText ring-1 ring-lightBorder">
                  <div className="py-1" role="menu">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-mainText hover:bg-lightBg transition-colors duration-200"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      {t('navigation.profile')}
                    </Link>
                    
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-sm text-mainText hover:bg-lightBg transition-colors duration-200"
                        onClick={() => setUserMenuOpen(false)}
                        data-testid="link-admin"
                      >
                        {t('navigation.admin')}
                      </Link>
                    )}
                    
                    <button
                      type="button"
                      className="w-full text-left flex items-center px-4 py-2 text-sm text-danger hover:bg-danger/10 transition-colors duration-200"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      {t('auth.logout.button')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
