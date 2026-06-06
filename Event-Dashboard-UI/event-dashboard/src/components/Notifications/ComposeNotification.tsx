import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { notificationService } from '../../services/notificationService';

const MAX_MESSAGE_LENGTH = 1000;

const ComposeNotification = ({ onSent }) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    recipients: '',
    subject: '',
    message: '',
    priority: 'normal',
  });
  const [errors, setErrors] = useState({});
  const [isSending, setIsSending] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.recipients) newErrors.recipients = t('notifications.recipientRequired');
    if (!formData.subject.trim()) newErrors.subject = t('notifications.subjectRequired');
    if (!formData.message.trim()) newErrors.message = t('notifications.messageRequired');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'message' && value.length > MAX_MESSAGE_LENGTH) return;

    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleClear = () => {
    setFormData({ recipients: '', subject: '', message: '', priority: 'normal' });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSending(true);
    try {
      await notificationService.send(formData);
      onSent();
      handleClear();
    } catch (error) {
      console.error('Error sending notification:', error);
    } finally {
      setIsSending(false);
    }
  };

  const inputClass = (field) =>
    `w-full px-4 py-2.5 rounded-lg border ${
      errors[field]
        ? 'border-red-500 focus:ring-red-500'
        : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors`;

  const recipientOptions = [
    { value: 'agents', label: t('notifications.recipientAgents'), icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { value: 'vendors', label: t('notifications.recipientVendors'), icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { value: 'all', label: t('notifications.recipientAll'), icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  ];

  const priorityOptions = [
    { value: 'low', label: t('notifications.priorityLow'), color: 'bg-gray-500' },
    { value: 'normal', label: t('notifications.priorityNormal'), color: 'bg-blue-500' },
    { value: 'high', label: t('notifications.priorityHigh'), color: 'bg-orange-500' },
    { value: 'urgent', label: t('notifications.priorityUrgent'), color: 'bg-red-500' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        {t('notifications.composeTitle')}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Recipient Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('notifications.recipientLabel')} *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {recipientOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setFormData(prev => ({ ...prev, recipients: opt.value }));
                  if (errors.recipients) setErrors(prev => ({ ...prev, recipients: '' }));
                }}
                className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left ${
                  formData.recipients === opt.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <svg className={`w-5 h-5 flex-shrink-0 ${formData.recipients === opt.value ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={opt.icon} />
                </svg>
                <span className={`text-sm font-medium ${formData.recipients === opt.value ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}`}>
                  {opt.label}
                </span>
              </button>
            ))}
          </div>
          {errors.recipients && <p className="mt-1 text-sm text-red-500">{errors.recipients}</p>}
        </div>

        {/* Subject */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            {t('notifications.subjectLabel')} *
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder={t('notifications.subjectPlaceholder')}
            className={inputClass('subject')}
          />
          {errors.subject && <p className="mt-1 text-sm text-red-500">{errors.subject}</p>}
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('notifications.priorityLabel')}
          </label>
          <div className="flex flex-wrap gap-3">
            {priorityOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, priority: opt.value }))}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-sm font-medium ${
                  formData.priority === opt.value
                    ? 'border-transparent text-black ring-2 ring-offset-1 ring-gray-400 dark:ring-offset-gray-800'
                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                style={formData.priority === opt.value ? { backgroundColor: opt.color.replace('bg-', '') } : {}}
                {...(formData.priority === opt.value ? {} : {})}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${opt.color}`} />
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            {t('notifications.messageLabel')} *
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={formData.message}
            onChange={handleChange}
            placeholder={t('notifications.messagePlaceholder')}
            className={`${inputClass('message')} resize-none`}
          />
          <div className="flex justify-between mt-1">
            {errors.message ? (
              <p className="text-sm text-red-500">{errors.message}</p>
            ) : <span />}
            <span className={`text-xs ${formData.message.length > MAX_MESSAGE_LENGTH * 0.9 ? 'text-red-500' : 'text-gray-400'}`}>
              {formData.message.length}/{MAX_MESSAGE_LENGTH} {t('notifications.charCount')}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={isSending}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            {isSending ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                Sending...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                {t('notifications.sendBtn')}
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="px-6 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition-colors"
          >
            {t('notifications.clearBtn')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ComposeNotification;