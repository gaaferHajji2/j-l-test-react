import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import RejectReasonModal from './RejectReasonModal';

const VendorRequestCard = ({ request, onApprove, onReject }) => {
  const { t } = useTranslation();
  const [confirmAction, setConfirmAction] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
      approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
      accepted: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles.pending}`}>
        {t(`vendorRequestStatus.${status === 'accepted' ? 'approved' : status}`)}
      </span>
    );
  };

  const handleApproveConfirm = async () => {
    try {
      await onApprove(request);
      setConfirmAction(null);
    } catch (error) {
      console.error('Error approving:', error);
    }
  };

  const handleRejectConfirmClick = () => {
    setConfirmAction(null);
    setShowRejectModal(true);
  };

  const handleRejectWithReason = async (reason) => {
    try {
      await onReject(request, reason);
      setShowRejectModal(false);
    } catch (error) {
      console.error('Error rejecting:', error);
      throw error;
    }
  };

  const renderActions = () => {
    if (confirmAction === 'approved') {
      return (
        <div className="flex flex-col gap-2 w-full">
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-snug">{t('vendorRequests.confirmApprove')}</p>
          <div className="flex items-center gap-2">
            <button onClick={handleApproveConfirm} className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors">Confirm</button>
            <button onClick={() => setConfirmAction(null)} className="flex-1 px-3 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 text-xs font-medium rounded-lg transition-colors">Cancel</button>
          </div>
        </div>
      );
    }

    if (confirmAction === 'rejected') {
      return (
        <div className="flex flex-col gap-2 w-full">
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-snug">{t('vendorRequests.confirmReject')}</p>
          <div className="flex items-center gap-2">
            <button onClick={handleRejectConfirmClick} className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg transition-colors">Confirm</button>
            <button onClick={() => setConfirmAction(null)} className="flex-1 px-3 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 text-xs font-medium rounded-lg transition-colors">Cancel</button>
          </div>
        </div>
      );
    }

    if (request.isPending) {
      return (
        <>
          <button onClick={() => setConfirmAction('approved')} className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            Approve
          </button>
          <button onClick={() => setConfirmAction('rejected')} className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            Reject
          </button>
        </>
      );
    }

    if (request.isRejected && request.rejectionReason) {
      return (
        <div className="w-full p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-800/30">
          <p className="text-[10px] font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider mb-1">{t('vendorRequests.rejectionReasonDisplay')}</p>
          <p className="text-xs text-red-800 dark:text-red-300 leading-relaxed">{request.rejectionReason}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between mb-3">
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-bold text-gray-900 dark:text-white truncate">{request.serviceName}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{request.eventDisplayName}</p>
            </div>
            <div className="flex-shrink-0 ml-3">{getStatusBadge(request.status)}</div>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-[10px] font-semibold rounded-md">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              {request.vendorDisplayName}
            </span>
            {request.eventDateFormatted && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-[10px] font-medium rounded-md">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                {request.eventDateFormatted}
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-3 flex-1">
          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{request.description}</p>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span className="text-xs font-semibold text-gray-900 dark:text-white">{request.totalPrice.toLocaleString()} SAR</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
              <span className="text-xs text-gray-700 dark:text-gray-300">Qty: {request.quantity}</span>
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            {request.vendor?.email && (
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <span className="truncate">{request.vendor.email}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>Submitted: {request.formattedCreatedAt}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center gap-2">{renderActions()}</div>
        </div>
      </div>

      <RejectReasonModal
        isOpen={showRejectModal}
        businessName={request.serviceName}
        onClose={() => setShowRejectModal(false)}
        onConfirm={handleRejectWithReason}
      />
    </>
  );
};

export default VendorRequestCard;