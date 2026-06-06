import { useTranslation } from 'react-i18next';

const ProductsFilter = ({ filters, onFilterChange, vendors }) => {
  const { t } = useTranslation();

  const handleSortChange = (field) => {
    const currentOrder = filters.sortBy?.field === field && filters.sortBy.order === 'asc' ? 'desc' : 'asc';
    onFilterChange({ ...filters, sortBy: { field, order: currentOrder } });
  };

  const getSortIcon = (field) => {
    if (filters.sortBy?.field !== field) {
      return <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>;
    }
    return filters.sortBy.order === 'asc'
      ? <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
      : <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative lg:col-span-1">
          <input
            type="text"
            placeholder={t('products.searchPlaceholder')}
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>

        {/* Status Filter */}
        <select
          value={filters.status || 'all'}
          onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
        >
          <option value="all">{t('products.allStatuses')}</option>
          <option value="pending">{t('productStatus.pending')}</option>
          <option value="active">{t('productStatus.active')}</option>
          <option value="inactive">{t('productStatus.inactive')}</option>
          <option value="rejected">{t('productStatus.rejected')}</option>
        </select>

        {/* Vendor Filter */}
        <select
          value={filters.vendorId || 'all'}
          onChange={(e) => onFilterChange({ ...filters, vendorId: e.target.value })}
          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
        >
          <option value="all">{t('products.allVendors')}</option>
          {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
        </select>

        {/* Sort Buttons */}
        <div className="flex gap-2">
          <button onClick={() => handleSortChange('price')} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-xs font-medium">
            {t('products.price')}{getSortIcon('price')}
          </button>
          <button onClick={() => handleSortChange('submittedAt')} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-xs font-medium">
            {t('products.submittedAt')}{getSortIcon('submittedAt')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductsFilter;