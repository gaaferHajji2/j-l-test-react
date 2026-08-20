import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DashboardHeader from '../components/Layout/DashboardHeader';
import DashboardSidebar from '../components/Layout/DashboardSidebar';
import ActiveVenueCard from '../components/ActiveVenues/ActiveVenuesCard';
import { activeVenueService } from '../services/activeVenueService';

const ActiveVenuesPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [venues, setVenues] = useState([]);
  const [allVenuesCount, setAllVenuesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchVenues = useCallback(async () => {
    setLoading(true);
    try {
      const data = await activeVenueService.getAll(debouncedSearch);
      setVenues(data);
      // Track total count only on initial load (no search)
      if (!debouncedSearch) {
        setAllVenuesCount(data.length);
      }
    } catch (err) {
      console.error('Error fetching active venues:', err);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    fetchVenues();
  }, [fetchVenues]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader onLogout={() => handleLogout()} />
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('activeVenues.title')}</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">{t('activeVenues.subtitle')}</p>
            </div>

            {/* Search Bar + Count */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="relative flex-1 max-w-xl">
                <input
                  type="text"
                  placeholder={t('activeVenues.searchPlaceholder')}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm shadow-sm"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {!loading && (
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">
                  {t('activeVenues.totalActive', { count: debouncedSearch ? venues.length : allVenuesCount })}
                </span>
              )}
            </div>

            {/* Content */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-200 dark:bg-gray-700" />
                    <div className="p-5 space-y-3">
                      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                      <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-full mt-2" />
                      <div className="grid grid-cols-2 gap-3">
                        <div className="h-14 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                        <div className="h-14 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                      </div>
                      <div className="h-14 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                    </div>
                  </div>
                ))}
              </div>
            ) : venues.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {venues.map(venue => (
                  <ActiveVenueCard key={venue.id} venue={venue} />
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-16 text-center">
                <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">{t('activeVenues.noVenuesFound')}</h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400">{t('activeVenues.tryAdjusting')}</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ActiveVenuesPage;