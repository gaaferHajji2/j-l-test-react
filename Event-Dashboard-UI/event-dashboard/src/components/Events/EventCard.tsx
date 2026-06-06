import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const EventCard = ({ event, onStatusChange }) => {
  const { t } = useTranslation();
  const [showConfirm, setShowConfirm] = useState(null); // 'approve' or 'reject'

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
      approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
        {t(`status.${status}`)}
      </span>
    );
  };

  const handleApprove = async () => {
    try {
      await onStatusChange(event.id, 'approved');
      setShowConfirm(null);
    } catch (error) {
      console.error('Error approving event:', error);
    }
  };

  const handleReject = async () => {
    try {
      await onStatusChange(event.id, 'rejected');
      setShowConfirm(null);
    } catch (error) {
      console.error('Error rejecting event:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700">
      {/* Card Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {event.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {event.description}
            </p>
          </div>
          <div className="ml-4">
            {getStatusBadge(event.status)}
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{new Date(event.date).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-gray-700 dark:text-gray-300">{event.location}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-gray-700 dark:text-gray-300">{event.organizer}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="text-gray-700 dark:text-gray-300">{event.attendees} attendees</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <span className="text-gray-700 dark:text-gray-300">{event.category}</span>
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center justify-between">
          <Link
            to={`/dashboard/events/${event.id}`}
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
          >
            {t('actions.view')}
          </Link>
          
          {/* Admin Actions for Pending Events */}
          {event.status === 'pending' && (
            <div className="flex items-center gap-2">
              {showConfirm === 'approve' ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {t('events.confirmApprove')}
                  </span>
                  <button
                    onClick={handleApprove}
                    className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded transition-colors"
                  >
                    {t('actions.approve')}
                  </button>
                  <button
                    onClick={() => setShowConfirm(null)}
                    className="px-3 py-1.5 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 text-xs font-medium rounded transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : showConfirm === 'reject' ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {t('events.confirmReject')}
                  </span>
                  <button
                    onClick={handleReject}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded transition-colors"
                  >
                    {t('actions.reject')}
                  </button>
                  <button
                    onClick={() => setShowConfirm(null)}
                    className="px-3 py-1.5 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 text-xs font-medium rounded transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setShowConfirm('approve')}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {t('actions.approve')}
                  </button>
                  <button
                    onClick={() => setShowConfirm('reject')}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {t('actions.reject')}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;