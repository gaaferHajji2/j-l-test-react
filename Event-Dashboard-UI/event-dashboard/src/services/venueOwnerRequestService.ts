import { VenueOwnerRequest } from '../models/VenueOwnerRequest';

const BASE_URL = 'https://eventak.abukm.com/api';
const AUTH_TOKEN = '15|9PYfYdFWh9rFuluRPW0Uxx4YvXPlGCXv50SIXyoU9c0cce61';

// ─── Dummy Data (Fallback) ───────────────────────────────────────────────────
const generateDummyRequests = () => {
  const statuses = ['pending', 'pending', 'pending', 'approved', 'approved', 'rejected'];
  const types = ['create', 'update'];
  const cities = ['Riyadh', 'Jeddah', 'Dammam', 'Makkah', 'Madinah', 'Abha', 'Damascus', 'Aleppo'];

  return Array.from({ length: 24 }, (_, index) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const submittedDate = new Date();
    submittedDate.setDate(submittedDate.getDate() - Math.floor(Math.random() * 60));

    return new VenueOwnerRequest({
      id: index + 1,
      owner_id: Math.floor(Math.random() * 20) + 1,
      venue_id: type === 'update' ? Math.floor(Math.random() * 15) + 1 : null,
      type,
      name: `${city} Venue ${String.fromCharCode(65 + (index % 26))}`,
      address: `${city} - Main Street - Building ${Math.floor(Math.random() * 200) + 1}`,
      capacity: [200, 500, 800, 1200, 2000, 3500][Math.floor(Math.random() * 6)],
      price: String(Math.floor(Math.random() * 90000) + 10000) + '.00',
      description: `Premium venue located in the heart of ${city}. Features state-of-the-art facilities, ample parking, and professional on-site management team.`,
      cover_image: null,
      images: [],
      status,
      admin_notes: status === 'rejected'
        ? 'Property ownership documents are incomplete. Please provide valid title deed and municipality approval certificate.'
        : null,
      created_at: submittedDate.toISOString(),
      updated_at: status !== 'pending'
        ? new Date(submittedDate.getTime() + 86400000 * Math.floor(Math.random() * 5)).toISOString()
        : submittedDate.toISOString(),
      owner: {
        id: Math.floor(Math.random() * 20) + 1,
        name: `Owner ${String.fromCharCode(65 + (index % 26))}`,
        email: `owner${index + 1}@example.com`,
        avatar: null,
        phone: `+966 5${Math.floor(Math.random() * 10)} ${Math.floor(1000000 + Math.random() * 9000000)}`,
        role: 'venue_owner',
        email_verified_at: Math.random() > 0.3 ? submittedDate.toISOString() : null,
        created_at: submittedDate.toISOString(),
      },
    });
  });
};

let dummyRequests = generateDummyRequests();

// ─── Fetch Helper ────────────────────────────────────────────────────────────
const getHeaders = () => ({
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${AUTH_TOKEN}`,
});

// ─── Service ──────────────────────────────────────────────────────────────────
export const venueOwnerRequestService = {
  /**
   * Fetch all venue owner requests.
   * GET /admin/venue-requests
   */
  getAll: async (filters = {}) => {
    let requests = [];

    try {
      const response = await fetch(`${BASE_URL}/admin/venue-requests`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const json = await response.json();
      if (json?.status !== 'success') throw new Error(json?.message || 'Non-success response');

      requests = VenueOwnerRequest.fromApiResponse(json);
    } catch (error) {
      console.warn('API fetch failed, using dummy data:', error.message);
      requests = [...dummyRequests];
    }

    // Client-side filters
    if (filters.status && filters.status !== 'all') {
      requests = requests.filter(r => r.status === filters.status);
    }

    if (filters.type && filters.type !== 'all') {
      requests = requests.filter(r => r.type === filters.type);
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      requests = requests.filter(r =>
        r.ownerDisplayName.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q) ||
        r.ownerEmail.toLowerCase().includes(q) ||
        r.city.toLowerCase().includes(q) ||
        r.address.toLowerCase().includes(q)
      );
    }

    if (filters.sortBy) {
      const { field, order } = filters.sortBy;
      requests.sort((a, b) => {
        let cmp = 0;
        if (field === 'created_at') cmp = new Date(a.createdAt) - new Date(b.createdAt);
        else if (field === 'name') cmp = a.name.localeCompare(b.name);
        else if (field === 'ownerName') cmp = a.ownerDisplayName.localeCompare(b.ownerDisplayName);
        return order === 'asc' ? cmp : -cmp;
      });
    }

    return requests;
  },

  /**
   * Approve a venue owner request.
   * POST /admin/venue-requests/{id}/approve
   */
  approve: async (requestId) => {
    try {
      const response = await fetch(`${BASE_URL}/admin/venue-requests/${requestId}/approve`, {
        method: 'PUT',
        headers: getHeaders(),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const json = await response.json();
      return VenueOwnerRequest.fromApi(json?.data ?? json);
    } catch (error) {
      console.warn('API approve failed, updating dummy data:', error.message);
      const idx = dummyRequests.findIndex(r => r.id === requestId);
      if (idx === -1) throw new Error('notFound');
      dummyRequests[idx] = new VenueOwnerRequest({
        ...dummyRequests[idx],
        status: 'approved',
        admin_notes: null,
        updated_at: new Date().toISOString(),
      });
      return dummyRequests[idx];
    }
  },

  /**
   * Reject a venue owner request with reason.
   * POST /admin/venue-requests/{id}/reject
   */
  reject: async (requestId, reason) => {
    try {
      const response = await fetch(`${BASE_URL}/admin/venue-requests/${requestId}/reject`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ admin_notes: reason }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const json = await response.json();
      return VenueOwnerRequest.fromApi(json?.data ?? json);
    } catch (error) {
      console.warn('API reject failed, updating dummy data:', error.message);
      const idx = dummyRequests.findIndex(r => r.id === requestId);
      if (idx === -1) throw new Error('notFound');
      dummyRequests[idx] = new VenueOwnerRequest({
        ...dummyRequests[idx],
        status: 'rejected',
        admin_notes: reason,
        updated_at: new Date().toISOString(),
      });
      return dummyRequests[idx];
    }
  },
};