import React from 'react';
import { useTranslation } from 'react-i18next';

const ReceiptModal = ({ payment, onClose }) => {
  const { t } = useTranslation();

  if (!payment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Receipt Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5 text-white flex items-center justify-between">
          <div>
            <p className="text-indigo-200 text-xs font-medium uppercase tracking-wider mb-0.5">{t('payments.paymentDetails')}</p>
            <h2 className="text-xl font-bold">{payment.invoiceId}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Billing Info */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{t('payments.billingTo')}</p>
            <p className="font-semibold text-gray-900 dark:text-white">{payment.customerName}</p>
            <p className="text-gray-500 dark:text-gray-400 text-xs">{payment.customerEmail}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{t('payments.invoiceDate')}</p>
            <p className="font-medium text-gray-900 dark:text-white">{new Date(payment.invoiceDate).toLocaleDateString()}</p>
            <p className="text-gray-500 dark:text-gray-400 text-xs">{t(`paymentMethod.${payment.method}`)}</p>
          </div>
        </div>

        {/* Line Items */}
        <div className="px-6 py-4">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">{payment.eventName}</p>

          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>{t('payments.subtotal')}</span>
              <span className="font-medium">{payment.subtotal.toLocaleString()} SYR</span>
            </div>

            {payment.discount > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                <span>{t('payments.discount')}</span>
                <span className="font-medium">-{payment.discount.toLocaleString()} SYR</span>
              </div>
            )}

            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>{t('payments.tax')}</span>
              <span className="font-medium">{payment.tax.toLocaleString()} SYR</span>
            </div>

            <div className="pt-3 mt-3 border-t border-dashed border-gray-300 dark:border-gray-600 flex justify-between items-end">
              <span className="text-base font-bold text-gray-900 dark:text-white">{t('payments.total')}</span>
              <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{payment.total.toLocaleString()} <span className="text-sm font-normal text-gray-500">SYR</span></span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        {payment.notes && (
          <div className="mx-6 mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 italic">{payment.notes}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex gap-3">
          <button className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            {t('payments.downloadPdf')}
          </button>
          <button onClick={onClose} className="flex-1 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;