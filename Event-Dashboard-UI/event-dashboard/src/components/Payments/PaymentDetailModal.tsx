import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { paymentService } from '../../services/paymentService';

const METHOD_LABELS = {
  credit_card: 'Credit Card',
  bankTransfer: 'Bank Transfer',
  cash: 'Cash',
  check: 'Check',
  wallet: 'Digital Wallet',
};

const PaymentDetailModal = ({ paymentId, onClose }) => {
  const { t } = useTranslation();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!paymentId) return;

    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await paymentService.getById(paymentId);
        setDetail(data);
      } catch (err) {
        console.error('Error fetching payment detail:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [paymentId]);

  if (!paymentId) return null;

  const getStatusColor = (status) => {
    const map = {
      success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
      paid: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
      pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800',
      overdue: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
      refunded: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600',
    };
    return map[status] || map.pending;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('payments.paymentDetails')}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
              <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          ) : detail ? (
            <div className="space-y-6">
              {/* Status + Transaction ID Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-gray-50 dark:bg-gray-700/40 rounded-xl border border-gray-200 dark:border-gray-700">
                <div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(detail.status)}`}>
                    {detail.status.toUpperCase()}
                  </span>
                  {detail.transactionId && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-mono">
                      TXN: {detail.transactionId}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t('payments.amount')}</p>
                  <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    {detail.amountAsNumber.toLocaleString()} <span className="text-sm font-normal text-gray-500">SYR</span>
                  </p>
                </div>
              </div>

              {/* Payment Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white dark:bg-gray-700/30 rounded-lg border border-gray-100 dark:border-gray-700">
                  <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">{t('payments.method')}</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{METHOD_LABELS[detail.paymentMethod] || detail.paymentMethod}</p>
                </div>
                <div className="p-3 bg-white dark:bg-gray-700/30 rounded-lg border border-gray-100 dark:border-gray-700">
                  <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">{t('payments.invoiceId')}</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">#{detail.invoiceId}</p>
                </div>
                <div className="p-3 bg-white dark:bg-gray-700/30 rounded-lg border border-gray-100 dark:border-gray-700">
                  <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">{t('payments.paidAt')}</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{detail.formattedPaidAt || '—'}</p>
                </div>
                <div className="p-3 bg-white dark:bg-gray-700/30 rounded-lg border border-gray-100 dark:border-gray-700">
                  <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">{t('payments.invoiceDate')}</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{detail.formattedCreatedAt}</p>
                </div>
              </div>

              {/* Refund Info (if applicable) */}
              {detail.hasRefund && (
                <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-200 dark:border-amber-800/30">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                    <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Refund Issued</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-amber-800 dark:text-amber-300">Refund Amount</span>
                    <span className="text-sm font-bold text-amber-800 dark:text-amber-300">{detail.refundAmountAsNumber.toLocaleString()} SYR</span>
                  </div>
                  {detail.formattedRefundedAt && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">Refunded at: {detail.formattedRefundedAt}</p>
                  )}
                </div>
              )}

              {/* Invoice Breakdown */}
              {detail.invoice && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-5">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Invoice Breakdown
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-700 dark:text-gray-300">
                      <span>{t('payments.venuePrice')}</span>
                      <span className="font-medium">{detail.venuePriceAsNumber.toLocaleString()} SYR</span>
                    </div>
                    <div className="flex justify-between text-gray-700 dark:text-gray-300">
                      <span>{t('payments.servicesTotal')}</span>
                      <span className="font-medium">{detail.servicesTotalAsNumber.toLocaleString()} SYR</span>
                    </div>
                    <div className="flex justify-between pt-2 mt-2 border-t border-dashed border-gray-300 dark:border-gray-600 font-bold text-gray-900 dark:text-white">
                      <span>{t('payments.total')}</span>
                      <span>{detail.invoiceTotalAsNumber.toLocaleString()} SYR</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Event Details */}
              {detail.invoice?.event && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-5">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Event Information
                  </h3>
                  <div className="p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-xl border border-indigo-100 dark:border-indigo-800/30 space-y-3">
                    <div>
                      <p className="text-base font-bold text-gray-900 dark:text-white">{detail.eventName}</p>
                      {detail.eventType && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-[10px] font-semibold rounded uppercase tracking-wide">
                          {detail.eventType}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        {detail.eventDate}
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {detail.eventTimeRange}
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        {detail.guestsCount} guests
                      </div>
                    </div>
                    {detail.invoice.event.note && (
                      <div className="pt-2 mt-2 border-t border-indigo-200 dark:border-indigo-800/30">
                        <p className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-0.5">Note</p>
                        <p className="text-xs text-indigo-800 dark:text-indigo-300 leading-relaxed">{detail.invoice.event.note}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailModal;