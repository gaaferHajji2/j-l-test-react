import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { eventTypeService } from '../../services/eventTypeService';

const EventTypeForm = ({ editingType, onSuccess, onCancel }) => {
  const { t } = useTranslation();
  const presetColors = eventTypeService.getPresetColors();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: presetColors[0],
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingType) {
      setFormData({
        name: editingType.name,
        description: editingType.description || '',
        color: editingType.color || presetColors[0],
      });
    } else {
      setFormData({ name: '', description: '', color: presetColors[0] });
    }
    setErrors({});
  }, [editingType]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = t('eventTypes.nameRequired');
    } else if (formData.name.trim().length < 3) {
      newErrors.name = t('eventTypes.nameMinLength');
    }
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
      if (editingType) {
        await eventTypeService.update(editingType.id, formData);
      } else {
        await eventTypeService.create(formData);
      }
      onSuccess();
      if (!editingType) {
        setFormData({ name: '', description: '', color: presetColors[0] });
      }
    } catch (error) {
      if (error.message === 'duplicateName') {
        setErrors({ name: t('eventTypes.duplicateName') });
      } else {
        console.error('Error saving event type:', error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={editingType ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" : "M12 4v16m8-8H4"} />
          </svg>
        </div>
        {editingType ? t('eventTypes.formTitle').replace(t('eventTypes.formTitle'), t('eventTypes.updateBtn').replace('Update', 'Edit')) : t('eventTypes.formTitle')}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            {t('eventTypes.nameLabel')} *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={t('eventTypes.namePlaceholder')}
            className={`w-full px-4 py-2.5 rounded-lg border ${
              errors.name
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
            } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors`}
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
        </div>

        {/* Description Field */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            {t('eventTypes.descriptionLabel')}
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            placeholder={t('eventTypes.descriptionPlaceholder')}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none"
          />
        </div>

        {/* Color Picker */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('eventTypes.colorLabel')}
          </label>
          <div className="flex flex-wrap gap-3">
            {presetColors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, color }))}
                className={`w-9 h-9 rounded-full transition-all ${
                  formData.color === color
                    ? 'ring-2 ring-offset-2 ring-gray-900 dark:ring-white scale-110'
                    : 'hover:scale-105'
                }`}
                style={{ backgroundColor: color }}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            {isSubmitting && (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            {editingType ? t('eventTypes.updateBtn') : t('eventTypes.submitBtn')}
          </button>

          {editingType && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition-colors"
            >
              {t('eventTypes.cancelBtn')}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default EventTypeForm;