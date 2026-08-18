import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DashboardHeader from '../components/Layout/DashboardHeader';
import DashboardSidebar from '../components/Layout/DashboardSidebar';
import ServiceCard from '../components/Products/ProductCard';
import ProductsFilter from '../components/Products/ProductsFilter';
import { productService } from '../services/productService';

const ServicesPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [services, setServices] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    vendorId: 'all',
    sortBy: { field: 'created_at', order: 'desc' },
  });

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const data = await productService.getAll(filters);
      setServices(data);
    } catch (err) {
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    setVendors(productService.getVendors());
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleStatusChange = async (serviceId, newStatus, reason = null) => {
    try {
      await productService.updateStatus(serviceId, newStatus, reason);
      await fetchServices();

      const successMap = {
        active: t('services.activateSuccess'),
        rejected: t('services.rejectSuccess'),
        inactive: t('services.deactivateSuccess'),
      };
      alert(successMap[newStatus] || 'Status updated');
    } catch (error) {
      console.error('Error updating service status:', error);
      alert('Error updating service status');
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
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('products.title')}</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">{t('products.subtitle')}</p>
            </div>

            {/* Filters */}
            <ProductsFilter filters={filters} onFilterChange={setFilters} vendors={vendors} />

            {/* Content */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-pulse">
                    <div className="h-44 bg-gray-200 dark:bg-gray-700" />
                    <div className="p-5 space-y-3">
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                      <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded w-full mt-4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : services.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {services.map(service => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-16 text-center">
                <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">{t('services.noServicesFound')}</h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ServicesPage;