import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DashboardHeader from '../components/Layout/DashboardHeader';
import DashboardSidebar from '../components/Layout/DashboardSidebar';
import { eventService } from '../services/eventService';

const EventDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const eventData = await eventService.getById(id);
        if (eventData) {
          setEvent(eventData);
        } else {
          setError('Event not found');
        }
      } catch (err) {
        console.error('Error fetching event details:', err);
        setError('Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
      approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
    };

    return (
      <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${styles[status]}`}>
        {t(`status.${status}`)}
      </span>
    );
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <DashboardHeader onLogout={handleLogout} />
        <div className="flex">
          <DashboardSidebar />
          <main className="flex-1 p-6 lg:p-8 flex items-center justify-center">
            <div className="flex items-center gap-3">
              <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">{t('common.loading')}</span>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <DashboardHeader onLogout={handleLogout} />
        <div className="flex">
          <DashboardSidebar />
          <main className="flex-1 p-6 lg:p-8 flex items-center justify-center">
            <div className="text-center">
              <svg className="mx-auto h-16 w-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                {error || 'Event not found'}
              </h3>
              <Link
                to="/dashboard/events"
                className="mt-4 inline-block text-blue-600 dark:text-blue-400 hover:underline"
              >
                {t('eventDetails.backToEvents')}
              </Link>
            </div>
          </main>
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
          <div className="max-w-5xl mx-auto">
            {/* Back Button */}
            <Link
              to="/dashboard/events"
              className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-6 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {t('eventDetails.backToEvents')}
            </Link>

            {/* Header Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-6">
              {/* Gradient Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                        {event.category}
                      </span>
                      {getStatusBadge(event.status)}
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                      {event.name}
                    </h1>
                    <p className="text-white/90 text-lg">
                      {new Date(event.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  
                  {/* Event Icon */}
                  <div className="hidden md:flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-200 dark:divide-gray-700 border-b border-gray-200 dark:border-gray-700">
                <div className="p-6 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('eventDetails.attendees')}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{event.attendees}</p>
                </div>
                <div className="p-6 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('eventDetails.category')}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{event.category}</p>
                </div>
                <div className="p-6 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('eventDetails.organizer')}</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white truncate">{event.organizer}</p>
                </div>
                <div className="p-6 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('eventDetails.createdAt')}</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {new Date(event.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Main Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Description Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {t('eventDetails.description')}
                    </h2>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {event.description || t('eventDetails.noDescription')}
                  </p>
                </div>

                {/* Additional Info Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {t('eventDetails.overview')}
                    </h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Event ID</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">#{event.id.toString().padStart(4, '0')}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Last Updated</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(event.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Sidebar Info */}
              <div className="space-y-6">
                {/* Location Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {t('eventDetails.location')}
                    </h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{event.location}</p>
                </div>

                {/* Date & Time Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                      <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {t('eventDetails.date')}
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-700 dark:text-gray-300 font-medium">
                      {new Date(event.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(event.date).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                {/* Organizer Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                      <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {t('eventDetails.organizer')}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                      {event.organizer.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{event.organizer}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Event Organizer</p>
                    </div>
                  </div>
                </div>

                {/* Status Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
                      <svg className="w-5 h-5 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {t('eventDetails.status')}
                    </h3>
                  </div>
                  <div className="flex items-center justify-center py-4">
                    {getStatusBadge(event.status)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EventDetailsPage;