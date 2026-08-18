import { useTranslation } from 'react-i18next';

const PaymentStatsBar = ({ stats, loading }) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-3" />
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const cards = [
    {
      label: t('payments.totalCollected'),
      value: stats.totalCollectedAmount.toLocaleString(),
      suffix: 'SYR',
      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      gradient: 'from-emerald-500 to-teal-600',
    },
    {
      label: t('payments.pendingAmount'),
      value: stats.pendingAmount.toLocaleString(),
      suffix: 'SYR',
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      gradient: 'from-amber-500 to-orange-600',
    },
    {
      label: t('payments.successfulPayments'),
      value: `${stats.successfulPaymentsCount}/${stats.paymentsCount}`,
      suffix: '',
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      gradient: 'from-blue-500 to-indigo-600',
    },
    {
      label: t('payments.totalInvoicesAmount'),
      value: stats.totalInvoicesAmount.toLocaleString(),
      suffix: 'SYR',
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      gradient: 'from-purple-500 to-pink-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {cards.map((card, i) => (
        <div key={i} className={`bg-gradient-to-br ${card.gradient} rounded-xl shadow-lg p-6 text-white relative overflow-hidden`}>
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-white/80 text-sm font-medium mb-1">{card.label}</p>
              <p className="text-3xl font-bold tracking-tight">
                {card.value}
                {card.suffix && <span className="text-lg font-normal ml-1 text-white/70">{card.suffix}</span>}
              </p>
            </div>
            <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
              </svg>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaymentStatsBar;