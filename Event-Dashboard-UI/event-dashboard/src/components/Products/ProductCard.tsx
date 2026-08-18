import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import RejectReasonModal from './RejectReasonModal';

const ServiceCard = ({ service, onStatusChange }) => {
  const { t } = useTranslation();
  const [confirmAction, setConfirmAction] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
      active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
      inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles.pending}`}>
        {t(`productStatus.${status}`)}
      </span>
    );
  };

  const handleNonRejectAction = async (newStatus) => {
    try {
      await onStatusChange(service.id, newStatus, null);
      setConfirmAction(null);
    } catch (error) {
      console.error('Error updating service status:', error);
    }
  };

  const handleRejectConfirmClick = () => {
    setConfirmAction(null);
    setShowRejectModal(true);
  };

  const handleRejectWithReason = async (reason) => {
    try {
      await onStatusChange(service.id, 'rejected', reason);
      setShowRejectModal(false);
    } catch (error) {
      console.error('Error rejecting service:', error);
      throw error;
    }
  };

  const renderActions = () => {
    // Confirmation for activate/deactivate (non-reject)
    if (confirmAction && confirmAction !== 'rejected') {
      const messages = {
        active: t('services.confirmActivate'),
        inactive: t('services.confirmDeactivate'),
      };
      const isDestructive = confirmAction === 'inactive';

      return (
        <div className="flex flex-col gap-2 w-full">
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-snug">{messages[confirmAction]}</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleNonRejectAction(confirmAction)}
              className={`flex-1 px-3 py-2 text-white text-xs font-medium rounded-lg transition-colors ${
                isDestructive ? 'bg-gray-600 hover:bg-gray-700' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              Confirm
            </button>
            <button onClick={() => setConfirmAction(null)} className="flex-1 px-3 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 text-xs font-medium rounded-lg transition-colors">
              Cancel
            </button>
          </div>
        </div>
      );
    }

    // Confirmation for reject — opens reason modal
    if (confirmAction === 'rejected') {
      return (
        <div className="flex flex-col gap-2 w-full">
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-snug">{t('services.confirmReject')}</p>
          <div className="flex items-center gap-2">
            <button onClick={handleRejectConfirmClick} className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg transition-colors">
              Confirm
            </button>
            <button onClick={() => setConfirmAction(null)} className="flex-1 px-3 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 text-xs font-medium rounded-lg transition-colors">
              Cancel
            </button>
          </div>
        </div>
      );
    }

    // Pending → Activate or Reject
    if (service.isPending) {
      return (
        <>
          <button onClick={() => setConfirmAction('active')} className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            {t('services.activate')}
          </button>
          <button onClick={() => setConfirmAction('rejected')} className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            {t('services.reject')}
          </button>
        </>
      );
    }

    // Active → Deactivate
    if (service.isActive) {
      return (
        <button onClick={() => setConfirmAction('inactive')} className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
          {t('products.deactivate')}
        </button>
      );
    }

    // Inactive → Activate
    if (service.isInactive) {
      return (
        <button onClick={() => setConfirmAction('active')} className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {t('products.activate')}
        </button>
      );
    }

    // Rejected → show reason
    if (service.isRejected && service.rejectionReason) {
      return (
        <div className="w-full p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-800/30">
          <p className="text-[10px] font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider mb-1">{t('services.rejectionReasonDisplay')}</p>
          <p className="text-xs text-red-800 dark:text-red-300 leading-relaxed">{service.rejectionReason}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
        {/* Service Image — uses DTO imageUrl which falls back to Unsplash */}
        <div className="relative h-44 overflow-hidden bg-gray-100 dark:bg-gray-700">
          <img
            src={service.imageUrl}
            alt={service.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 right-3">{getStatusBadge(service.status)}</div>
          <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1 rounded-lg">
            <p className="text-sm font-bold text-blue-600 dark:text-blue-400">{service.priceAsNumber.toLocaleString()} SYR</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          {service.categoryDisplayName && (
            <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
              {service.categoryDisplayName}
            </span>
          )}

          <h3 className="text-base font-bold text-gray-900 dark:text-white line-clamp-1 mb-2">{service.name}</h3>

          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
              {service.vendorDisplayName.charAt(0)}
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400 truncate">{service.vendorDisplayName}</span>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 flex-1">{service.description}</p>

          <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
            <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <span>{service.formattedCreatedAt}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-gray-700 mt-auto">
            <div className="flex items-center gap-2">{renderActions()}</div>
          </div>
        </div>
      </div>

      <RejectReasonModal
        isOpen={showRejectModal}
        serviceName={service.name}
        onClose={() => setShowRejectModal(false)}
        onConfirm={handleRejectWithReason}
      />
    </>
  );
};

export default ServiceCard;