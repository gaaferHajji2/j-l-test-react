import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { I18nProvider } from './context/I18nContext';
import LoginPage from './pages/LoginPage';

// Placeholder for Dashboard (to be implemented)
const Dashboard = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
      Dashboard - Coming Soon
    </h1>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </I18nProvider>
    </ThemeProvider>
  );
}

export default App;