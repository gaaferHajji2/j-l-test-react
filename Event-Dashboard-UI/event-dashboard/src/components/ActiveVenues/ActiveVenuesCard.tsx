import { useTranslation } from 'react-i18next';

const ActiveVenueCard = ({ venue }) => {
  const { t } = useTranslation();

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
        <img
          src={venue.imageUrl}
          alt={venue.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/90 backdrop-blur-sm text-white text-[10px] font-bold rounded-full uppercase tracking-wide">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {venue.status}
          </span>
        </div>

        {/* Price Tag */}
        <div className="absolute bottom-3 right-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1.5 rounded-lg">
          <p className="text-xs text-gray-500 dark:text-gray-400">{t('activeVenues.pricePerDay')}</p>
          <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
            {venue.priceAsNumber.toLocaleString()} SYR
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Name & Address */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">
          {venue.name}
        </h3>
        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-3">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{venue.address}</span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 flex-1">
          {venue.description}
        </p>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 p-2.5 bg-gray-50 dark:bg-gray-700/40 rounded-lg">
            <svg className="w-4 h-4 text-indigo-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('activeVenues.capacity')}</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{venue.capacity.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2.5 bg-gray-50 dark:bg-gray-700/40 rounded-lg">
            <svg className="w-4 h-4 text-indigo-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('activeVenues.joinedAt')}</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{venue.formattedCreatedAt}</p>
            </div>
          </div>
        </div>

        {/* Owner Info */}
        <div className="flex items-center gap-3 p-3 bg-indigo-50 dark:bg-indigo-900/10 rounded-lg border border-indigo-100 dark:border-indigo-800/30 mb-4">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
            {venue.ownerInitials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider mb-0.5">
              {t('activeVenues.owner')}
            </p>
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{venue.ownerDisplayName}</p>
            {venue.owner?.phone && (
              <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{venue.owner.phone}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveVenueCard;