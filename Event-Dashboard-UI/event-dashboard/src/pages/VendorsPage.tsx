import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import DashboardHeader from '../components/Layout/DashboardHeader'
import DashboardSidebar from '../components/Layout/DashboardSidebar'
import VendorsFilter from '../components/Vendors/VendorFilter'
import VendorCard from '../components/Vendors/VendorCard'
import { vendorService } from '../services/vendorService'

const VendorsPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    sortBy: { field: 'submittedAt', order: 'desc' },
  });

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const data = await vendorService.getAll(filters);
      setVendors(data);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, [filters]);

  const handleStatusChange = async (vendorId, newStatus) => {
    try {
      await vendorService.updateStatus(vendorId, newStatus);
      await fetchVendors();
      
      const successMessages = {
        active: t('vendors.approveSuccess'),
        rejected: t('vendors.rejectSuccess'),
        inactive: t('vendors.deactivateSuccess'),
      };
      
      alert(successMessages[newStatus] || 'Status updated successfully');
    } catch (error) {
      console.error('Error updating vendor status:', error);
      alert('Error updating vendor status');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader onLogout={handleLogout} />
      
      <div className="flex">
        <DashboardSidebar />
        
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {t('vendors.title')}
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {t('vendors.subtitle')}
              </p>
            </div>

            {/* Filters */}
            <VendorsFilter filters={filters} onFilterChange={setFilters} />

            {/* Loading State */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-3">
                  <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">{t('common.loading')}</span>
                </div>
              </div>
            ) : vendors.length > 0 ? (
              /* Vendors Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {vendors.map((vendor) => (
                  <VendorCard
                    key={vendor.id}
                    vendor={vendor}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
                <svg
                  className="mx-auto h-16 w-16 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                  {t('vendors.noVendorsFound')}
                </h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default VendorsPage;