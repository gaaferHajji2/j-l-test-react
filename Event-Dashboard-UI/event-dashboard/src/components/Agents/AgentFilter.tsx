import React from 'react';
import { useTranslation } from 'react-i18next';

const AgentsFilter = ({ filters, onFilterChange }) => {
  const { t } = useTranslation();

  const handleSortChange = (field) => {
    const currentOrder = filters.sortBy?.field === field && filters.sortBy.order === 'asc' ? 'desc' : 'asc';
    onFilterChange({ ...filters, sortBy: { field, order: currentOrder } });
  };

  const getSortIcon = (field) => {
    if (filters.sortBy?.field !== field) return <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>;
    return filters.sortBy.order === 'asc'
      ? <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
      : <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <input type="text" placeholder={t('agents.searchPlaceholder')} value={filters.search || ''} onChange={(e) => onFilterChange({ ...filters, search: e.target.value })} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>

        <select value={filters.status || 'all'} onChange={(e) => onFilterChange({ ...filters, status: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
          <option value="all">{t('agents.allStatuses')}</option>
          <option value="active">{t('agentStatus.active')}</option>
          <option value="inactive">{t('agentStatus.inactive')}</option>
          <option value="onLeave">{t('agentStatus.onLeave')}</option>
        </select>

        <div className="flex gap-2">
          <button onClick={() => handleSortChange('fullName')} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
            <span className="text-sm">{t('agents.fullNameLabel')}</span>{getSortIcon('fullName')}
          </button>
          <button onClick={() => handleSortChange('venue')} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
            <span className="text-sm">{t('agents.venueLabel')}</span>{getSortIcon('venue')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentsFilter;