import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DashboardHeader from '../components/Layout/DashboardHeader';
import DashboardSidebar from '../components/Layout/DashboardSidebar';
import VenueCard from '../components/Venues/VenueCard';
import VenueFormModal from '../components/Venues/VenueFormModal';
import VendorConnectionPanel from '../components/Venues/VendorConnectionPanel';
import { venueService } from '../services/venueService';

const VenuesPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', type: 'all' });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVenue, setEditingVenue] = useState(null);
  const [selectedVenueForVendors, setSelectedVenueForVendors] = useState(null);

  const fetchVenues = useCallback(async () => {
    setLoading(true);
    try {
      const data = await venueService.getAll(filters);
      setVenues(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchVenues(); }, [fetchVenues]);

  const handleEdit = (venue) => { setEditingVenue(venue); setIsFormOpen(true); };
  const handleAddNew = () => { setEditingVenue(null); setIsFormOpen(true); };
  const handleFormSuccess = () => {
    fetchVenues();
    alert(editingVenue ? t('venues.updateSuccess') : t('venues.createSuccess'));
  };
  const handleLogout = () => { localStorage.removeItem('authToken'); navigate('/login'); };

  const types = venueService.getTypes();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader onLogout={handleLogout} />
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('venues.title')}</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">{t('venues.subtitle')}</p>
              </div>
              <button onClick={handleAddNew} className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-lg shadow-indigo-500/30">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                {t('venues.addVenue')}
              </button>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <input type="text" placeholder={t('venues.searchPlaceholder')} value={filters.search} onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <select value={filters.type} onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                  <option value="all">{t('venues.allTypes')}</option>
                  {types.map(tp => <option key={tp} value={tp}>{t(`venueTypes.${tp}`)}</option>)}
                </select>
              </div>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <svg className="animate-spin h-8 w-8 text-indigo-600" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
              </div>
            ) : venues.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {venues.map(venue => (
                  <VenueCard key={venue.id} venue={venue} onEdit={handleEdit} onViewVendors={setSelectedVenueForVendors} />
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-16 text-center">
                <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">{t('venues.noVenuesFound')}</h3>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      <VenueFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} editingVenue={editingVenue} onSuccess={handleFormSuccess} />
      <VendorConnectionPanel venue={selectedVenueForVendors} onClose={() => setSelectedVenueForVendors(null)} />
    </div>
  );
};

export default VenuesPage;