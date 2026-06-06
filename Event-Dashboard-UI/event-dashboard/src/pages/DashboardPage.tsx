import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DashboardHeader from '../components/Layout/DashboardHeader';
import DashboardSidebar from '../components/Layout/DashboardSidebar';
import StatsCards from '../components/Dashboard/StatsCards';
import EventStatusChart from '../components/Charts/EventStatusChart';
import MonthlyEventsChart from '../components/Charts/MonthlyEventsChart';
import RecentEventsTable from '../components/Dashboard/RecentEventsTable';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  // Simulate fetching dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockData = {
          stats: {
            total: 93,
            pending: 18,
            approved: 65,
            rejected: 10,
          },
          monthlyEvents: [
            { month: 'Jan', pending: 4, approved: 12, rejected: 2 },
            { month: 'Feb', pending: 6, approved: 15, rejected: 3 },
            { month: 'Mar', pending: 3, approved: 18, rejected: 1 },
            { month: 'Apr', pending: 5, approved: 20, rejected: 4 },
            { month: 'May', pending: 2, approved: 16, rejected: 2 },
            { month: 'Jun', pending: 3, approved: 14, rejected: 1 },
          ],
          recentEvents: [
            { id: 1, name: 'Tech Conference 2026', date: '2026-06-15', status: 'approved' },
            { id: 2, name: 'Music Festival', date: '2026-07-01', status: 'pending' },
            { id: 3, name: 'Art Exhibition', date: '2026-06-20', status: 'approved' },
            { id: 4, name: 'Food Fair', date: '2026-06-25', status: 'rejected' },
            { id: 5, name: 'Sports Tournament', date: '2026-07-10', status: 'pending' },
          ],
        };
        
        setDashboardData(mockData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    // Clear authentication token/session
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-gray-700 dark:text-gray-300">{t('common.loading')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader onLogout={handleLogout} />
      
      <div className="flex">
        <DashboardSidebar />
        
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Page Title */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {t('dashboard.welcome')}
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {t('dashboard.overview')}
              </p>
            </div>

            {/* Stats Cards */}
            <StatsCards stats={dashboardData?.stats} />

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MonthlyEventsChart data={dashboardData?.monthlyEvents} />
              <EventStatusChart data={dashboardData?.stats} />
            </div>

            {/* Recent Events Table */}
            <RecentEventsTable events={dashboardData?.recentEvents} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;