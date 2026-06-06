import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { I18nProvider } from './context/I18nContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import EventsPage from './pages/EventsPage';
import EventDetailsPage from './pages/EventDetailsPage';
import VendorsPage from './pages/VendorsPage';
import EventTypesPage from './pages/EventTypesPage';
import AgentsPage from './pages/AgentsPage';
import NotificationsPage from './pages/NotificationPage';

// Simple auth check (replace with proper auth logic)
const isAuthenticated = () => {
  return localStorage.getItem('authToken') !== null;
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};
// Dashboard Layout Component (wraps all dashboard pages)
const DashboardLayout = () => {
  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  );
};

function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected Dashboard Routes (Nested) */}
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/dashboard/events" element={<EventsPage />} />
              <Route path="/dashboard/events/:id" element={<EventDetailsPage />} />
              <Route path="/dashboard/vendors" element={<VendorsPage />} />
              <Route path="/dashboard/event-types" element={<EventTypesPage />} />
              <Route path="/dashboard/agents" element={<AgentsPage />} />
              <Route path="/dashboard/notifications" element={<NotificationsPage />} />
              {/* Add more dashboard routes here as needed */}
            </Route>
            
            {/* Redirect root to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Catch-all route for 404 */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </I18nProvider>
    </ThemeProvider>
  );
}

export default App;