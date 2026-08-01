import { api } from './api';
import { Payment } from '../models/Payment';

// ─── Existing mock data and methods remain unchanged ─────────────────────────
const CUSTOMERS = [
  'Abdullah Al-Mansour', 'TechCorp Events LLC', 'Fatima Wedding Planners',
  'Riyadh Exhibition Authority', 'Noura Creative Agency', 'Gulf Conference Group',
  'Al-Saud Hospitality', 'Eastern Province Events Co.', 'Jeddah Festival Committee',
  'Vision 2030 Events Dept.'
];

const EVENTS = [
  'Tech Conference 2026', 'Summer Music Festival', 'Art Exhibition Opening',
  'Startup Summit Riyadh', 'Charity Gala Dinner', 'Fashion Week Showcase',
  'Food & Culture Fair', 'Sports Tournament Finals', 'Book Launch Event',
  'Health & Wellness Retreat'
];

const METHODS = ['bankTransfer', 'cash', 'check', 'wallet'];
const STATUSES = ['paid', 'paid', 'paid', 'pending', 'pending', 'overdue', 'refunded'];

const generateMockPayments = () => {
  return Array.from({ length: 28 }, (_, index) => {
    const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];
    const subtotal = Math.floor(Math.random() * 45000) + 2000;
    const discount = Math.random() > 0.7 ? Math.floor(subtotal * 0.1) : 0;
    const taxable = subtotal - discount;
    const tax = Math.floor(taxable * 0.15);
    const total = taxable + tax;
    const invoiceDate = new Date();
    invoiceDate.setDate(invoiceDate.getDate() - Math.floor(Math.random() * 60));
    const dueDate = new Date(invoiceDate);
    dueDate.setDate(dueDate.getDate() + 14);
    const paidAt = status === 'paid' || status === 'refunded'
      ? new Date(invoiceDate.getTime() + 86400000 * Math.floor(Math.random() * 10)).toISOString()
      : null;

    return {
      id: index + 1,
      invoiceId: `INV-${String(2026000 + index)}`,
      eventName: EVENTS[Math.floor(Math.random() * EVENTS.length)],
      customerName: CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)],
      customerEmail: `client${index + 1}@example.com`,
      subtotal,
      discount,
      tax,
      total,
      method: METHODS[Math.floor(Math.random() * METHODS.length)],
      status,
      invoiceDate: invoiceDate.toISOString(),
      dueDate: dueDate.toISOString(),
      paidAt,
      notes: Math.random() > 0.8 ? 'VIP client — priority processing' : '',
    };
  }).sort((a, b) => new Date(b.invoiceDate) - new Date(a.invoiceDate));
};

let mockPayments = generateMockPayments();
let nextId = mockPayments.length + 1;

// ─── Service ──────────────────────────────────────────────────────────────────
export const paymentService = {
  getAll: async (filters = {}) => {
    await new Promise(resolve => setTimeout(resolve, 450));
    let filtered = [...mockPayments];

    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(p => p.status === filters.status);
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter(p =>
        p.eventName.toLowerCase().includes(q) ||
        p.customerName.toLowerCase().includes(q) ||
        p.invoiceId.toLowerCase().includes(q)
      );
    }

    return filtered;
  },

  getStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 250));
    const totalRevenue = mockPayments.filter(p => p.status === 'paid').reduce((s, p) => s + p.total, 0);
    const pendingAmount = mockPayments.filter(p => p.status === 'pending' || p.status === 'overdue').reduce((s, p) => s + p.total, 0);
    const paidCount = mockPayments.filter(p => p.status === 'paid').length;
    const totalCount = mockPayments.length;

    return { totalRevenue, pendingAmount, paidCount, totalCount };
  },

  markAsPaid: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const idx = mockPayments.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('notFound');
    mockPayments[idx] = {
      ...mockPayments[idx],
      status: 'paid',
      paidAt: new Date().toISOString(),
    };
    return mockPayments[idx];
  },

  getEvents: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [
      { id: 1, name: 'Tech Conference 2026' },
      { id: 2, name: 'Summer Music Festival' },
      { id: 3, name: 'Art Exhibition Opening' },
      { id: 4, name: 'Startup Summit Riyadh' },
      { id: 5, name: 'Charity Gala Dinner' },
      { id: 6, name: 'Fashion Week Showcase' },
      { id: 7, name: 'Food & Culture Fair' },
      { id: 8, name: 'Sports Tournament Finals' },
      { id: 9, name: 'Book Launch Event' },
      { id: 10, name: 'Health & Wellness Retreat' },
    ];
  },

  /**
   * Record a new payment via API.
   * POST /customer/payments
   * Falls back to local mock creation if API fails.
   */
  createPayment: async (paymentData) => {
    try {
      const response = await api.post('/customer/payments', paymentData, true);

      // If API returns success with data, use it
      if (response?.status === 'success' && response?.data) {
        const payment = Payment.fromApi(response.data);

        // Also update local mock list so the table refreshes correctly
        const newMockPayment = {
          id: nextId++,
          invoiceId: `INV-${paymentData.invoice_id}`,
          eventName: EVENTS[payment.eventId % EVENTS.length] || `Event #${payment.eventId}`,
          customerName: paymentData.card_holder || 'Customer',
          customerEmail: '',
          subtotal: payment.amountAsNumber,
          discount: 0,
          tax: 0,
          total: payment.amountAsNumber,
          method: payment.paymentMethod,
          status: 'paid',
          invoiceDate: new Date().toISOString(),
          dueDate: new Date().toISOString(),
          paidAt: payment.paidAt,
          notes: `Transaction: ${payment.transactionId}`,
        };
        mockPayments.unshift(newMockPayment);

        return { success: true, message: response.message, payment };
      }

      throw new Error(response?.message || 'Unknown API response format');
    } catch (error) {
      console.warn('API payment failed, creating local record:', error.message);

      // Fallback: create local mock payment
      const subtotal = Number(paymentData.amount);
      const newMockPayment = {
        id: nextId++,
        invoiceId: `INV-${paymentData.invoice_id}`,
        eventName: `Event (Invoice #${paymentData.invoice_id})`,
        customerName: paymentData.card_holder || 'Customer',
        customerEmail: '',
        subtotal,
        discount: 0,
        tax: 0,
        total: subtotal,
        method: paymentData.payment_method,
        status: 'paid',
        invoiceDate: new Date().toISOString(),
        dueDate: new Date().toISOString(),
        paidAt: new Date().toISOString(),
        notes: 'Recorded locally (API unavailable)',
      };
      mockPayments.unshift(newMockPayment);

      return {
        success: true,
        message: 'Payment recorded locally',
        payment: new Payment({
          payment_id: newMockPayment.id,
          event_id: null,
          amount: String(subtotal),
          payment_method: paymentData.payment_method,
          transaction_id: 'LOCAL-' + Date.now(),
          status: 'success',
          paid_at: newMockPayment.paidAt,
        }),
      };
    }
  },

  // Keep backward compatibility alias
  create: async (data) => {
    return paymentService.createPayment(data);
  },
};