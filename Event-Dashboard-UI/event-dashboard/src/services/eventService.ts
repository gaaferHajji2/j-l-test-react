import { Event } from '../models/Event';

const BASE_URL = 'https://eventak.abukm.com/api';
const AUTH_TOKEN = '15|9PYfYdFWh9rFuluRPW0Uxx4YvXPlGCXv50SIXyoU9c0cce61';

// ─── Dummy Data (Fallback) ───────────────────────────────────────────────────
const generateDummyEvents = () => {
  const statuses = ['pending', 'pending', 'confirmed', 'confirmed', 'paid', 'cancelled'];
  const types = ['wedding', 'زفاف', 'تخرج', 'conference', 'birthday', 'معرض'];

  return Array.from({ length: 25 }, (_, index) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const eventType = types[index % types.length];
    const submittedDate = new Date();
    submittedDate.setDate(submittedDate.getDate() - Math.floor(Math.random() * 60));
    const eventDate = new Date();
    eventDate.setDate(eventDate.getDate() + Math.floor(Math.random() * 90));

    return new Event({
      id: index + 1,
      customer_id: Math.floor(Math.random() * 50) + 1,
      event_name: `${eventType.charAt(0).toUpperCase() + eventType.slice(1)} Event ${index + 1}`,
      event_type: eventType,
      venue_id: Math.floor(Math.random() * 10) + 1,
      date: eventDate.toISOString().split('T')[0],
      start_time: `${String(Math.floor(Math.random() * 12) + 8).padStart(2, '0')}:00:00`,
      end_time: `${String(Math.floor(Math.random() * 6) + 18).padStart(2, '0')}:00:00`,
      guests_count: Math.floor(Math.random() * 400) + 50,
      total_price: String(Math.floor(Math.random() * 80000) + 2000) + '.00',
      invoice_id: index + 1,
      payment_id: status === 'paid' || status === 'confirmed' ? index + 1 : null,
      note: Math.random() > 0.7 ? 'VIP seating arrangement required.' : null,
      status,
      rejection_reason: status === 'cancelled' ? 'Venue unavailable on requested date.' : null,
      created_at: submittedDate.toISOString(),
      updated_at: submittedDate.toISOString(),
      customer: {
        id: Math.floor(Math.random() * 50) + 1,
        name: `Customer ${String.fromCharCode(65 + (index % 26))}`,
        phone: `+966 5${Math.floor(Math.random() * 10)} ${Math.floor(1000000 + Math.random() * 9000000)}`,
      },
      venue: {
        id: Math.floor(Math.random() * 10) + 1,
        name: `Venue ${String.fromCharCode(65 + (index % 10))}`,
        price: String(Math.floor(Math.random() * 10000) + 1000) + '.00',
      },
      services: [],
      invoice: {
        id: index + 1,
        event_id: index + 1,
        venue_price: String(Math.floor(Math.random() * 5000) + 500) + '.00',
        services_total: String(Math.floor(Math.random() * 3000)) + '.00',
        total_amount: String(Math.floor(Math.random() * 8000) + 2000) + '.00',
        status: status === 'paid' ? 'paid' : 'pending',
      },
    });
  });
};

let dummyEvents = generateDummyEvents();

// ─── Fetch Helper ────────────────────────────────────────────────────────────
const getHeaders = () => ({
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${AUTH_TOKEN}`,
});

// ─── Service ──────────────────────────────────────────────────────────────────
export const eventService = {
  /**
   * Fetch all events.
   * GET /admin/events/all
   */
  getAll: async (filters = {}) => {
    let events = [];

    try {
      const response = await fetch(`${BASE_URL}/admin/events/all`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const json = await response.json();
      if (json?.status !== 'success') throw new Error(json?.message || 'Non-success response');

      events = Event.fromApiResponse(json);
    } catch (error) {
      console.warn('API fetch failed, using dummy events:', error.message);
      events = [...dummyEvents];
    }

    // Client-side filters
    if (filters.status && filters.status !== 'all') {
      events = events.filter(e => e.status === filters.status);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      events = events.filter(e =>
        e.eventName.toLowerCase().includes(q) ||
        e.customerDisplayName.toLowerCase().includes(q) ||
        e.eventType.toLowerCase().includes(q) ||
        e.venueDisplayName.toLowerCase().includes(q)
      );
    }
    if (filters.sortBy) {
      const { field, order } = filters.sortBy;
      events.sort((a, b) => {
        let cmp = 0;
        if (field === 'date') cmp = new Date(a.date) - new Date(b.date);
        else if (field === 'created_at') cmp = new Date(a.createdAt) - new Date(b.createdAt);
        else if (field === 'event_name') cmp = a.eventName.localeCompare(b.eventName);
        else if (field === 'total_price') cmp = a.totalPriceAsNumber - b.totalPriceAsNumber;
        return order === 'asc' ? cmp : -cmp;
      });
    }

    return events;
  },

  /**
   * Get single event by ID (for details page).
   */
  getById: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/admin/events/${id}`, {
        method: 'GET',
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = await response.json();
      return Event.fromApi(json?.data ?? json);
    } catch (error) {
      console.warn(`API getById failed for event #${id}, using dummy:`, error.message);
      return dummyEvents.find(e => e.id === parseInt(id)) || null;
    }
  },

  /**
   * Accept an event.
   * POST /venue-owner/events/{id}/accept
   */
  accept: async (eventId) => {
    try {
      const response = await fetch(`${BASE_URL}/venue-owner/events/${eventId}/accept`, {
        method: 'POST',
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = await response.json();
      return Event.fromApi(json?.data ?? json);
    } catch (error) {
      console.warn('API accept failed, updating dummy data:', error.message);
      const idx = dummyEvents.findIndex(e => e.id === eventId);
      if (idx === -1) throw new Error('notFound');
      dummyEvents[idx] = new Event({ ...dummyEvents[idx], status: 'confirmed', rejection_reason: null, updated_at: new Date().toISOString() });
      return dummyEvents[idx];
    }
  },

  /**
   * Reject an event with reason.
   * POST /venue-owner/venue/{id}
   */
  reject: async (eventId, reason) => {
    try {
      const response = await fetch(`${BASE_URL}/venue-owner/venue/${eventId}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ rejection_reason: reason }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = await response.json();
      return Event.fromApi(json?.data ?? json);
    } catch (error) {
      console.warn('API reject failed, updating dummy data:', error.message);
      const idx = dummyEvents.findIndex(e => e.id === eventId);
      if (idx === -1) throw new Error('notFound');
      dummyEvents[idx] = new Event({ ...dummyEvents[idx], status: 'rejected', rejection_reason: reason, updated_at: new Date().toISOString() });
      return dummyEvents[idx];
    }
  },

  // Backward compatibility alias
  updateStatus: async (id, newStatus, reason = null) => {
    if (newStatus === 'approved' || newStatus === 'confirmed') return eventService.accept(id);
    if (newStatus === 'rejected') return eventService.reject(id, reason);
    throw new Error(`Unsupported status transition: ${newStatus}`);
  },
};