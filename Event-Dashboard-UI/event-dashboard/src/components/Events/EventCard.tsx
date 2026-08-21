import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import RejectReasonModal from '../VendorRequests/RejectReasonModal';

const EVENT_TYPE_COLORS = {
  wedding: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400',
  conference: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  birthday: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  corporate: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300',
  exhibition: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  concert: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  workshop: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400',
  gala: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
};

const EventCard = ({ event, onAccept, onReject }) => {
  const { t } = useTranslation();
  const [confirmAction, setConfirmAction] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
      confirmed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
    };

    // Map display labels for translation
    const labelMap = {
      pending: t('status.pending'),
      confirmed: t('status.approved'),
      cancelled: t('status.rejected'),
      rejected: t('status.rejected'),
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status] || styles.pending}`}>
        {labelMap[status] || status}
      </span>
    );
  };
  const handleAcceptConfirm = async () => {
    try {
      await onAccept(event.id);
      setConfirmAction(null);
    } catch (error) {
      console.error('Error accepting event:', error);
    }
  };

  const handleRejectConfirmClick = () => {
    setConfirmAction(null);
    setShowRejectModal(true);
  };

  const handleRejectWithReason = async (reason) => {
    try {
      await onReject(event.id, reason);
      setShowRejectModal(false);
    } catch (error) {
      console.error('Error rejecting event:', error);
      throw error;
    }
  };

  const renderActions = () => {
    // Inline confirmation for accept
    if (confirmAction === 'approved') {
      return (
        <div className="flex flex-col gap-2 w-full">
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-snug">{t('events.confirmApprove')}</p>
          <div className="flex items-center gap-2">
            <button onClick={handleAcceptConfirm} className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors">Confirm</button>
            <button onClick={() => setConfirmAction(null)} className="flex-1 px-3 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 text-xs font-medium rounded-lg transition-colors">Cancel</button>
          </div>
        </div>
      );
    }

    // Inline confirmation for reject — opens reason modal
    if (confirmAction === 'rejected') {
      return (
        <div className="flex flex-col gap-2 w-full">
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-snug">{t('events.confirmReject')}</p>
          <div className="flex items-center gap-2">
            <button onClick={handleRejectConfirmClick} className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg transition-colors">Confirm</button>
            <button onClick={() => setConfirmAction(null)} className="flex-1 px-3 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 text-xs font-medium rounded-lg transition-colors">Cancel</button>
          </div>
        </div>
      );
    }

    // Pending → Accept or Reject
    if (event.status === 'pending') {
      return (
        <>
          <button
            onClick={() => setConfirmAction('approved')}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            {t('actions.approve')}
          </button>
          <button
            onClick={() => setConfirmAction('rejected')}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            {t('actions.reject')}
          </button>
        </>
      );
    }

    // Rejected → show reason
    if ((event.status === 'rejected' || event.status === 'cancelled') && event.rejectionReason) {
      return (
        <div className="w-full p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-800/30">
          <p className="text-[10px] font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider mb-1">Rejection Reason</p>
          <p className="text-xs text-red-800 dark:text-red-300 leading-relaxed">{event.rejectionReason}</p>
        </div>
      );
    }

    // Approved → no actions
    return null;
  };

  const typeColorClass = EVENT_TYPE_COLORS[event.eventType] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700">
        {/* Card Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 truncate">{event.eventName}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{event.venueDisplayName}</p>
            </div>
            <div className="ml-4 flex-shrink-0">{getStatusBadge(event.status)}</div>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            <span className={`inline-flex items-center px-2.5 py-1 text-[10px] font-semibold rounded-md uppercase tracking-wide ${typeColorClass}`}>
              {event.eventType}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-[10px] font-medium rounded-md">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              {event.formattedDate}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-[10px] font-medium rounded-md">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {event.timeRange}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 space-y-3">
          {/* Customer Info */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/40 rounded-lg">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
              {event.customerDisplayName.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{event.customerDisplayName}</p>
              <div className="flex items-center gap-3 text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                {event.customer?.email && <span className="truncate">{event.customer.email}</span>}
                {event.customer?.phone && <span>{event.customer.phone}</span>}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <span className="text-gray-700 dark:text-gray-300">{event.guestsCount} guests</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span className="text-gray-700 dark:text-gray-300 font-semibold">{event.totalPriceAsNumber.toLocaleString()} SYR</span>
          </div>

          {event.note && (
            <div className="p-2.5 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-100 dark:border-amber-800/30">
              <p className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-0.5">Note</p>
              <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">{event.note}</p>
            </div>
          )}
        </div>

        {/* Card Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between gap-3">
            {/* <Link
              to={`/dashboard/events/${event.id}`}
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium whitespace-nowrap"
            >
              {t('actions.view')}
            </Link> */}
            <div className="flex items-center gap-2 flex-wrap justify-end flex-1">
              {renderActions()}
            </div>
          </div>
        </div>
      </div>

      {/* Rejection Reason Modal */}
      <RejectReasonModal
        isOpen={showRejectModal}
        businessName={event.eventName}
        onClose={() => setShowRejectModal(false)}
        onConfirm={handleRejectWithReason}
      />
    </>
  );
};

export default EventCard;