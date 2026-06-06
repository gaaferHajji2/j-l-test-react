import LoginForm from '../components/Login/LoginForm';
import LoginImage from '../components/Login/LoginImage';
import ThemeToggle from '../components/Layout/ThemeToggle';
import LanguageSwitcher from '../components/UI/LanguageSwitcher';

const LoginPage = () => {
  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Top Right Controls */}
      <div className="absolute top-4 right-4 flex items-center gap-3 z-20">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>

      {/* Left Section - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center">
        <LoginForm />
      </div>

      {/* Right Section - Image */}
      <LoginImage />
    </div>
  );
};

export default LoginPage;