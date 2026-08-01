import { api } from './api';
import { VenueOwnerRequest } from '../models/VenueOwnerRequest';

// ─── Dummy Data (Fallback) ───────────────────────────────────────────────────
const VENUE_TYPES = [
  'Convention Center', 'Hotel Ballroom', 'Outdoor Space', 'Theater',
  'Gallery', 'Stadium', 'Rooftop Venue', 'Heritage Site',
  'Conference Hall', 'Banquet Hall', 'Open Air Arena', 'Private Estate'
];

const CITIES = [
  'Riyadh', 'Jeddah', 'Dammam', 'Makkah', 'Madinah',
  'Abha', 'Tabuk', 'Al Ahsa', 'Khobar', 'Taif'
];

const generateDummyRequests = () => {
  const statuses = ['pending', 'pending', 'pending', 'active', 'active', 'rejected'];

  return Array.from({ length: 24 }, (_, index) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const venueType = VENUE_TYPES[Math.floor(Math.random() * VENUE_TYPES.length)];
    const city = CITIES[Math.floor(Math.random() * CITIES.length)];
    const submittedDate = new Date();
    submittedDate.setDate(submittedDate.getDate() - Math.floor(Math.random() * 60));

    return new VenueOwnerRequest({
      id: index + 1,
      owner_id: Math.floor(Math.random() * 50) + 1,
      name: `${city} ${venueType} ${index + 1}`,
      address: `Building ${Math.floor(Math.random() * 200) + 1}, King Fahd Road, ${city}`,
      capacity: [200, 500, 800, 1200, 2000, 3500, 5000][Math.floor(Math.random() * 7)],
      price: String(Math.floor(Math.random() * 90000) + 10000) + '.00',
      description: `Premium ${venueType.toLowerCase()} located in the heart of ${city}. Features state-of-the-art facilities, ample parking, and professional on-site management team. Suitable for conferences, weddings, exhibitions, and cultural events.`,
      // cover_image: `https://images.unsplash.com/photo-${1519167758481-83f550bb49b3 + index}?w=800&q=80`,
      images: [],
      status,
      rejection_reason: status === 'rejected'
        ? 'Property ownership documents are incomplete. Please provide valid title deed and municipality approval certificate before resubmission.'
        : null,
      created_at: submittedDate.toISOString(),
      updated_at: status !== 'pending'
        ? new Date(submittedDate.getTime() + 86400000 * Math.floor(Math.random() * 5)).toISOString()
        : null,
    });
  });
};

let dummyRequests = generateDummyRequests();

// ─── Service ──────────────────────────────────────────────────────────────────
export const venueOwnerRequestService = {
  /**
   * Fetch all venue owner requests from API.
   * Falls back to dummy data if API call fails.
   */
  getAll: async (filters = {}) => {
    let requests = [];

    try {
      const response = await api.get('/venue-owner/venues', true);
      requests = VenueOwnerRequest.fromApiResponse(response);
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
        r.name.toLowerCase().includes(q) ||
        r.address.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q)
      );
    }

    if (filters.sortBy) {
      const { field, order } = filters.sortBy;
      requests.sort((a, b) => {
        let cmp = 0;
        if (field === 'created_at') cmp = new Date(a.createdAt) - new Date(b.createdAt);
        else if (field === 'name') cmp = a.name.localeCompare(b.name);
        else if (field === 'capacity') cmp = a.capacity - b.capacity;
        else if (field === 'price') cmp = a.priceAsNumber - b.priceAsNumber;
        return order === 'asc' ? cmp : -cmp;
      });
    }

    return requests;
  },

  /**
   * Update venue status via API.
   * Falls back to updating dummy data if API call fails.
   */
  updateStatus: async (id, newStatus, reason = null) => {
    try {
      const response = await api.put(`/venue-owner/venues/${id}/status`, {
        status: newStatus,
        rejection_reason: reason,
      }, true);

      return VenueOwnerRequest.fromApi(response?.data ?? response);
    } catch (error) {
      console.warn('API update failed, updating dummy data:', error.message);

      // Fallback: update dummy data
      const idx = dummyRequests.findIndex(r => r.id === id);
      if (idx === -1) throw new Error('notFound');

      dummyRequests[idx] = new VenueOwnerRequest({
        ...dummyRequests[idx],
        status: newStatus,
        rejection_reason: newStatus === 'rejected' ? reason : null,
        updated_at: new Date().toISOString(),
      });

      return dummyRequests[idx];
    }
  },
};