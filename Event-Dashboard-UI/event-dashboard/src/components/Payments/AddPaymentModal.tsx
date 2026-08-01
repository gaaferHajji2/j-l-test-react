import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { paymentService } from '../../services/paymentService';

const PAYMENT_METHODS = [
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'bankTransfer', label: 'Bank Transfer' },
  { value: 'cash', label: 'Cash' },
  { value: 'check', label: 'Check' },
  { value: 'wallet', label: 'Digital Wallet' },
];

const AddPaymentModal = ({ isOpen, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    invoice_id: '',
    amount: '',
    payment_method: 'credit_card',
    card_number: '',
    card_holder: '',
    expiry_month: '',
    expiry_year: '',
    cvv: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiMessage, setApiMessage] = useState(null);

  useEffect(() => {
    if (isOpen) {
      paymentService.getEvents().then(setEvents);
      setFormData({
        invoice_id: '',
        amount: '',
        payment_method: 'credit_card',
        card_number: '',
        card_holder: '',
        expiry_month: '',
        expiry_year: '',
        cvv: '',
      });
      setErrors({});
      setApiMessage(null);
    }
  }, [isOpen]);

  const isCardPayment = formData.payment_method === 'credit_card';

  const validate = () => {
    const e = {};
    if (!formData.invoice_id) e.invoice_id = t('payments.invoiceIdRequired');
    if (!formData.amount || Number(formData.amount) <= 0) e.amount = t('payments.subtotalRequired');
    if (!formData.payment_method) e.payment_method = t('payments.methodRequired');

    if (isCardPayment) {
      if (!formData.card_number || formData.card_number.replace(/\s/g, '').length < 13) {
        e.card_number = t('payments.cardNumberRequired');
      }
      if (!formData.card_holder.trim()) e.card_holder = t('payments.cardHolderRequired');
      if (!formData.expiry_month) e.expiry_month = t('payments.expiryRequired');
      if (!formData.expiry_year) e.expiry_year = t('payments.expiryRequired');
      if (!formData.cvv || formData.cvv.length < 3) e.cvv = t('payments.cvvRequired');
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    setApiMessage(null);
  };

  const handleCardNumberChange = (e) => {
    // Allow only digits and spaces, max 19 chars (16 digits + 3 spaces)
    const raw = e.target.value.replace(/[^\d\s]/g, '').substring(0, 19);
    setFormData(prev => ({ ...prev, card_number: raw }));
    if (errors.card_number) setErrors(prev => ({ ...prev, card_number: '' }));
  };

  const handleCvvChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').substring(0, 4);
    setFormData(prev => ({ ...prev, cvv: raw }));
    if (errors.cvv) setErrors(prev => ({ ...prev, cvv: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setApiMessage(null);

    try {
      const payload = {
        invoice_id: Number(formData.invoice_id),
        amount: Number(formData.amount),
        payment_method: formData.payment_method,
      };

      // Only include card fields for credit card payments
      if (isCardPayment) {
        payload.card_number = formData.card_number.replace(/\s/g, '');
        payload.card_holder = formData.card_holder.trim();
        payload.expiry_month = Number(formData.expiry_month);
        payload.expiry_year = Number(formData.expiry_year);
        payload.cvv = formData.cvv;
      }

      const result = await paymentService.createPayment(payload);

      if (result.success) {
        setApiMessage({ type: 'success', text: result.message });
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1200);
      }
    } catch (err) {
      console.error('Error recording payment:', err);
      setApiMessage({ type: 'error', text: err.message || 'Failed to record payment' });
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

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1).padStart(2, '0'),
    label: String(i + 1).padStart(2, '0'),
  }));

  const years = Array.from({ length: 10 }, (_, i) => ({
    value: String(2026 + i),
    label: String(2026 + i),
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
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
          {/* API Response Message */}
          {apiMessage && (
            <div className={`mb-5 p-3 rounded-lg text-sm font-medium ${
              apiMessage.type === 'success'
                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-800'
                : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-800'
            }`}>
              {apiMessage.text}
            </div>
          )}

          <form id="payment-form" onSubmit={handleSubmit} className="space-y-5">
            {/* Row 1: Invoice ID + Amount */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  {t('payments.invoiceIdLabel')} *
                </label>
                <input
                  type="number"
                  name="invoice_id"
                  min="1"
                  value={formData.invoice_id}
                  onChange={handleChange}
                  placeholder="e.g., 5"
                  className={inputClass('invoice_id')}
                />
                {errors.invoice_id && <p className="mt-1 text-xs text-red-500">{errors.invoice_id}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  {t('payments.subtotalLabel')} *
                </label>
                <input
                  type="number"
                  name="amount"
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder={t('payments.subtotalPlaceholder')}
                  className={inputClass('amount')}
                />
                {errors.amount && <p className="mt-1 text-xs text-red-500">{errors.amount}</p>}
              </div>
            </div>

            {/* Row 2: Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                {t('payments.methodLabel')} *
              </label>
              <select
                name="payment_method"
                value={formData.payment_method}
                onChange={handleChange}
                className={inputClass('payment_method')}
              >
                {PAYMENT_METHODS.map(m => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
              {errors.payment_method && <p className="mt-1 text-xs text-red-500">{errors.payment_method}</p>}
            </div>

            {/* Card Details Section — only shown for credit_card */}
            {isCardPayment && (
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5 space-y-4 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span className="text-sm font-semibold tracking-wide">Card Details</span>
                </div>

                {/* Card Number */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    {t('payments.cardNumberLabel')} *
                  </label>
                  <input
                    type="text"
                    name="card_number"
                    value={formData.card_number}
                    onChange={handleCardNumberChange}
                    placeholder="4111 1111 1111 1111"
                    maxLength={19}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-600 bg-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors text-sm tracking-widest"
                  />
                  {errors.card_number && <p className="mt-1 text-xs text-red-400">{errors.card_number}</p>}
                </div>

                {/* Card Holder */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    {t('payments.cardHolderLabel')} *
                  </label>
                  <input
                    type="text"
                    name="card_holder"
                    value={formData.card_holder}
                    onChange={handleChange}
                    placeholder="Add The card Holder"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-600 bg-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors text-sm"
                  />
                  {errors.card_holder && <p className="mt-1 text-xs text-red-400">{errors.card_holder}</p>}
                </div>

                {/* Expiry + CVV Row */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      {t('payments.expiryMonthLabel')} *
                    </label>
                    <select
                      name="expiry_month"
                      value={formData.expiry_month}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-600 bg-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors text-sm"
                    >
                      <option value="">MM</option>
                      {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                    </select>
                    {errors.expiry_month && <p className="mt-1 text-xs text-red-400">{errors.expiry_month}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      {t('payments.expiryYearLabel')} *
                    </label>
                    <select
                      name="expiry_year"
                      value={formData.expiry_year}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-600 bg-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors text-sm"
                    >
                      <option value="">YYYY</option>
                      {years.map(y => <option key={y.value} value={y.value}>{y.label}</option>)}
                    </select>
                    {errors.expiry_year && <p className="mt-1 text-xs text-red-400">{errors.expiry_year}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      {t('payments.cvvLabel')} *
                    </label>
                    <input
                      type="password"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleCvvChange}
                      placeholder="•••"
                      maxLength={4}
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-600 bg-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors text-sm tracking-widest text-center"
                    />
                    {errors.cvv && <p className="mt-1 text-xs text-red-400">{errors.cvv}</p>}
                  </div>
                </div>
              </div>
            )}
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
            {isSubmitting ? 'Processing...' : t('payments.submitBtn')}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-sm disabled:opacity-50"
          >
            {t('payments.cancelBtn')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPaymentModal;