import { ActiveVenue } from '../models/ActiveVenue';

const BASE_URL = 'https://eventak.abukm.com/api';
const AUTH_TOKEN = '15|9PYfYdFWh9rFuluRPW0Uxx4YvXPlGCXv50SIXyoU9c0cce61';

// ─── Dummy Data (Fallback) ───────────────────────────────────────────────────
const generateDummyVenues = () => [
  new ActiveVenue({
    id: 1, owner_id: 9, name: 'قاعة الماسة', address: 'دمشق - المزة',
    capacity: 300, price: '1000.00',
    description: 'قاعة أفراح فاخرة بإطلالة بانورامية ومواقف سيارات واسعة.',
    status: 'active', created_at: '2026-08-20T17:07:12.000000Z', updated_at: '2026-08-20T17:07:12.000000Z',
    cover_image_url: null, images_urls: [],
    owner: { id: 9, name: 'Sally', email: 'Sally@example.com', phone: '+96399999999' },
  }),
  new ActiveVenue({
    id: 2, owner_id: 9, name: 'قاعة اللؤلؤة', address: 'حلب - الفرقان',
    capacity: 150, price: '600.00',
    description: 'قاعة مناسبة للحفلات الصغيرة والمتوسطة بأسعار اقتصادية.',
    status: 'active', created_at: '2026-08-20T17:07:12.000000Z', updated_at: '2026-08-20T17:07:12.000000Z',
    cover_image_url: null, images_urls: [],
    owner: { id: 9, name: 'Sally', email: 'Sally@example.com', phone: '+96399999999' },
  }),
  new ActiveVenue({
    id: 3, owner_id: 10, name: 'Riyadh Grand Ballroom', address: 'Riyadh - Olaya Street',
    capacity: 500, price: '5000.00',
    description: 'Premium ballroom with state-of-the-art AV equipment and luxury furnishings.',
    status: 'active', created_at: '2026-07-15T10:00:00.000000Z', updated_at: '2026-07-15T10:00:00.000000Z',
    cover_image_url: null, images_urls: [],
    owner: { id: 10, name: 'Ahmed Al-Rashid', email: 'ahmed@venues.sy', phone: '+966501234567' },
  }),
  new ActiveVenue({
    id: 4, owner_id: 11, name: 'Jeddah Waterfront Hall', address: 'Jeddah - Corniche',
    capacity: 800, price: '8000.00',
    description: 'Stunning waterfront venue with panoramic sea views and outdoor terrace.',
    status: 'active', created_at: '2026-06-20T14:30:00.000000Z', updated_at: '2026-06-20T14:30:00.000000Z',
    cover_image_url: null, images_urls: [],
    owner: { id: 11, name: 'Fatima Hassan', email: 'fatima@venues.sy', phone: '+966559876543' },
  }),
  new ActiveVenue({
    id: 5, owner_id: 12, name: 'Dammam Convention Center', address: 'Dammam - King Fahd Road',
    capacity: 1200, price: '12000.00',
    description: 'Large-scale convention center suitable for conferences, exhibitions, and corporate events.',
    status: 'active', created_at: '2026-05-10T09:00:00.000000Z', updated_at: '2026-05-10T09:00:00.000000Z',
    cover_image_url: null, images_urls: [],
    owner: { id: 12, name: 'Khalid Ibrahim', email: 'khalid@venues.sy', phone: '+966541112222' },
  }),
  new ActiveVenue({
    id: 6, owner_id: 13, name: 'Abha Mountain Resort', address: 'Abha - Al-Soudah',
    capacity: 200, price: '3500.00',
    description: 'Mountain resort venue with cool climate and breathtaking natural scenery.',
    status: 'active', created_at: '2026-04-05T16:00:00.000000Z', updated_at: '2026-04-05T16:00:00.000000Z',
    cover_image_url: null, images_urls: [],
    owner: { id: 13, name: 'Noura Al-Saud', email: 'noura@venues.sy', phone: '+966567778888' },
  }),
];

let dummyVenues = generateDummyVenues();

// ─── Fetch Helper ────────────────────────────────────────────────────────────
const getHeaders = () => ({
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${AUTH_TOKEN}`,
});

// ─── Service ──────────────────────────────────────────────────────────────────
export const activeVenueService = {
  /**
   * Fetch all active venues.
   * GET /admin/venues/active
   */
  getAll: async (search = '') => {
    let venues = [];

    try {
      const response = await fetch(`${BASE_URL}/admin/venues/active`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const json = await response.json();
      if (json?.status !== 'success') throw new Error(json?.message || 'Non-success response');

      venues = ActiveVenue.fromApiResponse(json);
    } catch (error) {
      console.warn('API fetch failed, using dummy venues:', error.message);
      venues = [...dummyVenues];
    }

    // Client-side search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      venues = venues.filter(v =>
        v.name.toLowerCase().includes(q) ||
        v.address.toLowerCase().includes(q) ||
        v.ownerDisplayName.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q)
      );
    }

    return venues;
  },
};