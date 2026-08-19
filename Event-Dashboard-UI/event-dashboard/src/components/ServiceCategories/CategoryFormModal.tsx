import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const CategoryFormModal = ({ isOpen, editingCategory, onClose, onSubmit }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (editingCategory) {
        setFormData({
          name: editingCategory.name,
          description: editingCategory.description || '',
        });
      } else {
        setFormData({ name: '', description: '' });
      }
      setErrors({});
    }
  }, [isOpen, editingCategory]);

  const validate = () => {
    const e = {};
    if (!formData.name.trim()) e.name = t('serviceCategories.nameRequired');
    else if (formData.name.trim().length < 2) e.name = t('serviceCategories.nameMinLength');
    setErrors(e);
    return Object.keys(e).length === 0;
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
      await onSubmit(formData);
      onClose();
    } catch (err) {
      console.error('Error submitting category:', err);
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
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {editingCategory ? t('serviceCategories.editTitle') : t('serviceCategories.createTitle')}
          </h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form id="category-form" onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="catName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              {t('serviceCategories.nameLabel')}
            </label>
            <input
              type="text"
              id="catName"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={t('serviceCategories.namePlaceholder')}
              autoFocus
              className={inputClass('name')}
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="catDesc" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              {t('serviceCategories.descriptionLabel')}
            </label>
            <textarea
              id="catDesc"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder={t('serviceCategories.descriptionPlaceholder')}
              className={`${inputClass('description')} resize-none`}
            />
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <button
            type="submit"
            form="category-form"
            disabled={isSubmitting}
            className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
          >
            {isSubmitting && (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            {editingCategory ? t('serviceCategories.submitUpdate') : t('serviceCategories.submitCreate')}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-sm disabled:opacity-50"
          >
            {t('serviceCategories.cancelBtn')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryFormModal;