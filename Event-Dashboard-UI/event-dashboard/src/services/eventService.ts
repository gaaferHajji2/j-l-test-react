import { api } from './api';
import { Event } from '../models/Event';

// ─── Dummy Data (Fallback) ───────────────────────────────────────────────────
const EVENT_TYPES = ['wedding', 'conference', 'birthday', 'corporate', 'exhibition', 'concert', 'workshop', 'gala'];

const generateDummyEvents = () => {
  const statuses = ['pending', 'pending', 'pending', 'approved', 'approved', 'rejected'];

  return Array.from({ length: 25 }, (_, index) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const eventType = EVENT_TYPES[index % EVENT_TYPES.length];
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
      total_price: String(Math.floor(Math.random() * 80000) + 5000) + '.00',
      invoice_id: index + 1,
      payment_id: status === 'approved' ? index + 1 : null,
      note: Math.random() > 0.7 ? 'Special requirements: VIP seating arrangement needed.' : null,
      status,
      rejection_reason: status === 'rejected'
        ? 'Venue unavailable on requested date. Please select an alternative date.'
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

let dummyEvents = generateDummyEvents();

// ─── Service ──────────────────────────────────────────────────────────────────
export const eventService = {
  /**
   * Fetch all events.
   * GET /venue-owner/events
   */
  getAll: async (filters = {}) => {
    let events = [];

    try {
      const response = await api.get('/venue-owner/events', true);
      events = Event.fromApiResponse(response);
    } catch (error) {
      console.warn('API fetch failed, using dummy data:', error.message);
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
   * Falls back to dummy data.
   */
  getById: async (id) => {
    try {
      const response = await api.get(`/venue-owner/events/${id}`, true);
      return Event.fromApi(response?.data ?? response);
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
      const response = await api.put(`/venue-owner/events/${eventId}/accept`, {}, true);
      return Event.fromApi(response?.data ?? response);
    } catch (error) {
      console.warn('API accept failed, updating dummy data:', error.message);
      const idx = dummyEvents.findIndex(e => e.id === eventId);
      if (idx === -1) throw new Error('notFound');
      dummyEvents[idx] = new Event({
        ...dummyEvents[idx],
        status: 'approved',
        rejection_reason: null,
        updated_at: new Date().toISOString(),
      });
      return dummyEvents[idx];
    }
  },

  /**
   * Reject an event with reason.
   * POST /venue-owner/venue/{id}
   */
  reject: async (eventId, reason) => {
    try {
      const response = await api.put(`/venue-owner/venue/${eventId}`, {
        rejection_reason: reason,
      }, true);
      return Event.fromApi(response?.data ?? response);
    } catch (error) {
      console.warn('API reject failed, updating dummy data:', error.message);
      const idx = dummyEvents.findIndex(e => e.id === eventId);
      if (idx === -1) throw new Error('notFound');
      dummyEvents[idx] = new Event({
        ...dummyEvents[idx],
        status: 'rejected',
        rejection_reason: reason,
        updated_at: new Date().toISOString(),
      });
      return dummyEvents[idx];
    }
  },

  // Keep backward compatibility for existing code that uses updateStatus
  updateStatus: async (id, newStatus, reason = null) => {
    if (newStatus === 'approved' || newStatus === 'accepted') {
      return eventService.accept(id);
    }
    if (newStatus === 'rejected') {
      return eventService.reject(id, reason);
    }
    throw new Error(`Unsupported status transition: ${newStatus}`);
  },
};