import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const PaymentRow = ({ payment, onMarkPaid, onSendReminder, onViewReceipt }) => {
  const { t } = useTranslation();
  const [showConfirm, setShowConfirm] = useState(false);

  const getStatusBadge = (status) => {
    const styles = {
      success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
      failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
      refunded: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600',
      pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
        {t(`paymentStatus.${status}`)}
      </span>
    );
  };

  const isOverdue = payment.status === 'failed';

  return (
    <div className={`group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all border ${isOverdue ? 'border-red-200 dark:border-red-800/50' : 'border-gray-200 dark:border-gray-700'} overflow-hidden`}>
      <div className="p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left: Invoice Info */}
          <div className="flex items-start gap-4 min-w-0 flex-1">
            {/* Icon */}
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${payment.status === 'paid' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' :
              payment.status === 'overdue' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
              }`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">{payment.invoiceId}</h3>
                {getStatusBadge(payment.status)}
              </div>
              <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium truncate mb-0.5">
                {payment.eventName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {payment.customerName}{payment.venueName ? ` • ${payment.venueName}` : ''}
              </p>
            </div>
          </div>

          {/* Center: Amount & Dates */}
          <div className="flex items-center gap-6 lg:gap-8 pl-16 lg:pl-0">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{t('payments.amount')}</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{payment.amountAsNumber.toLocaleString()} <span className="text-xs font-normal text-gray-500">SYR</span></p>
            </div>
            <div className="hidden sm:block">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{t('payments.method')}</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{payment.paymentMethod.replace('_', ' ')}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                {payment.paidAt ? t('payments.paidAt') : t('payments.dueDate')}
              </p>
              <p className={`text-sm font-medium ${isOverdue ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}`}>
                {new Date(payment.paidAt || payment.dueDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 pl-16 lg:pl-0">
            {showConfirm ? (
              <div className="flex items-center gap-1.5">
                <button onClick={() => { onMarkPaid(payment.id); setShowConfirm(false); }} className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg transition-colors">Confirm</button>
                <button onClick={() => setShowConfirm(false)} className="px-3 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 text-xs font-medium rounded-lg transition-colors">Cancel</button>
              </div>
            ) : (
              <>
                {/* <button
                  onClick={() => onViewReceipt(payment.id)}
                  className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-xs font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  {t('payments.viewReceipt')}
                </button> */}

                {(payment.status === 'pending' || payment.status === 'overdue') && (
                  <>
                    <button
                      onClick={() => setShowConfirm(true)}
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg transition-colors"
                    >
                      {t('payments.markAsPaid')}
                    </button>
                    <button
                      onClick={() => onSendReminder(payment.id)}
                      className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium rounded-lg transition-colors"
                    >
                      {t('payments.sendReminder')}
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentRow;