import React from 'react';
import { useTranslation } from 'react-i18next';

const StatsCards = ({ stats }) => {
  const { t } = useTranslation();

  const cards = [
    {
      title: t('stats.totalEvents'),
      value: stats?.total || 0,
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
      color: 'blue',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      textColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: t('stats.pendingEvents'),
      value: stats?.pending || 0,
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      color: 'yellow',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      textColor: 'text-yellow-600 dark:text-yellow-400',
    },
    {
      title: t('stats.approvedEvents'),
      value: stats?.approved || 0,
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      color: 'green',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      textColor: 'text-green-600 dark:text-green-400',
    },
    {
      title: t('stats.rejectedEvents'),
      value: stats?.rejected || 0,
      icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
      color: 'red',
      bgColor: 'bg-red-100 dark:bg-red-900/30',
      textColor: 'text-red-600 dark:text-red-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {card.title}
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {card.value}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${card.bgColor}`}>
              <svg
                className={`w-6 h-6 ${card.textColor}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={card.icon}
                />
              </svg>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;