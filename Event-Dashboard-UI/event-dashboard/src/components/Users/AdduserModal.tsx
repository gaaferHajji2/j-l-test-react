import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const ROLE_OPTIONS = [
  { value: 'venue_owner', label: 'Venue Owner' },
  { value: 'vendor', label: 'Vendor' },
];

const AddUserModal = ({ isOpen, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'venue_owner',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setFormData({ name: '', email: '', phone: '', role: 'venue_owner' });
      setErrors({});
      setApiError(null);
    }
  }, [isOpen]);

  const validate = () => {
    const e = {};
    if (!formData.name.trim()) e.name = t('users.nameRequired');
    else if (formData.name.trim().length < 2) e.name = t('users.nameMinLength');

    if (!formData.email.trim()) e.email = t('users.emailRequired');
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = t('users.emailInvalid');

    if (!formData.phone.trim()) e.phone = t('users.phoneRequired');

    if (!formData.role) e.role = t('users.roleRequired');

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    setApiError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setApiError(null);

    try {
      const { userService } = await import('../../services/userService');
      await userService.create(formData);
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error creating user:', err);
      setApiError(err.message || 'Failed to create user');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const inputClass = (field) =>
    `w-full px-4 py-2.5 rounded-lg border ${
      errors[field]
        ? 'border-red-500 focus:ring-red-500'
        : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500'
    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors text-sm`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t('users.addUserTitle')}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* API Error Banner */}
        {apiError && (
          <div className="mx-6 mt-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-700 dark:text-red-400">{apiError}</p>
          </div>
        )}

        {/* Form */}
        <form id="add-user-form" onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="userName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              {t('users.nameLabel')} *
            </label>
            <input
              type="text"
              id="userName"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={t('users.namePlaceholder')}
              autoFocus
              className={inputClass('name')}
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              {t('users.emailLabel')} *
            </label>
            <input
              type="email"
              id="userEmail"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t('users.emailPlaceholder')}
              className={inputClass('email')}
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="userPhone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              {t('users.phoneLabel')} *
            </label>
            <input
              type="tel"
              id="userPhone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder={t('users.phonePlaceholder')}
              className={inputClass('phone')}
            />
            {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
          </div>

          {/* Role */}
          <div>
            <label htmlFor="userRole" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              {t('users.roleLabel')} *
            </label>
            <select
              id="userRole"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={inputClass('role')}
            >
              {ROLE_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {errors.role && <p className="mt-1 text-xs text-red-500">{errors.role}</p>}
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <button
            type="submit"
            form="add-user-form"
            disabled={isSubmitting}
            className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
          >
            {isSubmitting && (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            {t('users.submitCreate')}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-sm disabled:opacity-50"
          >
            {t('users.cancelBtn')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;