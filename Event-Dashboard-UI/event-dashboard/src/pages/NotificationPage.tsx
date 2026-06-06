import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DashboardHeader from '../components/Layout/DashboardHeader';
import DashboardSidebar from '../components/Layout/DashboardSidebar';
import ComposeNotification from '../components/Notifications/ComposeNotification';
import NotificationHistory from '../components/Notifications/NotificationHistory';
import { notificationService } from '../services/notificationService';

const NotificationsPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      const data = await notificationService.getHistory();
      setHistory(data);
    } catch (error) {
      console.error('Error fetching notification history:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleSent = () => {
    alert(t('notifications.sendSuccess'));
    fetchHistory();
  };

  const handleDelete = async (id) => {
    try {
      await notificationService.delete(id);
      fetchHistory();
      alert(t('notifications.deleteSuccess'));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader onLogout={handleLogout} />
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('notifications.title')}</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">{t('notifications.subtitle')}</p>
            </div>

            {/* Compose Form */}
            <ComposeNotification onSent={handleSent} />

            {/* History */}
            <NotificationHistory history={history} loading={loading} onDelete={handleDelete} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default NotificationsPage;