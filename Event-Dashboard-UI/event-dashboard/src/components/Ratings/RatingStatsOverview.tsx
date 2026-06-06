import { useTranslation } from 'react-i18next';
import StarDisplay from './StarDisplay';

const RatingStatsOverview = ({ stats, loading }) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4" />
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Average Score Card */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl shadow-lg p-6 text-white">
        <p className="text-indigo-200 text-sm font-medium mb-2">{t('ratings.averageScore')}</p>
        <div className="flex items-end gap-3">
          <span className="text-5xl font-bold">{stats?.average}</span>
          <span className="text-indigo-200 text-lg mb-1">/ 5</span>
        </div>
        <div className="mt-3">
          <StarDisplay score={Math.round(Number(stats?.average))} size="lg" />
        </div>
      </div>

      {/* Total Reviews Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex flex-col justify-center">
        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">{t('ratings.totalReviews')}</p>
        <p className="text-5xl font-bold text-gray-900 dark:text-white">{stats?.total}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">across all events</p>
      </div>

      {/* Score Distribution Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <p className="text-gray-900 dark:text-white text-sm font-semibold mb-4">{t('ratings.scoreDistribution')}</p>
        <div className="space-y-2">
          {stats?.distribution?.map((item) => (
            <div key={item.score} className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400 w-3">{item.score}</span>
              <svg className="w-3 h-3 text-yellow-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    item.score >= 4 ? 'bg-green-500' : item.score >= 3 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 w-8 text-right">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RatingStatsOverview;