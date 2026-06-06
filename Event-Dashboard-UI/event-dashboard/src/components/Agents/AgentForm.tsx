import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { agentService } from '../../services/agentService';

const AgentForm = ({ editingAgent, onSuccess, onCancel }) => {
  const { t } = useTranslation();
  const venueOptions = agentService.getVenueOptions();
  const roleOptions = agentService.getRoleOptions();

  const initialFormState = {
    fullName: '',
    email: '',
    phone: '',
    venue: '',
    role: '',
    notes: '',
    status: 'active',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingAgent) {
      setFormData({
        fullName: editingAgent.fullName,
        email: editingAgent.email,
        phone: editingAgent.phone,
        venue: editingAgent.venue,
        role: editingAgent.role,
        notes: editingAgent.notes || '',
        status: editingAgent.status,
      });
    } else {
      setFormData(initialFormState);
    }
    setErrors({});
  }, [editingAgent]);

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = t('agents.nameRequired');
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = t('agents.nameMinLength');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('agents.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('agents.emailInvalid');
    }

    if (!formData.phone.trim()) newErrors.phone = t('agents.phoneRequired');
    if (!formData.venue.trim()) newErrors.venue = t('agents.venueRequired');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      if (editingAgent) {
        await agentService.update(editingAgent.id, formData);
      } else {
        await agentService.create(formData);
      }
      onSuccess();
      if (!editingAgent) setFormData(initialFormState);
    } catch (error) {
      console.error('Error saving agent:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (fieldName) =>
    `w-full px-4 py-2.5 rounded-lg border ${
      errors[fieldName]
        ? 'border-red-500 focus:ring-red-500'
        : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors`;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
          <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={editingAgent ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" : "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"} />
          </svg>
        </div>
        {editingAgent ? t('agents.editFormTitle') : t('agents.formTitle')}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              {t('agents.fullNameLabel')} *
            </label>
            <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} placeholder={t('agents.fullNamePlaceholder')} className={inputClass('fullName')} />
            {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              {t('agents.emailLabel')} *
            </label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder={t('agents.emailPlaceholder')} className={inputClass('email')} />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              {t('agents.phoneLabel')} *
            </label>
            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder={t('agents.phonePlaceholder')} className={inputClass('phone')} />
            {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              {t('agents.statusLabel')}
            </label>
            <select id="status" name="status" value={formData.status} onChange={handleChange} className={inputClass('status')}>
              <option value="active">{t('agentStatus.active')}</option>
              <option value="inactive">{t('agentStatus.inactive')}</option>
              <option value="onLeave">{t('agentStatus.onLeave')}</option>
            </select>
          </div>

          {/* Venue */}
          <div>
            <label htmlFor="venue" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              {t('agents.venueLabel')} *
            </label>
            <select id="venue" name="venue" value={formData.venue} onChange={handleChange} className={inputClass('venue')}>
              <option value="">{t('agents.venuePlaceholder')}</option>
              {venueOptions.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
            {errors.venue && <p className="mt-1 text-sm text-red-500">{errors.venue}</p>}
          </div>

          {/* Role */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              {t('agents.roleLabel')}
            </label>
            <select id="role" name="role" value={formData.role} onChange={handleChange} className={inputClass('role')}>
              <option value="">{t('agents.rolePlaceholder')}</option>
              {roleOptions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            {t('agents.notesLabel')}
          </label>
          <textarea id="notes" name="notes" rows={3} value={formData.notes} onChange={handleChange} placeholder={t('agents.notesPlaceholder')} className={`${inputClass('notes')} resize-none`} />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium rounded-lg transition-colors flex items-center gap-2">
            {isSubmitting && (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
            )}
            {editingAgent ? t('agents.updateBtn') : t('agents.submitBtn')}
          </button>
          {editingAgent && (
            <button type="button" onClick={onCancel} className="px-6 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition-colors">
              {t('agents.cancelBtn')}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AgentForm;