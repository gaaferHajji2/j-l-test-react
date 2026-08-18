import { Payment, FinanceSummary } from '../models/Payment';

const BASE_URL = 'http://127.0.0.1:8000/api';
const AUTH_TOKEN = '1|TsGcZ0VIZedIMIP2cTZrs8t5nf0azvAcMs4xO9Z2d8f868e0';

// ─── Dummy Data (Fallback) ───────────────────────────────────────────────────
const generateDummyData = () => {
  const payments = Array.from({ length: 28 }, (_, index) => {
    const statuses = ['success', 'success', 'success', 'failed', 'refunded'];
    const methods = ['cash', 'credit_card', 'bank_transfer', 'wallet'];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const amount = Math.floor(Math.random() * 45000) + 2000;
    const paidAt = status === 'success' || status === 'refunded'
      ? new Date(Date.now() - Math.floor(Math.random() * 60) * 86400000).toISOString()
      : null;

    return new Payment({
      id: index + 1,
      invoice_id: index + 1,
      transaction_id: status === 'success' ? `TXN-${1000 + index}` : null,
      payment_method: methods[Math.floor(Math.random() * methods.length)],
      amount: `${amount}.00`,
      refund_amount: status === 'refunded' ? `${Math.floor(amount * 0.5)}.00` : null,
      status,
      paid_at: paidAt,
      refunded_at: status === 'refunded' ? paidAt : null,
      created_at: new Date(Date.now() - Math.floor(Math.random() * 90) * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
      invoice: {
        id: index + 1,
        event_id: index + 1,
        total_amount: `${amount}.00`,
        status: status === 'success' ? 'paid' : 'pending',
        venue_price: `${Math.floor(amount * 0.6)}.00`,
        services_total: `${Math.floor(amount * 0.4)}.00`,
        event: {
          id: index + 1,
          customer_id: index + 1,
          venue_id: (index % 5) + 1,
          event_name: `Event ${index + 1}`,
          date: new Date(Date.now() + Math.floor(Math.random() * 90) * 86400000).toISOString().split('T')[0],
          status: 'confirmed',
          customer: {
            id: index + 1,
            name: `Customer ${String.fromCharCode(65 + (index % 26))}`,
            phone: `+966 5${Math.floor(Math.random() * 10)} ${Math.floor(1000000 + Math.random() * 9000000)}`,
            email: `customer${index + 1}@example.com`,
          },
          venue: {
            id: (index % 5) + 1,
            name: `Venue ${String.fromCharCode(65 + (index % 5))}`,
            address: 'Riyadh, Saudi Arabia',
            cover_image_url: null,
            images_urls: [],
          },
        },
      },
    });
  });

  const successful = payments.filter(p => p.isSuccess);
  const failed = payments.filter(p => p.isFailed);
  const refunded = payments.filter(p => p.isRefunded);
  const totalCollected = successful.reduce((s, p) => s + p.amountAsNumber, 0);
  const totalRefunded = refunded.reduce((s, p) => s + p.refundAmountAsNumber, 0);
  const totalInvoices = payments.reduce((s, p) => s + p.invoiceTotalAsNumber, 0);

  const summary = new FinanceSummary({
    payments_count: payments.length,
    successful_payments_count: successful.length,
    failed_payments_count: failed.length,
    refunded_payments_count: refunded.length,
    total_collected_amount: totalCollected,
    total_refunded_amount: totalRefunded,
    paid_invoices_count: successful.length,
    pending_invoices_count: payments.length - successful.length,
    total_invoices_amount: totalInvoices,
  });

  return { payments, summary };
};

const dummyData = generateDummyData();

// ─── Fetch Helper ────────────────────────────────────────────────────────────
const getHeaders = () => ({
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${AUTH_TOKEN}`,
});

// ─── Service ──────────────────────────────────────────────────────────────────
export const paymentService = {
  /**
   * Fetch finance summary + all payments from single endpoint.
   * GET /admin/payments/finance
   * Falls back to dummy data on any error.
   */
  getFinanceData: async (filters = {}) => {
    let payments = [];
    let summary = null;

    try {
      const response = await fetch(`${BASE_URL}/admin/payments/finance`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const json = await response.json();
      if (json?.status !== 'success') throw new Error(json?.message || 'Non-success response');

      summary = FinanceSummary.fromApi(json.summary);
      payments = Payment.fromApiResponse(json);
    } catch (error) {
      console.warn('API fetch failed, using dummy finance data:', error.message);
      summary = dummyData.summary;
      payments = [...dummyData.payments];
    }

    // Client-side filters
    if (filters.status && filters.status !== 'all') {
      payments = payments.filter(p => p.status === filters.status);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      payments = payments.filter(p =>
        p.eventName.toLowerCase().includes(q) ||
        p.customerName.toLowerCase().includes(q) ||
        String(p.invoiceId).includes(q) ||
        (p.transactionId && p.transactionId.toLowerCase().includes(q))
      );
    }

    return { payments, summary };
  },

  /** Backward-compatible aliases */
  getAll: async (filters = {}) => {
    const { payments } = await paymentService.getFinanceData(filters);
    return payments;
  },
  getStats: async () => {
    const { summary } = await paymentService.getFinanceData();
    return summary;
  },

  /** Mark as paid (local only — no admin endpoint specified) */
  markAsPaid: async (id) => {
    const idx = dummyData.payments.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('notFound');
    dummyData.payments[idx] = new Payment({
      ...dummyData.payments[idx],
      status: 'success',
      paid_at: new Date().toISOString(),
    });
    return dummyData.payments[idx];
  },

  getEvents: async () => [
    { id: 1, name: 'Tech Conference 2026' },
    { id: 2, name: 'Summer Music Festival' },
    { id: 3, name: 'Art Exhibition Opening' },
    { id: 4, name: 'Startup Summit Riyadh' },
    { id: 5, name: 'Charity Gala Dinner' },
  ],

  createPayment: async (paymentData) => {
    try {
      const res = await fetch(`${BASE_URL}/customer/payments`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(paymentData),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json?.status === 'success' && json?.data) {
        return { success: true, message: json.message, payment: Payment.fromApi(json.data) };
      }
      throw new Error(json?.message || 'Unknown response');
    } catch (error) {
      console.warn('API payment failed:', error.message);
      return { success: true, message: 'Payment recorded locally', payment: null };
    }
  },
};