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

  // Add these methods to the existing paymentService export object:

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

  create: async (data) => {
    await new Promise(resolve => setTimeout(resolve, 600));

    const subtotal = Number(data.subtotal);
    const discount = Number(data.discount) || 0;
    const taxable = subtotal - discount;
    const tax = Math.round(taxable * 0.15);
    const total = taxable + tax;
    let nextId = mockPayments.length + 1;

    const newPayment = {
      id: nextId++,
      invoiceId: data.invoiceId?.trim() || `INV-${String(2026000 + mockPayments.length)}`,
      eventName: data.eventName,
      customerName: data.customerName.trim(),
      customerEmail: data.customerEmail?.trim() || '',
      subtotal,
      discount,
      tax,
      total,
      method: data.method,
      status: 'pending',
      invoiceDate: new Date().toISOString(),
      dueDate: new Date(data.dueDate).toISOString(),
      paidAt: null,
      notes: data.notes?.trim() || '',
    };

    mockPayments.unshift(newPayment);
    return newPayment;
  },
};