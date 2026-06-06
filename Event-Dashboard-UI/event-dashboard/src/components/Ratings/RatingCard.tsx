import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import StarDisplay from './StarDisplay';

const RatingCard = ({ rating, onRespond, onFlag, onDelete }) => {
  const { t } = useTranslation();
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleSubmitResponse = async () => {
    if (!responseText.trim()) return;
    setIsSubmitting(true);
    try {
      await onRespond(rating.id, responseText);
      setResponseText('');
      setShowResponseForm(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 4) return 'border-l-green-500';
    if (score >= 3) return 'border-l-yellow-500';
    return 'border-l-red-500';
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md border-l-4 ${getScoreColor(rating.score)} overflow-hidden transition-all hover:shadow-lg`}>
      <div className="p-6">
        {/* Header Row */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {rating.customerName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{rating.customerName}</h3>
                {rating.isVerified && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-[10px] font-medium rounded-full">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {t('ratings.verifiedBadge')}
                  </span>
                )}
                {rating.isFlagged && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-[10px] font-medium rounded-full">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
                    Flagged
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {new Date(rating.submittedAt).toLocaleDateString()} • {new Date(rating.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
          <StarDisplay score={rating.score} size="md" showLabel label={t(`ratings.stars_${rating.score}`)} />
        </div>

        {/* Event Name */}
        <div className="mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-indigo-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{rating.eventName}</span>
        </div>

        {/* Review Text */}
        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4">
          {rating.description}
        </p>

        {/* Admin Response */}
        {rating.adminResponse && (
          <div className="mb-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800/30">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
              <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">{t('ratings.responseLabel')}</span>
              {rating.respondedAt && (
                <span className="text-[10px] text-indigo-500 dark:text-indigo-400">
                  {new Date(rating.respondedAt).toLocaleDateString()}
                </span>
              )}
            </div>
            <p className="text-sm text-indigo-900 dark:text-indigo-200 leading-relaxed">{rating.adminResponse}</p>
          </div>
        )}

        {/* Inline Response Form */}
        {showResponseForm && !rating.adminResponse && (
          <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">{t('ratings.responseLabel')}</label>
            <textarea
              rows={3}
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              placeholder={t('ratings.responsePlaceholder')}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
            />
            <div className="flex items-center gap-2 mt-2">
              <button onClick={handleSubmitResponse} disabled={isSubmitting || !responseText.trim()} className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-xs font-medium rounded-lg transition-colors">
                {isSubmitting ? 'Sending...' : 'Send Response'}
              </button>
              <button onClick={() => { setShowResponseForm(false); setResponseText(''); }} className="px-4 py-1.5 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 text-xs font-medium rounded-lg transition-colors">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" /></svg>
            <span>{t('ratings.helpfulCount', { count: rating.helpfulCount })}</span>
          </div>

          <div className="flex items-center gap-2">
            {!rating.adminResponse && !showResponseForm && (
              <button onClick={() => setShowResponseForm(true)} className="px-3 py-1.5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-xs font-medium rounded-lg transition-colors">
                {t('ratings.respondBtn')}
              </button>
            )}
            {!rating.isFlagged && (
              <button onClick={() => onFlag(rating.id)} className="px-3 py-1.5 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 text-xs font-medium rounded-lg transition-colors">
                {t('ratings.flagReview')}
              </button>
            )}

            {confirmDelete ? (
              <div className="flex items-center gap-1">
                <button onClick={() => { onDelete(rating.id); setConfirmDelete(false); }} className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg transition-colors">Confirm</button>
                <button onClick={() => setConfirmDelete(false)} className="px-3 py-1.5 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 text-xs font-medium rounded-lg transition-colors">Cancel</button>
              </div>
            ) : (
              <button onClick={() => setConfirmDelete(true)} className="px-3 py-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-xs font-medium rounded-lg transition-colors">
                {t('actions.delete')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatingCard;