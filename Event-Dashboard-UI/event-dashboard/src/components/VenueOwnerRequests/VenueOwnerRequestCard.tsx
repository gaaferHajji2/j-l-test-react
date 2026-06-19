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
      approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
        {t(`venueOwnerStatus.${status}`)}
      </span>
    );
  };

  const handleApproveConfirm = async () => {
    try {
      await onStatusChange(request.id, 'approved', null);
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
    if (confirmAction === 'approved') {
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
    if (request.status === 'pending') {
      return (
        <>
          <button
            onClick={() => setConfirmAction('approved')}
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

    // Rejected → show stored reason
    if (request.status === 'rejected' && request.rejectionReason) {
      return (
        <div className="w-full p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-800/30">
          <p className="text-[10px] font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider mb-1">
            {t('venueOwnerRequests.rejectionReasonDisplay')}
          </p>
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
        {/* Header */}
        <div className="p-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white font-bold text-base flex-shrink-0">
                {request.ownerName.charAt(0)}
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-bold text-gray-900 dark:text-white truncate">{request.venueName}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{request.ownerName}</p>
              </div>
            </div>
            <div className="flex-shrink-0 ml-3">
              {getStatusBadge(request.status)}
            </div>
          </div>

          {/* Tags Row */}
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-2.5 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-[10px] font-semibold rounded-md uppercase tracking-wide">
              {request.venueType}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-[10px] font-medium rounded-md">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              {request.city}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-[10px] font-medium rounded-md">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              {request.capacity.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-3 flex-1">
          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{request.description}</p>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              <span className="text-gray-700 dark:text-gray-300 truncate text-xs">{request.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              <span className="text-gray-700 dark:text-gray-300 text-xs">{request.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <span className="text-gray-700 dark:text-gray-300 text-xs">{new Date(request.submittedAt).toLocaleDateString()}</span>
            </div>
            {request.documentsCount > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                <span className="text-gray-700 dark:text-gray-300 text-xs">{t('venueOwnerRequests.documentsAttached', { count: request.documentsCount })}</span>
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
        venueName={request.venueName}
        onClose={() => setShowRejectModal(false)}
        onConfirm={handleRejectWithReason}
      />
    </>
  );
};

export default VenueOwnerRequestCard;