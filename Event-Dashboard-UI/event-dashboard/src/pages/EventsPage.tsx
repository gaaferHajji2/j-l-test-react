import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardHeader from '../components/Layout/DashboardHeader';
import DashboardSidebar from '../components/Layout/DashboardSidebar';
import EventsFilter from '../components/Events/EventsFilter';
import EventCard from '../components/Events/EventCard';
import { eventService } from '../services/eventService';

const EventsPage = () => {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    sortBy: { field: 'created_at', order: 'desc' },
  });

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await eventService.getAll(filters);
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  const handleAccept = async (eventId) => {
    try {
      // The endpoint POST /venue-owner/events/{id}/accept 
      // should set status to "confirmed" server-side
      await eventService.accept(eventId);
      await fetchEvents();
      alert(t('events.approveSuccess'));
    } catch (error) {
      console.error('Error accepting event:', error);
      alert('Error accepting event');
    }
  };
  const handleReject = async (eventId, reason) => {
    try {
      await eventService.reject(eventId, reason);
      await fetchEvents();
      alert(t('events.rejectSuccess'));
    } catch (error) {
      console.error('Error rejecting event:', error);
      alert('Error rejecting event');
    }
  };
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader onLogout={handleLogout} />

      <div className="flex">
        <DashboardSidebar />

        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {t('events.title')}
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {t('events.subtitle')}
              </p>
            </div>

            {/* Filters */}
            <EventsFilter filters={filters} onFilterChange={setFilters} />

            {/* Loading State */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-3">
                  <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">{t('common.loading')}</span>
                </div>
              </div>
            ) : events.length > 0 ? (
              /* Events Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {events.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onAccept={handleAccept}
                    onReject={handleReject}
                  />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
                <svg
                  className="mx-auto h-16 w-16 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                  {t('events.noEventsFound')}
                </h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default EventsPage;