import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ServiceItemCard from './ServiceItemCard';

const CategorySection = ({ category, defaultExpanded = false }) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Category Header (clickable) */}
      <button
        onClick={() => setIsExpanded(prev => !prev)}
        className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-900/30 dark:hover:to-purple-900/30 transition-colors text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {category.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-bold text-gray-900 dark:text-white truncate">{category.name}</h3>
            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              <span>{t('servicesByCategory.servicesCount', { count: category.servicesCount })}</span>
              {category.hasServices && (
                <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                  {t('servicesByCategory.priceFrom', { price: category.minPrice.toLocaleString() })}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Chevron */}
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Services Grid (collapsible) */}
      {isExpanded && (
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          {category.services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {category.services.map(service => (
                <ServiceItemCard key={service.id} service={service} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('servicesByCategory.noServicesInCategory')}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategorySection;