import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DashboardHeader from '../components/Layout/DashboardHeader';
import DashboardSidebar from '../components/Layout/DashboardSidebar';
import EventTypeForm from '../components/EventTypes/EventTypeForm';
import EventTypesTable from '../components/EventTypes/EventTypesTable';
import { eventTypeService } from '../services/eventTypeService';

const EventTypesPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingType, setEditingType] = useState(null);

  const fetchTypes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await eventTypeService.getAll();
      setTypes(data);
    } catch (error) {
      console.error('Error fetching event types:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTypes();
  }, [fetchTypes]);

  const handleFormSuccess = () => {
    fetchTypes();
    setEditingType(null);
    alert(editingType ? t('eventTypes.updateSuccess') : t('eventTypes.addSuccess'));
  };

  const handleEdit = (type) => {
    setEditingType(type);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    try {
      await eventTypeService.delete(id);
      fetchTypes();
      alert(t('eventTypes.deleteSuccess'));
    } catch (error) {
      console.error('Error deleting event type:', error);
      alert('Error deleting event type');
    }
  };

  const handleCancelEdit = () => {
    setEditingType(null);
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
          <div className="max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {t('eventTypes.title')}
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {t('eventTypes.subtitle')}
              </p>
            </div>

            {/* Add / Edit Form */}
            <EventTypeForm
              editingType={editingType}
              onSuccess={handleFormSuccess}
              onCancel={handleCancelEdit}
            />

            {/* Types Table */}
            <EventTypesTable
              types={types}
              loading={loading}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default EventTypesPage;