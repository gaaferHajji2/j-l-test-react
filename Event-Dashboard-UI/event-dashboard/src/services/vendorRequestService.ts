import { api } from './api';
import { VendorRequest } from '../models/VendorRequest';

// ─── Dummy Data (Fallback) ───────────────────────────────────────────────────
const EVENT_TYPES = ['wedding', 'conference', 'birthday', 'corporate', 'exhibition', 'concert', 'workshop', 'gala'];

const generateDummyRequests = () => {
  const statuses = ['pending', 'pending', 'pending', 'approved', 'approved', 'rejected'];

  return Array.from({ length: 25 }, (_, index) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const eventType = EVENT_TYPES[Math.floor(Math.random() * EVENT_TYPES.length)];
    const submittedDate = new Date();
    submittedDate.setDate(submittedDate.getDate() - Math.floor(Math.random() * 60));
    const eventDate = new Date();
    eventDate.setDate(eventDate.getDate() + Math.floor(Math.random() * 90));

    return new VendorRequest({
      id: index + 1,
      customer_id: Math.floor(Math.random() * 50) + 1,
      event_name: `${eventType.charAt(0).toUpperCase() + eventType.slice(1)} Event ${index + 1}`,
      event_type: eventType,
      venue_id: Math.floor(Math.random() * 10) + 1,
      date: eventDate.toISOString().split('T')[0],
      start_time: `${String(Math.floor(Math.random() * 12) + 8).padStart(2, '0')}:00:00`,
      end_time: `${String(Math.floor(Math.random() * 6) + 18).padStart(2, '0')}:00:00`,
      guests_count: Math.floor(Math.random() * 400) + 50,
      total_price: String(Math.floor(Math.random() * 80000) + 5000) + '.00',
      invoice_id: index + 1,
      payment_id: status === 'approved' ? index + 1 : null,
      note: Math.random() > 0.7 ? 'Special requirements: VIP seating arrangement needed.' : null,
      status,
      rejection_reason: status === 'rejected'
        ? 'Incomplete documentation. Please resubmit with valid commercial registration and insurance certificates.'
        : null,
      created_at: submittedDate.toISOString(),
      updated_at: status !== 'pending'
        ? new Date(submittedDate.getTime() + 86400000 * Math.floor(Math.random() * 5)).toISOString()
        : submittedDate.toISOString(),
      customer: {
        id: Math.floor(Math.random() * 50) + 1,
        name: `Customer ${String.fromCharCode(65 + (index % 26))}`,
        email: `customer${index + 1}@example.com`,
        phone: `+966 5${Math.floor(Math.random() * 10)} ${Math.floor(1000000 + Math.random() * 9000000)}`,
      },
      venue: {
        id: Math.floor(Math.random() * 10) + 1,
        name: `Venue ${String.fromCharCode(65 + (index % 10))}`,
      },
    });
  });
};

let dummyRequests = generateDummyRequests();

// ─── Service ──────────────────────────────────────────────────────────────────
export const vendorRequestService = {
  /**
   * Fetch all vendor requests from API.
   * Falls back to dummy data if API call fails.
   */
  getAll: async (filters = {}) => {
    let requests = [];

    try {
      const response = await api.get('/venue-owner/events', true);
      requests = VendorRequest.fromApiResponse(response);
    } catch (error) {
      console.warn('API fetch failed, using dummy data:', error.message);
      requests = [...dummyRequests];
    }

    // Apply client-side filters
    if (filters.status && filters.status !== 'all') {
      requests = requests.filter(r => r.status === filters.status);
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      requests = requests.filter(r =>
        r.eventName.toLowerCase().includes(q) ||
        r.customerDisplayName.toLowerCase().includes(q) ||
        r.customer?.email?.toLowerCase().includes(q) ||
        r.eventType.toLowerCase().includes(q) ||
        r.venueDisplayName.toLowerCase().includes(q)
      );
    }

    if (filters.sortBy) {
      const { field, order } = filters.sortBy;
      requests.sort((a, b) => {
        let cmp = 0;
        if (field === 'created_at') cmp = new Date(a.createdAt) - new Date(b.createdAt);
        else if (field === 'event_name') cmp = a.eventName.localeCompare(b.eventName);
        else if (field === 'date') cmp = new Date(a.date) - new Date(b.date);
        else if (field === 'total_price') cmp = a.totalPriceAsNumber - b.totalPriceAsNumber;
        return order === 'asc' ? cmp : -cmp;
      });
    }

    return requests;
  },

  /**
   * Approve a vendor request.
   * POST /venue-owner/events/{id}/accept
   */
  approve: async (id) => {
    try {
      const response = await api.put(`/venue-owner/events/${id}/accept`, {}, true);
      return VendorRequest.fromApi(response?.data ?? response);
    } catch (error) {
      console.warn('API approve failed, updating dummy data:', error.message);

      const idx = dummyRequests.findIndex(r => r.id === id);
      if (idx === -1) throw new Error('notFound');

      dummyRequests[idx] = new VendorRequest({
        ...dummyRequests[idx],
        status: 'approved',
        rejection_reason: null,
        updated_at: new Date().toISOString(),
      });

      return dummyRequests[idx];
    }
  },

  /**
   * Reject a vendor request with reason.
   * POST /venue-owner/venue/{id}
   */
  reject: async (id, reason) => {
    try {
      const response = await api.put(`/venue-owner/venue/${id}`, {
        rejection_reason: reason,
      }, true);
      return VendorRequest.fromApi(response?.data ?? response);
    } catch (error) {
      console.warn('API reject failed, updating dummy data:', error.message);

      const idx = dummyRequests.findIndex(r => r.id === id);
      if (idx === -1) throw new Error('notFound');

      dummyRequests[idx] = new VendorRequest({
        ...dummyRequests[idx],
        status: 'rejected',
        rejection_reason: reason,
        updated_at: new Date().toISOString(),
      });

      return dummyRequests[idx];
    }
  },
};