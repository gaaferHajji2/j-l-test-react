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

const PRODUCT_NAMES = {
  'Catering Equipment': ['Industrial Buffet Warmer', 'Commercial Coffee Machine', 'Chafing Dish Set (12pc)', 'Portable Bar Counter'],
  'Decorations': ['Gold Arch Backdrop', 'Floral Centerpiece Collection', 'LED String Lights (100m)', 'Velvet Table Runner Set'],
  'Audio/Visual': ['Wireless Microphone Kit', '4K Projector 5000 Lumens', 'Portable PA System', 'DJ Mixer Console'],
  'Lighting': ['Moving Head Spotlight', 'LED Uplight Package (20pc)', 'Laser Show System', 'Ambient Glow Orb Set'],
  'Furniture': ['Chiavari Chair (50pc)', 'Round Banquet Table (6ft)', 'Luxury Lounge Sofa Set', 'Cocktail High Table'],
  'Signage': ['Custom Welcome Board', 'Directional Sign Set', 'Digital Display Stand', 'Acrylic Menu Holder (20pc)'],
  'Photography Gear': ['Photo Booth Package', 'Ring Light Professional', 'Backdrop Stand Kit', 'Instant Print Camera Set'],
  'Safety Equipment': ['Fire Extinguisher Station', 'First Aid Kit Industrial', 'Crowd Barrier Set (10pc)', 'Emergency Exit Sign Pack'],
  'Transportation': ['Luxury Shuttle Bus', 'Golf Cart Fleet (5pc)', 'VIP Sedan Service', 'Equipment Truck Rental'],
  'Print Materials': ['Event Program Booklets (500)', 'Custom Badge Printing', 'Banner Roll-Up (3pc)', 'Invitation Card Suite'],
  'Stage Equipment': ['Modular Stage Platform', 'Truss Tower System', 'Stage Curtain Set', 'Monitor Speaker Pair'],
  'Tents & Canopies': ['Marquee Tent 10x20m', 'Pop-Up Canopy (3x3m)', 'Stretch Tent Cover', 'Transparent Dome Tent'],
};

const generateMockProducts = () => {
  const statuses = ['pending', 'pending', 'active', 'active', 'active', 'inactive', 'rejected'];

  return Array.from({ length: 35 }, (_, index) => {
    const vendor = VENDORS[Math.floor(Math.random() * VENDORS.length)];
    const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const names = PRODUCT_NAMES[category];
    const name = names[Math.floor(Math.random() * names.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const submittedDate = new Date();
    submittedDate.setDate(submittedDate.getDate() - Math.floor(Math.random() * 90));

    return {
      id: index + 1,
      name: `${name} ${String.fromCharCode(65 + (index % 26))}`,
      description: `High-quality ${category.toLowerCase()} suitable for events of all sizes. Professionally maintained and regularly inspected. Includes delivery, setup, and on-site support within the Riyadh metropolitan area.`,
      category,
      vendorId: vendor.id,
      vendorName: vendor.name,
      price: Math.floor(Math.random() * 4500) + 150,
      stock: Math.floor(Math.random() * 50) + 1,
      image: `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`,
      status,
      submittedAt: submittedDate.toISOString(),
      reviewedAt: status !== 'pending' ? new Date(submittedDate.getTime() + 86400000 * Math.floor(Math.random() * 5)).toISOString() : null,
    };
  });
};

let mockProducts = generateMockProducts();
let nextId = 36;

export const productService = {
  getAll: async (filters = {}) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    let filtered = [...mockProducts];

    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(p => p.status === filters.status);
    }

    if (filters.vendorId && filters.vendorId !== 'all') {
      filtered = filtered.filter(p => p.vendorId === Number(filters.vendorId));
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.vendorName.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    if (filters.sortBy) {
      const { field, order } = filters.sortBy;
      filtered.sort((a, b) => {
        let cmp = 0;
        if (field === 'name') cmp = a.name.localeCompare(b.name);
        else if (field === 'price') cmp = a.price - b.price;
        else if (field === 'submittedAt') cmp = new Date(a.submittedAt) - new Date(b.submittedAt);
        else if (field === 'vendorName') cmp = a.vendorName.localeCompare(b.vendorName);
        return order === 'asc' ? cmp : -cmp;
      });
    }

    return filtered;
  },

  updateStatus: async (id, newStatus, reason = null) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const idx = mockProducts.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('notFound');
    mockProducts[idx] = {
      ...mockProducts[idx],
      status: newStatus,
      rejectionReason: newStatus === 'rejected' ? reason : null,
      reviewedAt: new Date().toISOString(),
    };
    return mockProducts[idx];
  },

  getVendors: () => VENDORS,
  getCategories: () => CATEGORIES,
};