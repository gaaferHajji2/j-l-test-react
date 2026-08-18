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
      active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles.pending}`}>
        {t(`vendorRequestStatus.${status === 'active' ? 'approved' : status}`)}
      </span>
    );
  };

  const handleApproveConfirm = async () => {
    try {
      await onApprove(request.id);
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
      await onReject(request.id, reason);
      setShowRejectModal(false);
    } catch (error) {
      console.error('Error rejecting:', error);
      throw error;
    }
  };

  const renderActions = () => {
    // Inline confirmation for approve
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

    // Inline confirmation for reject — opens reason modal
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

    // Pending → Approve or Reject
    if (request.isPending) {
      return (
        <>
          <button onClick={() => setConfirmAction('approved')} className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            {t('vendorRequests.approve')}
          </button>
          <button onClick={() => setConfirmAction('rejected')} className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            {t('vendorRequests.reject')}
          </button>
        </>
      );
    }

    // Rejected → show stored reason
    if (request.isRejected && request.rejectionReason) {
      return (
        <div className="w-full p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-800/30">
          <p className="text-[10px] font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider mb-1">{t('vendorRequests.rejectionReasonDisplay')}</p>
          <p className="text-xs text-red-800 dark:text-red-300 leading-relaxed">{request.rejectionReason}</p>
        </div>
      );
    }

    // Approved → no actions
    return null;
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
        {/* Service Image */}
        <div className="relative h-44 overflow-hidden bg-gray-100 dark:bg-gray-700">
          <img
            src={request.imageUrl}
            alt={request.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 right-3">{getStatusBadge(request.status)}</div>
          <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1 rounded-lg">
            <p className="text-sm font-bold text-blue-600 dark:text-blue-400">{request.priceAsNumber.toLocaleString()} SAR</p>
          </div>
        </div>

        {/* Header */}
        <div className="p-5 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-base font-bold text-gray-900 dark:text-white truncate mb-1">{request.name}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{request.description}</p>
        </div>

        {/* Body */}
        <div className="p-5 space-y-3 flex-1">
          {/* Vendor Info */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/40 rounded-lg">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
              {request.vendorInitials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{request.vendorDisplayName}</p>
              <div className="flex items-center gap-3 text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                {request.vendorEmail && <span className="truncate">{request.vendorEmail}</span>}
                {request.vendorPhone && <span>{request.vendorPhone}</span>}
              </div>
            </div>
          </div>

          {/* Meta */}
          <div className="space-y-1.5 pt-2">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <span>{t('vendorRequests.submittedAt')}: {request.formattedCreatedAt}</span>
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
        businessName={request.name}
        onClose={() => setShowRejectModal(false)}
        onConfirm={handleRejectWithReason}
      />
    </>
  );
};

export default VendorRequestCard;