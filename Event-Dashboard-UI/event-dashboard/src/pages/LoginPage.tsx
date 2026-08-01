import LoginForm from '../components/Login/LoginForm'
import ThemeToggle from '../components/Layout/ThemeToggle'
import LanguageSwitcher from '../components/UI/LanguageSwitcher'
import Logo from "../assets/Logo.jpg"
import DarkLogo from "../assets/Logo_Dark.jpg"
import { Navigate } from 'react-router-dom'

const isAuthenticated = () => {
  console.log("The Auth Token is: ", localStorage.getItem('authToken'))
  return localStorage.getItem('authToken') !== null;
};


const LoginPage = () => {

  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />
  }

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
      <div className="w-full lg:w-1/2 flex items-center justify-center">
        <img src={Logo} className='dark:hidden' />
        <img src={DarkLogo} className='hidden dark:block' />
      </div>
    </div>
  );
};

export default LoginPage;