import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import RejectReasonModal from './RejectModalForm';

const VenueOwnerRequestCard = ({ request, onStatusChange }) => {
  const { t } = useTranslation();
  const [confirmAction, setConfirmAction] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
      active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
    };
    const labels = {
      pending: t('venueOwnerStatus.pending'),
      active: t('venueOwnerStatus.approved'),
      rejected: t('venueOwnerStatus.rejected'),
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles.pending}`}>
        {labels[status] || status}
      </span>
    );
  };

  const handleApproveConfirm = async () => {
    try {
      await onStatusChange(request.id, 'active', null);
      setConfirmAction(null);
    } catch (error) {
      console.error('Error approving venue owner:', error);
    }
  };

  const handleRejectConfirmClick = () => {
    setConfirmAction(null);
    setShowRejectModal(true);
  };

  const handleRejectWithReason = async (reason) => {
    try {
      await onStatusChange(request.id, 'rejected', reason);
      setShowRejectModal(false);
    } catch (error) {
      console.error('Error rejecting venue owner:', error);
      throw error;
    }
  };

  const renderActions = () => {
    // Inline confirmation for approve
    if (confirmAction === 'active') {
      return (
        <div className="flex flex-col gap-2 w-full">
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-snug">{t('venueOwnerRequests.confirmApprove')}</p>
          <div className="flex items-center gap-2">
            <button onClick={handleApproveConfirm} className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors">
              Confirm
            </button>
            <button onClick={() => setConfirmAction(null)} className="flex-1 px-3 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 text-xs font-medium rounded-lg transition-colors">
              Cancel
            </button>
          </div>
        </div>
      );
    }

    // Inline confirmation for reject — opens reason modal on confirm
    if (confirmAction === 'rejected') {
      return (
        <div className="flex flex-col gap-2 w-full">
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-snug">{t('venueOwnerRequests.confirmReject')}</p>
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

    // Pending → Approve or Reject
    if (request.isPending) {
      return (
        <>
          <button
            onClick={() => setConfirmAction('active')}
            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            Approve
          </button>
          <button
            onClick={() => setConfirmAction('rejected')}
            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            Reject
          </button>
        </>
      );
    }

    // Rejected → show stored reason (from API or dummy)
    if (request.isRejected && request.rejectionReason) {
      return (
        <div className="w-full p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-800/30">
          <p className="text-[10px] font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider mb-1">
            {t('venueOwnerRequests.rejectionReasonDisplay')}
          </p>
          <p className="text-xs text-red-800 dark:text-red-300 leading-relaxed">{request.rejectionReason}</p>
        </div>
      );
    }

    // Active → no actions
    return null;
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
        {/* Cover Image */}
        {request.coverImage && (
          <div className="relative h-40 overflow-hidden bg-gray-100 dark:bg-gray-700">
            <img
              src={request.coverImage}
              alt={request.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-2 right-3">
              {getStatusBadge(request.status)}
            </div>
          </div>
        )}

        {/* Header (shown when no cover image, or always for info) */}
        <div className="p-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between mb-3">
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-bold text-gray-900 dark:text-white truncate">{request.name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{request.address}</p>
            </div>
            {!request.coverImage && (
              <div className="flex-shrink-0 ml-3">
                {getStatusBadge(request.status)}
              </div>
            )}
          </div>

          {/* Tags Row */}
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-[10px] font-semibold rounded-md">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              {request.capacity.toLocaleString()} capacity
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 text-[10px] font-semibold rounded-md">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {request.priceAsNumber.toLocaleString()} SYR
            </span>
            {request.images.length > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-[10px] font-medium rounded-md">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                {request.images.length} photos
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-3 flex-1">
          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{request.description}</p>

          <div className="space-y-2 pt-2">
            <div className="flex items-center gap-2 text-sm">
              <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <span className="text-gray-700 dark:text-gray-300 text-xs">{request.formattedCreatedAt}</span>
            </div>
            {request.updatedAt && request.updatedAt !== request.createdAt && (
              <div className="flex items-center gap-2 text-sm">
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                <span className="text-gray-500 dark:text-gray-400 text-xs">Updated: {request.formattedUpdatedAt}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center gap-2">
            {renderActions()}
          </div>
        </div>
      </div>

      {/* Rejection Reason Modal */}
      <RejectReasonModal
        isOpen={showRejectModal}
        venueName={request.name}
        onClose={() => setShowRejectModal(false)}
        onConfirm={handleRejectWithReason}
      />
    </>
  );
};

export default VenueOwnerRequestCard;