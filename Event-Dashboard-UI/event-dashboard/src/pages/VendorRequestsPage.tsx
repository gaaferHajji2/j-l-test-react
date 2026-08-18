import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DashboardHeader from '../components/Layout/DashboardHeader';
import DashboardSidebar from '../components/Layout/DashboardSidebar';
import VendorRequestCard from '../components/VendorRequests/RequestVendorCard';
import VendorRequestsFilter from '../components/VendorRequests/VendorRequestsFilter';
import { vendorRequestService } from '../services/vendorRequestService';

const VendorRequestsPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    sortBy: { field: 'created_at', order: 'desc' },
  });

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const data = await vendorRequestService.getAll(filters);
      setRequests(data);
    } catch (err) {
      console.error('Error fetching vendor requests:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

const handleApprove = async (requestId) => {
  try {
    await vendorRequestService.approve(requestId);
    await fetchRequests();
    alert(t('vendorRequests.approveSuccess'));
  } catch (error) {
    console.error('Error approving vendor request:', error);
    alert('Error approving vendor request');
  }
};

const handleReject = async (requestId, reason) => {
  try {
    await vendorRequestService.reject(requestId, reason);
    await fetchRequests();
    alert(t('vendorRequests.rejectSuccess'));
  } catch (error) {
    console.error('Error rejecting vendor request:', error);
    alert('Error rejecting vendor request');
  }
};
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader />
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('vendorRequests.title')}</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">{t('vendorRequests.subtitle')}</p>
            </div>

            {/* Filters */}
            <VendorRequestsFilter filters={filters} onFilterChange={setFilters} />

            {/* Content */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-pulse">
                    <div className="p-5 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-11 h-11 bg-gray-200 dark:bg-gray-700 rounded-full" />
                        <div className="flex-1 space-y-2"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" /><div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" /></div>
                      </div>
                      <div className="flex gap-2"><div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-20" /><div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16" /></div>
                    </div>
                    <div className="p-5 space-y-3">
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                    </div>
                    <div className="p-5 border-t border-gray-200 dark:border-gray-700"><div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" /></div>
                  </div>
                ))}
              </div>
            ) : requests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {requests.map(request => (
                  <VendorRequestCard
                    key={request.id}
                    request={request}
                    onApprove={handleApprove}
                    onReject={handleReject}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-16 text-center">
                <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">{t('vendorRequests.noRequestsFound')}</h3>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default VendorRequestsPage;