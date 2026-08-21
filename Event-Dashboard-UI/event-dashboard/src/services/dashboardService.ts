const BASE_URL = 'https://eventak.abukm.com/api';
const AUTH_TOKEN = '15|9PYfYdFWh9rFuluRPW0Uxx4YvXPlGCXv50SIXyoU9c0cce61';

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

// ─── Dummy Data (Fallback) ───────────────────────────────────────────────────
const generateDummyEvents = () => {
  const statuses = ['confirmed', 'confirmed', 'confirmed', 'pending', 'pending', 'cancelled', 'rejected'];
  const types = ['زفاف', 'تخرج', 'مؤتمر', 'عيد ميلاد', 'معرض', 'حفلة موسيقية'];

  return Array.from({ length: 40 }, (_, i) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const month = Math.floor(Math.random() * 12);
    const date = new Date(2026, month, Math.floor(Math.random() * 28) + 1);
    const totalPrice = Math.floor(Math.random() * 50000) + 2000;

    return {
      id: i + 1,
      event_name: `Event ${i + 1}`,
      event_type: types[Math.floor(Math.random() * types.length)],
      date: date.toISOString().split('T')[0],
      guests_count: Math.floor(Math.random() * 400) + 50,
      total_price: `${totalPrice}.00`,
      status,
      created_at: date.toISOString(),
      invoice: {
        total_amount: `${totalPrice}.00`,
        status: status === 'confirmed' ? 'paid' : 'pending',
      },
    };
  });
};

let dummyEvents = generateDummyEvents();

// ─── Fetch Helper ────────────────────────────────────────────────────────────
const getHeaders = () => ({
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${AUTH_TOKEN}`,
});

// ─── Aggregation Helpers ─────────────────────────────────────────────────────

/**
 * Compute summary statistics from raw events array.
 */
const computeStats = (events) => {
  const total = events.length;
  const confirmed = events.filter(e => e.status === 'confirmed').length;
  const pending = events.filter(e => e.status === 'pending').length;
  const cancelled = events.filter(e => e.status === 'cancelled' || e.status === 'rejected').length;

  const totalRevenue = events
    .filter(e => e.status === 'confirmed')
    .reduce((sum, e) => sum + (parseFloat(e.total_price) || 0), 0);

  const pendingRevenue = events
    .filter(e => e.status === 'pending')
    .reduce((sum, e) => sum + (parseFloat(e.total_price) || 0), 0);

  const totalGuests = events.reduce((sum, e) => sum + (e.guests_count || 0), 0);

  return {
    totalEvents: total,
    confirmedEvents: confirmed,
    pendingEvents: pending,
    cancelledEvents: cancelled,
    totalRevenue,
    pendingRevenue,
    totalGuests,
  };
};

/**
 * Group events by month and status for the bar chart.
 * Returns array of { month, confirmed, pending, cancelled }
 */
const computeMonthlyData = (events) => {
  const map = {};

  // Initialize all 12 months
  MONTH_NAMES.forEach(m => {
    map[m] = { month: m, confirmed: 0, pending: 0, cancelled: 0 };
  });

  events.forEach(event => {
    const date = new Date(event.date || event.created_at);
    const monthKey = MONTH_NAMES[date.getMonth()];
    if (!map[monthKey]) return;

    if (event.status === 'confirmed') map[monthKey].confirmed += 1;
    else if (event.status === 'pending') map[monthKey].pending += 1;
    else map[monthKey].cancelled += 1;
  });

  return MONTH_NAMES.map(m => map[m]);
};

/**
 * Group events by status for the pie chart.
 */
const computeStatusDistribution = (events) => {
  const counts = { confirmed: 0, pending: 0, cancelled: 0 };

  events.forEach(event => {
    if (event.status === 'confirmed') counts.confirmed += 1;
    else if (event.status === 'pending') counts.pending += 1;
    else counts.cancelled += 1;
  });

  return [
    { name: 'Confirmed', value: counts.confirmed, color: '#10B981' },
    { name: 'Pending', value: counts.pending, color: '#F59E0B' },
    { name: 'Cancelled', value: counts.cancelled, color: '#EF4444' },
  ].filter(item => item.value > 0);
};

/**
 * Group revenue by month for the revenue bar chart.
 */
const computeMonthlyRevenue = (events) => {
  const map = {};
  MONTH_NAMES.forEach(m => { map[m] = { month: m, revenue: 0 }; });

  events.forEach(event => {
    if (event.status !== 'confirmed') return;
    const date = new Date(event.date || event.created_at);
    const monthKey = MONTH_NAMES[date.getMonth()];
    if (map[monthKey]) {
      map[monthKey].revenue += parseFloat(event.total_price) || 0;
    }
  });

  return MONTH_NAMES.map(m => map[m]);
};

// ─── Service ──────────────────────────────────────────────────────────────────
export const dashboardService = {
  /**
   * Fetch all events and compute dashboard data.
   * GET /admin/events/all
   */
  getDashboardData: async () => {
    let events = [];

    try {
      const response = await fetch(`${BASE_URL}/admin/events/all`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const json = await response.json();
      if (json?.status !== 'success') throw new Error(json?.message || 'Non-success response');

      events = json.data ?? [];
    } catch (error) {
      console.warn('API fetch failed, using dummy events:', error.message);
      events = [...dummyEvents];
    }

    return {
      stats: computeStats(events),
      monthlyData: computeMonthlyData(events),
      statusDistribution: computeStatusDistribution(events),
      monthlyRevenue: computeMonthlyRevenue(events),
    };
  },
};