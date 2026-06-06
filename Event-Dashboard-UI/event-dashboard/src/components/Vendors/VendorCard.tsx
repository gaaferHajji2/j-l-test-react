import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const VendorCard = ({ vendor, onStatusChange }) => {
  const { t } = useTranslation();
  const [showConfirm, setShowConfirm] = useState(null);

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
      active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
      inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
        {t(`vendorStatus.${status}`)}
      </span>
    );
  };

  const handleAction = async (newStatus) => {
    try {
      await onStatusChange(vendor.id, newStatus);
      setShowConfirm(null);
    } catch (error) {
      console.error('Error updating vendor status:', error);
    }
  };

  const renderActions = () => {
    if (showConfirm) {
      const confirmMessages = {
        active: t('vendors.confirmApprove'),
        rejected: t('vendors.confirmReject'),
      };
      
      // For inactive vendors being activated
      if (vendor.status === 'inactive' && showConfirm === 'active') {
        confirmMessages.active = t('vendors.confirmActivate');
      }
      // For active vendors being deactivated
      if (vendor.status === 'active' && showConfirm === 'inactive') {
        confirmMessages.inactive = t('vendors.confirmDeactivate');
      }

      return (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-600 dark:text-gray-400">
            {confirmMessages[showConfirm]}
          </span>
          <button
            onClick={() => handleAction(showConfirm)}
            className={`px-3 py-1.5 text-white text-xs font-medium rounded transition-colors ${
              showConfirm === 'active' 
                ? 'bg-green-600 hover:bg-green-700' 
                : showConfirm === 'inactive'
                  ? 'bg-gray-600 hover:bg-gray-700'
                  : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            Confirm
          </button>
          <button
            onClick={() => setShowConfirm(null)}
            className="px-3 py-1.5 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 text-xs font-medium rounded transition-colors"
          >
            Cancel
          </button>
        </div>
      );
    }

    // Pending vendor actions
    if (vendor.status === 'pending') {
      return (
        <>
          <button
            onClick={() => setShowConfirm('active')}
            className="px-2 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {t('actions.approve')}
          </button>
          <button
            onClick={() => setShowConfirm('rejected')}
            className="px-2 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            {t('actions.reject')}
          </button>
        </>
      );
    }

    // Active vendor can be deactivated
    if (vendor.status === 'active') {
      return (
        <button
          onClick={() => setShowConfirm('inactive')}
          className="px-2 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
          Deactivate
        </button>
      );
    }

    // Inactive vendor can be reactivated
    if (vendor.status === 'inactive') {
      return (
        <button
          onClick={() => setShowConfirm('active')}
          className="px-2 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Activate
        </button>
      );
    }

    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700">
      {/* Card Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              {vendor.businessName.charAt(0)}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {vendor.businessName}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {vendor.contactPerson}
              </p>
            </div>
          </div>
          <div className="ml-1 flex-shrink-0">
            {getStatusBadge(vendor.status)}
          </div>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-2">
          {vendor.description}
        </p>
      </div>

      {/* Card Body */}
      <div className="p-6 space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className="text-gray-700 dark:text-gray-300 truncate">{vendor.email}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span className="text-gray-700 dark:text-gray-300">{vendor.phone}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <span className="text-gray-700 dark:text-gray-300">{vendor.category}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-gray-700 dark:text-gray-300">
            {new Date(vendor.submittedAt).toLocaleDateString()}
          </span>
        </div>

        {vendor.documents > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-gray-700 dark:text-gray-300">{vendor.documents} documents attached</span>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center justify-between gap-3">
          <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium whitespace-nowrap">
            {t('vendors.viewDetails')}
          </button>
          
          <div className="flex items-center gap-2 flex-wrap justify-end">
            {renderActions()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorCard;