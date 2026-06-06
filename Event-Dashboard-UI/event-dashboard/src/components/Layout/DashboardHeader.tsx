import { useTranslation } from 'react-i18next';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from '../UI/LanguageSwitcher';

const DashboardHeader = ({ onLogout }) => {
  const { t } = useTranslation();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">
              {t('common.appName')}
            </h1>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <ThemeToggle />
            
            {/* User Menu */}
            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200 dark:border-gray-700">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                A
              </div>
              <button
                onClick={onLogout}
                className="text-sm text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                {t('common.logout')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;