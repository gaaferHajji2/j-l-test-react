import { api } from './api';
import { VendorRequest } from '../models/VendorRequest';

// ─── Dummy Data (Fallback) ───────────────────────────────────────────────────
const SERVICE_NAMES = [
  'Catering Package Premium', 'Photography Full Day', 'Decoration Setup',
  'AV Equipment Rental', 'Security Team (8hr)', 'Transport Shuttle',
  'Floral Arrangement Deluxe', 'Stage Lighting Package', 'DJ & Sound System',
  'Tent & Canopy Setup', 'Print Materials Bundle', 'Live Entertainment',
];

const generateDummyRequests = () => {
  const statuses = ['pending', 'pending', 'pending', 'approved', 'approved', 'rejected'];

  return Array.from({ length: 25 }, (_, index) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const serviceName = SERVICE_NAMES[index % SERVICE_NAMES.length];
    const submittedDate = new Date();
    submittedDate.setDate(submittedDate.getDate() - Math.floor(Math.random() * 60));
    const eventDate = new Date();
    eventDate.setDate(eventDate.getDate() + Math.floor(Math.random() * 90));

    return new VendorRequest({
      id: index + 1,
      order_id: Math.floor(Math.random() * 20) + 1,
      event_id: Math.floor(Math.random() * 15) + 1,
      vendor_id: Math.floor(Math.random() * 10) + 1,
      service_name: serviceName,
      description: `Professional ${serviceName.toLowerCase()} service including setup, execution, and teardown. Suitable for events up to ${Math.floor(Math.random() * 400) + 100} guests.`,
      price: String(Math.floor(Math.random() * 15000) + 1000) + '.00',
      quantity: Math.floor(Math.random() * 3) + 1,
      status,
      rejection_reason: status === 'rejected'
        ? 'Service requirements do not match venue specifications. Please revise and resubmit.'
        : null,
      created_at: submittedDate.toISOString(),
      updated_at: status !== 'pending'
        ? new Date(submittedDate.getTime() + 86400000 * Math.floor(Math.random() * 5)).toISOString()
        : submittedDate.toISOString(),
      event: {
        id: Math.floor(Math.random() * 15) + 1,
        event_name: `Event ${String.fromCharCode(65 + (index % 26))}`,
        event_type: ['wedding', 'conference', 'birthday', 'corporate'][index % 4],
        date: eventDate.toISOString().split('T')[0],
        start_time: '18:00:00',
        end_time: '23:00:00',
        guests_count: Math.floor(Math.random() * 300) + 50,
        status: 'active',
      },
      vendor: {
        id: Math.floor(Math.random() * 10) + 1,
        name: `Vendor ${String.fromCharCode(65 + (index % 10))}`,
        email: `vendor${index + 1}@example.com`,
        phone: `+966 5${Math.floor(Math.random() * 10)} ${Math.floor(1000000 + Math.random() * 9000000)}`,
      },
    });
  });
};

let dummyRequests = generateDummyRequests();

// ─── Service ──────────────────────────────────────────────────────────────────
export const vendorRequestService = {
  /**
   * Fetch all vendor service requests.
   * GET /vendor/services
   */
  getAll: async (filters = {}) => {
    let requests = [];

    try {
      const response = await api.get('/vendor/services', true);
      requests = VendorRequest.fromApiResponse(response);
    } catch (error) {
      console.warn('API fetch failed, using dummy data:', error.message);
      requests = [...dummyRequests];
    }

    // Client-side filters
    if (filters.status && filters.status !== 'all') {
      requests = requests.filter(r => r.status === filters.status);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      requests = requests.filter(r =>
        r.serviceName.toLowerCase().includes(q) ||
        r.vendorDisplayName.toLowerCase().includes(q) ||
        r.eventDisplayName.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q)
      );
    }
    if (filters.sortBy) {
      const { field, order } = filters.sortBy;
      requests.sort((a, b) => {
        let cmp = 0;
        if (field === 'created_at') cmp = new Date(a.createdAt) - new Date(b.createdAt);
        else if (field === 'service_name') cmp = a.serviceName.localeCompare(b.serviceName);
        else if (field === 'price') cmp = a.priceAsNumber - b.priceAsNumber;
        return order === 'asc' ? cmp : -cmp;
      });
    }

    return requests;
  },

  /**
   * Approve a vendor service request.
   * POST /vendor/orders/{event_id}/services/{id}/accept
   */
  approve: async (request) => {
    const eventId = request.eventId || request.event?.id;
    const serviceId = request.id;

    try {
      const response = await api.post(
        `/vendor/orders/${eventId}/services/${serviceId}/accept`,
        {},
        true
      );
      return VendorRequest.fromApi(response?.data ?? response);
    } catch (error) {
      console.warn('API approve failed, updating dummy data:', error.message);
      const idx = dummyRequests.findIndex(r => r.id === serviceId);
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
   * Reject a vendor service request with reason.
   * POST /vendor/orders/{event_id}/services/{service_id}/reject
   */
  reject: async (request, reason) => {
    const eventId = request.eventId || request.event?.id;
    const serviceId = request.id;

    try {
      const response = await api.post(
        `/vendor/orders/${eventId}/services/${serviceId}/reject`,
        { rejection_reason: reason },
        true
      );
      return VendorRequest.fromApi(response?.data ?? response);
    } catch (error) {
      console.warn('API reject failed, updating dummy data:', error.message);
      const idx = dummyRequests.findIndex(r => r.id === serviceId);
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