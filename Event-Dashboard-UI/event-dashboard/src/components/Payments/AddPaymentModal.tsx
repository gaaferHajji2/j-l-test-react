import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { paymentService } from '../../services/paymentService';

const PAYMENT_METHODS = ['bankTransfer', 'cash', 'check', 'wallet'];

const AddPaymentModal = ({ isOpen, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    eventId: '',
    eventName: '',
    customerName: '',
    customerEmail: '',
    subtotal: '',
    discount: '',
    method: '',
    invoiceId: '',
    notes: '',
    dueDate: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch events when modal opens
  useEffect(() => {
    if (isOpen) {
      paymentService.getEvents().then(setEvents);
      setFormData({
        eventId: '', eventName: '', customerName: '', customerEmail: '',
        subtotal: '', discount: '', method: '', invoiceId: '', notes: '', dueDate: '',
      });
      setErrors({});
    }
  }, [isOpen]);

  // Auto-calculate tax and total
  const subtotalNum = Number(formData.subtotal) || 0;
  const discountNum = Number(formData.discount) || 0;
  const taxable = Math.max(subtotalNum - discountNum, 0);
  const taxAmount = Math.round(taxable * 0.15);
  const totalAmount = taxable + taxAmount;

  const validate = () => {
    const e = {};
    if (!formData.eventId) e.eventId = t('payments.eventRequired');
    if (!formData.customerName.trim()) e.customerName = t('payments.customerRequired');
    if (!formData.subtotal || subtotalNum <= 0) e.subtotal = t('payments.subtotalRequired');
    if (!formData.method) e.method = t('payments.methodRequired');
    if (!formData.dueDate) e.dueDate = t('payments.dueDateRequired');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      // Sync event name when event is selected
      if (name === 'eventId') {
        const selected = events.find(ev => String(ev.id) === value);
        updated.eventName = selected?.name || '';
      }
      return updated;
    });
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await paymentService.create({
        ...formData,
        subtotal: subtotalNum,
        discount: discountNum,
      });
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error creating payment:', err);
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
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('payments.formTitle')}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <form id="payment-form" onSubmit={handleSubmit} className="space-y-5">
            {/* Row 1: Event + Invoice ID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('payments.selectEvent')}</label>
                <select name="eventId" value={formData.eventId} onChange={handleChange} className={inputClass('eventId')}>
                  <option value="">{t('payments.selectEventPlaceholder')}</option>
                  {events.map(ev => <option key={ev.id} value={ev.id}>{ev.name}</option>)}
                </select>
                {errors.eventId && <p className="mt-1 text-xs text-red-500">{errors.eventId}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('payments.invoiceIdLabel')}</label>
                <input type="text" name="invoiceId" value={formData.invoiceId} onChange={handleChange} placeholder={t('payments.invoiceIdPlaceholder')} className={inputClass('invoiceId')} />
              </div>
            </div>

            {/* Row 2: Customer Name + Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('payments.customerNameLabel')}</label>
                <input type="text" name="customerName" value={formData.customerName} onChange={handleChange} placeholder={t('payments.customerNamePlaceholder')} className={inputClass('customerName')} />
                {errors.customerName && <p className="mt-1 text-xs text-red-500">{errors.customerName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('payments.customerEmailLabel')}</label>
                <input type="email" name="customerEmail" value={formData.customerEmail} onChange={handleChange} placeholder={t('payments.customerEmailPlaceholder')} className={inputClass('customerEmail')} />
              </div>
            </div>

            {/* Row 3: Financial Breakdown */}
            <div className="bg-gray-50 dark:bg-gray-700/40 rounded-xl p-5 space-y-4 border border-gray-200 dark:border-gray-600">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('payments.subtotalLabel')}</label>
                  <input type="number" name="subtotal" min="0" step="0.01" value={formData.subtotal} onChange={handleChange} placeholder={t('payments.subtotalPlaceholder')} className={inputClass('subtotal')} />
                  {errors.subtotal && <p className="mt-1 text-xs text-red-500">{errors.subtotal}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('payments.discountLabel')}</label>
                  <input type="number" name="discount" min="0" step="0.01" value={formData.discount} onChange={handleChange} placeholder={t('payments.discountPlaceholder')} className={inputClass('discount')} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    {t('payments.taxLabel')}
                    <span className="ml-1 text-[10px] text-gray-400 font-normal">({t('payments.autoCalculated')})</span>
                  </label>
                  <div className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 text-sm cursor-not-allowed">
                    {taxAmount.toLocaleString()} SAR
                  </div>
                </div>
              </div>

              {/* Total Display */}
              <div className="flex items-center justify-between pt-3 border-t border-dashed border-gray-300 dark:border-gray-500">
                <span className="text-sm font-bold text-gray-900 dark:text-white">{t('payments.totalLabel')}</span>
                <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {totalAmount.toLocaleString()} <span className="text-xs font-normal text-gray-500">SAR</span>
                </span>
              </div>
            </div>

            {/* Row 4: Method + Due Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('payments.methodLabel')}</label>
                <select name="method" value={formData.method} onChange={handleChange} className={inputClass('method')}>
                  <option value="">{t('payments.methodPlaceholder')}</option>
                  {PAYMENT_METHODS.map(m => (
                    <option key={m} value={m}>{t(`paymentMethod.${m}`)}</option>
                  ))}
                </select>
                {errors.method && <p className="mt-1 text-xs text-red-500">{errors.method}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('payments.dueDateLabel')}</label>
                <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} className={inputClass('dueDate')} />
                {errors.dueDate && <p className="mt-1 text-xs text-red-500">{errors.dueDate}</p>}
              </div>
            </div>

            {/* Row 5: Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('payments.notesLabel')}</label>
              <textarea name="notes" rows={3} value={formData.notes} onChange={handleChange} placeholder={t('payments.notesPlaceholder')} className={`${inputClass('notes')} resize-none`} />
            </div>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex-shrink-0">
          <button
            type="submit"
            form="payment-form"
            disabled={isSubmitting}
            className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
          >
            {isSubmitting && (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            {t('payments.submitBtn')}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-sm"
          >
            {t('payments.cancelBtn')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPaymentModal;