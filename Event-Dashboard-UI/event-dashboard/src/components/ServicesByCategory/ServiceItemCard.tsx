import { useTranslation } from 'react-i18next';

const ServiceItemCard = ({ service }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col sm:flex-row">
      {/* Image */}
      <div className="sm:w-32 h-32 sm:h-auto flex-shrink-0 bg-gray-100 dark:bg-gray-700 overflow-hidden">
        <img
          src={service.imageUrl}
          alt={service.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">{service.name}</h4>
            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
              {service.priceAsNumber.toLocaleString()} SYR
            </span>
          </div>

          {service.description && service.description !== service.name && (
            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">{service.description}</p>
          )}
        </div>

        {/* Vendor Info */}
        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-[8px] font-bold flex-shrink-0">
            {service.vendorInitials}
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">{t('servicesByCategory.vendor')}</p>
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">{service.vendorDisplayName}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceItemCard;