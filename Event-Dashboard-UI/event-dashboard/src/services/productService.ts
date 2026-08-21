import { Service } from '../models/Service';

const BASE_URL = 'https://eventak.abukm.com/api';

// ─── Dummy Data (Fallback) ───────────────────────────────────────────────────
const CATEGORIES = [
  'Catering Equipment', 'Decorations', 'Audio/Visual', 'Lighting',
  'Furniture', 'Signage', 'Photography Gear', 'Safety Equipment',
  'Transportation', 'Print Materials', 'Stage Equipment', 'Tents & Canopies'
];

const VENDORS = [
  { id: 1, name: 'Al-Rashid Catering Co.' },
  { id: 2, name: 'Bright Lights AV Solutions' },
  { id: 3, name: 'Elegant Decor Rentals' },
  { id: 4, name: 'SecureGuard Safety Services' },
  { id: 5, name: 'Premium Furniture Hire' },
  { id: 6, name: 'Crystal Clear Photography' },
  { id: 7, name: 'SkyHigh Tent Rentals' },
  { id: 8, name: 'PrintMaster Signage' },
  { id: 9, name: 'SoundWave Audio Systems' },
  { id: 10, name: 'Royal Transport Services' },
];

const SERVICE_NAMES = {
  'Catering Equipment': ['Industrial Buffet Warmer', 'Commercial Coffee Machine', 'Chafing Dish Set (12pc)'],
  'Decorations': ['Gold Arch Backdrop', 'Floral Centerpiece Collection', 'LED String Lights (100m)'],
  'Audio/Visual': ['Wireless Microphone Kit', '4K Projector 5000 Lumens', 'Portable PA System'],
  'Lighting': ['Moving Head Spotlight', 'LED Uplight Package (20pc)', 'Laser Show System'],
  'Furniture': ['Chiavari Chair (50pc)', 'Round Banquet Table (6ft)', 'Luxury Lounge Sofa Set'],
  'Signage': ['Custom Welcome Board', 'Directional Sign Set', 'Digital Display Stand'],
  'Photography Gear': ['Photo Booth Package', 'Ring Light Professional', 'Backdrop Stand Kit'],
  'Safety Equipment': ['Fire Extinguisher Station', 'First Aid Kit Industrial', 'Crowd Barrier Set'],
  'Transportation': ['Luxury Shuttle Bus', 'Golf Cart Fleet (5pc)', 'VIP Sedan Service'],
  'Print Materials': ['Event Program Booklets (500)', 'Custom Badge Printing', 'Banner Roll-Up'],
  'Stage Equipment': ['Modular Stage Platform', 'Truss Tower System', 'Stage Curtain Set'],
  'Tents & Canopies': ['Marquee Tent 10x20m', 'Pop-Up Canopy (3x3m)', 'Stretch Tent Cover'],
};

const generateDummyServices = () => {
  const statuses = ['pending', 'pending', 'active', 'active', 'active', 'inactive', 'rejected'];

  return Array.from({ length: 35 }, (_, index) => {
    const vendor = VENDORS[Math.floor(Math.random() * VENDORS.length)];
    const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const names = SERVICE_NAMES[category] || ['General Service'];
    const name = names[Math.floor(Math.random() * names.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const createdDate = new Date();
    createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 90));

    return new Service({
      id: index + 1,
      vendor_id: vendor.id,
      category_id: CATEGORIES.indexOf(category) + 1,
      name: `${name} ${String.fromCharCode(65 + (index % 26))}`,
      description: `High-quality ${category.toLowerCase()} suitable for events of all sizes. Professionally maintained and regularly inspected.`,
      price: String(Math.floor(Math.random() * 4500) + 150) + '.00',
      images: [],
      status,
      rejection_reason: status === 'rejected' ? 'Missing certification documents.' : null,
      created_at: createdDate.toISOString(),
      updated_at: createdDate.toISOString(),
      vendor: { id: vendor.id, name: vendor.name, email: '', phone: '' },
      category: { id: CATEGORIES.indexOf(category) + 1, name: category },
    });
  });
};

let dummyServices = generateDummyServices();

// ─── Fetch Helper ────────────────────────────────────────────────────────────
const getAuthHeaders = () => {
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };
  const token = localStorage.getItem('authToken');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// ─── Service ──────────────────────────────────────────────────────────────────
export const productService = {
  /**
   * Fetch all services using native fetch.
   * GET /services
   * Falls back to dummy data on any error.
   */
  getAll: async (filters = {}) => {
    let services = [];

    try {
      const response = await fetch(`${BASE_URL}/services`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const json = await response.json();

      if (json?.status !== 'success') {
        throw new Error(json?.message || 'API returned non-success status');
      }

      services = Service.fromPaginatedResponse(json);
    } catch (error) {
      console.warn('API fetch failed, using dummy services:', error.message);
      services = [...dummyServices];
    }

    // Client-side filters (applied to both real and dummy data)
    if (filters.status && filters.status !== 'all') {
      services = services.filter(s => s.status === filters.status);
    }

    if (filters.vendorId && filters.vendorId !== 'all') {
      services = services.filter(s => s.vendorId === Number(filters.vendorId));
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      services = services.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.vendorDisplayName.toLowerCase().includes(q) ||
        s.categoryDisplayName.toLowerCase().includes(q)
      );
    }

    if (filters.sortBy) {
      const { field, order } = filters.sortBy;
      services.sort((a, b) => {
        let cmp = 0;
        if (field === 'name') cmp = a.name.localeCompare(b.name);
        else if (field === 'price') cmp = a.priceAsNumber - b.priceAsNumber;
        else if (field === 'created_at') cmp = new Date(a.createdAt) - new Date(b.createdAt);
        else if (field === 'vendorName') cmp = a.vendorDisplayName.localeCompare(b.vendorDisplayName);
        return order === 'asc' ? cmp : -cmp;
      });
    }

    return services;
  },

  /**
   * Update service status via API.
   * Falls back to updating dummy data if API fails.
   */
  updateStatus: async (id, newStatus, reason = null) => {
    try {
      const response = await fetch(`${BASE_URL}/services/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus, rejection_reason: reason }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const json = await response.json();
      return Service.fromApi(json?.data ?? json);
    } catch (error) {
      console.warn('API updateStatus failed, updating dummy data:', error.message);

      const idx = dummyServices.findIndex(s => s.id === id);
      if (idx === -1) throw new Error('notFound');

      dummyServices[idx] = new Service({
        ...dummyServices[idx],
        status: newStatus,
        rejection_reason: newStatus === 'rejected' ? reason : null,
        updated_at: new Date().toISOString(),
      });

      return dummyServices[idx];
    }
  },

  /** Extract unique vendors from current dataset for filter dropdown */
  getVendors: () => VENDORS,

  /** Extract unique categories from current dataset for filter dropdown */
  getCategories: () => CATEGORIES,
};