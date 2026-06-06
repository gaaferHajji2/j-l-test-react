import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DashboardHeader from '../components/Layout/DashboardHeader';
import DashboardSidebar from '../components/Layout/DashboardSidebar';
import PaymentStatsBar from '../components/Payments/PaymentStatsBar';
import PaymentRow from '../components/Payments/PaymentRow';
import ReceiptModal from '../components/Payments/ReceiptModal';
import { paymentService } from '../services/paymentService';

const PaymentsPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [filters, setFilters] = useState({ search: '', status: 'all' });

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await paymentService.getAll(filters);
      setPayments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const data = await paymentService.getStats();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => { fetchPayments(); }, [fetchPayments]);
  useEffect(() => { fetchStats(); }, []);

  const handleMarkPaid = async (id) => {
    try {
      await paymentService.markAsPaid(id);
      fetchPayments();
      fetchStats();
      alert(t('payments.markPaidSuccess'));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendReminder = async () => {
    await new Promise(r => setTimeout(r, 300));
    alert(t('payments.reminderSent'));
  };

  const handleLogout = () => { localStorage.removeItem('authToken'); navigate('/login'); };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader onLogout={handleLogout} />
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('payments.title')}</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">{t('payments.subtitle')}</p>
            </div>

            {/* Stats */}
            <PaymentStatsBar stats={stats} loading={statsLoading} />

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder={t('payments.searchPlaceholder')}
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  />
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                >
                  <option value="all">{t('payments.allStatuses')}</option>
                  <option value="paid">{t('paymentStatus.paid')}</option>
                  <option value="pending">{t('paymentStatus.pending')}</option>
                  <option value="overdue">{t('paymentStatus.overdue')}</option>
                  <option value="refunded">{t('paymentStatus.refunded')}</option>
                </select>
              </div>
            </div>

            {/* Payment List */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 animate-pulse">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : payments.length > 0 ? (
              <div className="space-y-3">
                {payments.map(payment => (
                  <PaymentRow
                    key={payment.id}
                    payment={payment}
                    onMarkPaid={handleMarkPaid}
                    onSendReminder={handleSendReminder}
                    onViewReceipt={setSelectedReceipt}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-16 text-center">
                <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">{t('payments.noPaymentsFound')}</h3>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Receipt Modal */}
      <ReceiptModal payment={selectedReceipt} onClose={() => setSelectedReceipt(null)} />
    </div>
  );
};

export default PaymentsPage;