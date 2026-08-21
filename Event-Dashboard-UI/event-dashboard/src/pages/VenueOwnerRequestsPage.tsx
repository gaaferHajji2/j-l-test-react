import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DashboardHeader from '../components/Layout/DashboardHeader';
import DashboardSidebar from '../components/Layout/DashboardSidebar';
import VenueOwnerRequestCard from '../components/VenueOwnerRequests/VenueOwnerRequestCard';
import VenueOwnerRequestsFilter from '../components/VenueOwnerRequests/VenueOwnerRequestsFilter';
import { venueOwnerRequestService } from '../services/venueOwnerRequestService';

const VenueOwnerRequestsPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    type: 'all',
    sortBy: { field: 'created_at', order: 'desc' },
  });

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const data = await venueOwnerRequestService.getAll(filters);
      setRequests(data);
    } catch (err) {
      console.error('Error fetching venue owner requests:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const handleApprove = async (requestId) => {
    try {
      await venueOwnerRequestService.approve(requestId);
      await fetchRequests();
      alert(t('venueOwnerRequests.approveSuccess'));
    } catch (error) {
      console.error('Error approving venue owner request:', error);
      alert('Error approving venue owner request');
    }
  };

  const handleReject = async (requestId, reason) => {
    try {
      await venueOwnerRequestService.reject(requestId, reason);
      await fetchRequests();
      alert(t('venueOwnerRequests.rejectSuccess'));
    } catch (error) {
      console.error('Error rejecting venue owner request:', error);
      alert('Error rejecting venue owner request');
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
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('venueOwnerRequests.title')}</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">{t('venueOwnerRequests.subtitle')}</p>
            </div>

            <VenueOwnerRequestsFilter filters={filters} onFilterChange={setFilters} />

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-pulse">
                    <div className="h-40 bg-gray-200 dark:bg-gray-700" />
                    <div className="p-5 space-y-3">
                      <div className="flex items-center gap-3"><div className="w-9 h-9 bg-gray-200 dark:bg-gray-700 rounded-full" /><div className="flex-1 space-y-2"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" /><div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" /></div></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                      <div className="grid grid-cols-2 gap-2"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" /><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" /></div>
                    </div>
                    <div className="p-5 border-t border-gray-200 dark:border-gray-700"><div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" /></div>
                  </div>
                ))}
              </div>
            ) : requests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {requests.map(request => (
                  <VenueOwnerRequestCard key={request.id} request={request} onApprove={handleApprove} onReject={handleReject} />
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-16 text-center">
                <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">{t('venueOwnerRequests.noRequestsFound')}</h3>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default VenueOwnerRequestsPage;