import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DashboardHeader from '../components/Layout/DashboardHeader';
import DashboardSidebar from '../components/Layout/DashboardSidebar';
import RatingStatsOverview from '../components/Ratings/RatingStatsOverview';
import RatingsFilter from '../components/Ratings/RatingsFilter';
import RatingCard from '../components/Ratings/RatingCard';
import { ratingService } from '../services/ratingService';

const RatingsPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [ratings, setRatings] = useState([]);
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', score: 'all', eventId: 'all' });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [result, venues] = await Promise.all([
        ratingService.getAll(filters),
        ratingService.getUniqueVenues(),
      ]);
      setRatings(result.ratings);
      setStats(result.stats);
      setEvents(venues);
    } catch (err) {
      console.error('Error fetching ratings:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader />
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('ratings.title')}</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">{t('ratings.subtitle')}</p>
            </div>

            {/* Stats Overview */}
            <RatingStatsOverview stats={stats} loading={loading} />

            {/* Filters */}
            <RatingsFilter filters={filters} onFilterChange={setFilters} events={events} />

            {/* Ratings List */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-pulse">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                      </div>
                    </div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  </div>
                ))}
              </div>
            ) : ratings.length > 0 ? (
              <div className="space-y-4">
                {ratings.map((rating, index) => (
                  <RatingCard
                    key={`${rating.venueId}-${index}`}
                    rating={{
                      id: index,
                      eventId: rating.venueId,
                      eventName: `Venue #${rating.venueId}`,
                      customerId: null,
                      customerName: rating.customerName,
                      customerAvatar: null,
                      score: rating.rating,
                      description: rating.comment,
                      isVerified: true,
                      helpfulCount: 0,
                      isFlagged: false,
                      adminResponse: null,
                      respondedAt: null,
                      submittedAt: rating.createdAt,
                    }}
                    onRespond={() => {}}
                    onFlag={() => {}}
                    onDelete={() => {}}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-16 text-center">
                <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">{t('ratings.noRatingsFound')}</h3>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default RatingsPage;