import { ServiceCategoryGroup } from '../models/ServiceCategoryGroup';

const BASE_URL = 'https://eventak.abukm.com/api';
const AUTH_TOKEN = '15|9PYfYdFWh9rFuluRPW0Uxx4YvXPlGCXv50SIXyoU9c0cce61';

// ─── Dummy Data (Fallback) ───────────────────────────────────────────────────
const generateDummyData = () => [
  new ServiceCategoryGroup({
    id: 1, name: 'التصوير والفيديو', description: null,
    created_at: '2026-08-20T15:26:55.000000Z',
    services: [
      { id: 1, vendor_id: 1, category_id: 1, name: 'باقة تصوير كاملة (فيديو + صور)', description: 'باقة تصوير كاملة (فيديو + صور)', price: '500.00', images: [], status: 'active', created_at: '2026-08-20T15:26:55.000000Z', vendor: { id: 1, name: 'استوديو اللحظة', email: 'vendor.photo@eventak.com', phone: '0911111111' } },
      { id: 2, vendor_id: 1, category_id: 1, name: 'باقة تصوير صور فقط', description: 'باقة تصوير صور فقط', price: '250.00', images: [], status: 'active', created_at: '2026-08-20T15:26:55.000000Z', vendor: { id: 1, name: 'استوديو اللحظة', email: 'vendor.photo@eventak.com', phone: '0911111111' } },
    ],
  }),
  new ServiceCategoryGroup({
    id: 2, name: 'الديجي والموسيقى', description: null,
    created_at: '2026-08-20T15:26:55.000000Z',
    services: [
      { id: 3, vendor_id: 2, category_id: 2, name: 'دي جي + نظام صوت وإضاءة', description: 'دي جي + نظام صوت وإضاءة', price: '300.00', images: [], status: 'active', created_at: '2026-08-20T15:26:55.000000Z', vendor: { id: 2, name: 'DJ Karim', email: 'vendor.dj@eventak.com', phone: '0911111112' } },
    ],
  }),
  new ServiceCategoryGroup({
    id: 3, name: 'البوفيه والضيافة', description: null,
    created_at: '2026-08-20T15:26:55.000000Z',
    services: [
      { id: 4, vendor_id: 3, category_id: 3, name: 'بوفيه فاخر للقاعة', description: 'بوفيه فاخر للقاعة', price: '1500.00', images: [], status: 'active', created_at: '2026-08-20T15:26:55.000000Z', vendor: { id: 3, name: 'بوفيه الضيافة الذهبية', email: 'vendor.buffet@eventak.com', phone: '0911111113' } },
      { id: 5, vendor_id: 3, category_id: 3, name: 'بوفيه اقتصادي للقاعة', description: 'بوفيه اقتصادي للقاعة', price: '900.00', images: [], status: 'active', created_at: '2026-08-20T15:26:55.000000Z', vendor: { id: 3, name: 'بوفيه الضيافة الذهبية', email: 'vendor.buffet@eventak.com', phone: '0911111113' } },
    ],
  }),
  new ServiceCategoryGroup({
    id: 4, name: 'التنسيق والديكور', description: null,
    created_at: '2026-08-20T15:26:55.000000Z',
    services: [
      { id: 6, vendor_id: 4, category_id: 4, name: 'تنسيق وديكور القاعة', description: 'تنسيق وديكور القاعة', price: '400.00', images: [], status: 'active', created_at: '2026-08-20T15:26:55.000000Z', vendor: { id: 4, name: 'لمسات ديكور', email: 'vendor.decor@eventak.com', phone: '0911111114' } },
    ],
  }),
];

let dummyData = generateDummyData();

// ─── Fetch Helper ────────────────────────────────────────────────────────────
const getHeaders = () => ({
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${AUTH_TOKEN}`,
});

// ─── Service ──────────────────────────────────────────────────────────────────
export const servicesByCategoryService = {
  /**
   * GET /services/by-category
   */
  getAll: async (search = '') => {
    let categories = [];

    try {
      const response = await fetch(`${BASE_URL}/services/by-category`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const json = await response.json();
      if (json?.status !== 'success') throw new Error(json?.message || 'Non-success response');

      categories = ServiceCategoryGroup.fromApiResponse(json);
    } catch (error) {
      console.warn('API fetch failed, using dummy data:', error.message);
      categories = [...dummyData];
    }

    // Client-side search across category names, service names, and vendor names
    if (search.trim()) {
      const q = search.toLowerCase();
      categories = categories
        .map(cat => {
          const filteredServices = cat.services.filter(s =>
            s.name.toLowerCase().includes(q) ||
            s.vendorDisplayName.toLowerCase().includes(q) ||
            s.description.toLowerCase().includes(q)
          );
          // Keep category if its name matches OR it has matching services
          if (cat.name.toLowerCase().includes(q)) return cat;
          if (filteredServices.length > 0) {
            return new ServiceCategoryGroup({ ...cat, services: filteredServices });
          }
          return null;
        })
        .filter(Boolean);
    }

    return categories;
  },
};