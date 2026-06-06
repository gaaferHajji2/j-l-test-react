import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { venueService } from '../../services/venueService';

const VenueFormModal = ({ isOpen, onClose, editingVenue, onSuccess }) => {
  const { t } = useTranslation();
  const types = venueService.getTypes();
  const amenitiesList = venueService.getAmenities();

  const initialForm = {
    name: '', description: '', type: types[0], location: '',
    capacity: '', pricePerDay: '', image: '', amenities: [],
  };

  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingVenue) {
      setFormData({
        name: editingVenue.name,
        description: editingVenue.description || '',
        type: editingVenue.type,
        location: editingVenue.location,
        capacity: String(editingVenue.capacity),
        pricePerDay: String(editingVenue.pricePerDay),
        image: editingVenue.image || '',
        amenities: editingVenue.amenities || [],
      });
    } else {
      setFormData(initialForm);
    }
    setErrors({});
  }, [editingVenue, isOpen]);

  const validate = () => {
    const e = {};
    if (!formData.name.trim()) e.name = t('venues.nameRequired');
    if (!formData.location.trim()) e.location = t('venues.locationRequired');
    if (!formData.capacity || Number(formData.capacity) <= 0) e.capacity = t('venues.capacityRequired');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const toggleAmenity = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const payload = { ...formData, capacity: Number(formData.capacity), pricePerDay: Number(formData.pricePerDay) };
      if (editingVenue) {
        await venueService.update(editingVenue.id, payload);
      } else {
        await venueService.create(payload);
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const inputClass = (field) =>
    `w-full px-4 py-2.5 rounded-lg border ${errors[field] ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {editingVenue ? t('venues.editVenue') : t('venues.addVenue')}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('venues.venueName')} *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder={t('venues.venueNamePlaceholder')} className={inputClass('name')} />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('venues.venueType')}</label>
              <select name="type" value={formData.type} onChange={handleChange} className={inputClass('type')}>
                {types.map(tp => <option key={tp} value={tp}>{t(`venueTypes.${tp}`)}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('venues.venueCapacity')} *</label>
              <input type="number" name="capacity" min="1" value={formData.capacity} onChange={handleChange} className={inputClass('capacity')} />
              {errors.capacity && <p className="mt-1 text-sm text-red-500">{errors.capacity}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('venues.venueLocation')} *</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder={t('venues.venueLocationPlaceholder')} className={inputClass('location')} />
              {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('venues.venuePrice')}</label>
              <input type="number" name="pricePerDay" min="0" value={formData.pricePerDay} onChange={handleChange} className={inputClass('pricePerDay')} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('venues.venueImage')}</label>
              <input type="url" name="image" value={formData.image} onChange={handleChange} placeholder={t('venues.venueImagePlaceholder')} className={inputClass('image')} />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('venues.venueDescription')}</label>
              <textarea name="description" rows={3} value={formData.description} onChange={handleChange} placeholder={t('venues.venueDescriptionPlaceholder')} className={`${inputClass('description')} resize-none`} />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('venues.selectAmenities')}</label>
              <div className="flex flex-wrap gap-2">
                {amenitiesList.map(am => (
                  <button key={am} type="button" onClick={() => toggleAmenity(am)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                      formData.amenities.includes(am)
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-indigo-400'
                    }`}
                  >
                    {t(`amenities.${am}`)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium rounded-lg transition-colors flex items-center gap-2">
              {isSubmitting && <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>}
              {editingVenue ? t('venues.updateSuccess').replace('updated', 'Update') : t('venues.addVenue')}
            </button>
            <button type="button" onClick={onClose} className="px-6 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition-colors">
              {t('notifications.clearBtn')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VenueFormModal;