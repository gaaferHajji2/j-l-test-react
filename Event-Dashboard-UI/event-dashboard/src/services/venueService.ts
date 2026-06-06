const VENUE_TYPES = [
  'conventionCenter', 'hotel', 'outdoor', 'theater',
  'gallery', 'stadium', 'rooftop', 'heritage'
];

const AMENITIES_LIST = [
  'parking', 'wifi', 'catering', 'av', 'stage',
  'ac', 'accessible', 'dressingRooms', 'security', 'generator'
];

const AVAILABILITY_STATUSES = ['available', 'booked', 'maintenance'];

// Mock connected vendors per venue
const generateConnectedVendors = (venueId) => {
  const vendorCategories = ['Catering', 'Photography', 'Decoration', 'Audio/Visual', 'Security', 'Transportation'];
  const count = Math.floor(Math.random() * 5) + 2;
  
  return Array.from({ length: count }, (_, i) => ({
    id: `${venueId}-v${i}`,
    name: `${vendorCategories[i % vendorCategories.length]} Pro ${venueId}-${i}`,
    category: vendorCategories[i % vendorCategories.length],
    rating: (3.5 + Math.random() * 1.5).toFixed(1),
    isActive: Math.random() > 0.2,
  }));
};

const generateMockVenues = () => {
  return Array.from({ length: 18 }, (_, index) => {
    const type = VENUE_TYPES[Math.floor(Math.random() * VENUE_TYPES.length)];
    const availability = AVAILABILITY_STATUSES[Math.floor(Math.random() * AVAILABILITY_STATUSES.length)];
    const amenitiesCount = Math.floor(Math.random() * 6) + 3;
    const shuffledAmenities = [...AMENITIES_LIST].sort(() => 0.5 - Math.random());
    
    return {
      id: index + 1,
      name: [
        'Riyadh International Convention Center',
        'Jeddah Superdome Arena',
        'King Fahd Cultural Center',
        'NEOM Future Events Hub',
        'Al Ula Heritage Amphitheater',
        'Dammam Waterfront Pavilion',
        'Abha Mountain Resort Hall',
        'Madinah Grand Ballroom',
        'Khobar Corniche Open Air',
        'Taif Rose Garden Venue',
        'Jubail Industrial City Hall',
        'Najran Fortress Courtyard',
        'Hail Desert Camp Arena',
        'Yanbu Royal Marina Deck',
        'Qassim Agricultural Expo Ground',
        'Al Ahsa Oasis Theater',
        'Tabuk Winter Festival Space',
        'Sakaka Heritage Majlis',
      ][index] || `Premium Venue ${index + 1}`,
      description: `A stunning ${type.replace(/([A-Z])/g, ' $1').toLowerCase()} featuring world-class facilities, modern design, and exceptional service. Perfect for conferences, weddings, exhibitions, and cultural events. Located in a prime area with easy access and ample parking.`,
      type,
      location: `${Math.floor(Math.random() * 200) + 1} ${['King Fahd Road', 'Olaya Street', 'Corniche Ave', 'Prince Sultan Rd', 'Tahlia St'][Math.floor(Math.random() * 5)]}, ${['Riyadh', 'Jeddah', 'Dammam', 'Makkah', 'Madinah'][Math.floor(Math.random() * 5)]}`,
      capacity: [200, 500, 800, 1200, 2000, 3500, 5000, 10000][Math.floor(Math.random() * 8)],
      pricePerDay: Math.floor(Math.random() * 45000) + 5000,
      image: `https://plus.unsplash.com/premium_photo-1664530452329-42682d3a73a7?q=80&w=872&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`,
      amenities: shuffledAmenities.slice(0, amenitiesCount),
      availability,
      connectedVendors: generateConnectedVendors(index + 1),
      rating: (4 + Math.random()).toFixed(1),
      totalEvents: Math.floor(Math.random() * 120) + 10,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 365) * 86400000).toISOString(),
    };
  });
};

let mockVenues = generateMockVenues();
let nextId = 19;

export const venueService = {
  getAll: async (filters = {}) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    let filtered = [...mockVenues];

    if (filters.type && filters.type !== 'all') {
      filtered = filtered.filter(v => v.type === filters.type);
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter(v =>
        v.name.toLowerCase().includes(q) ||
        v.location.toLowerCase().includes(q) ||
        v.type.toLowerCase().includes(q)
      );
    }

    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockVenues.find(v => v.id === parseInt(id)) || null;
  },

  create: async (data) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const newVenue = {
      id: nextId++,
      ...data,
      connectedVendors: [],
      rating: '0.0',
      totalEvents: 0,
      availability: 'available',
      createdAt: new Date().toISOString(),
    };
    mockVenues.push(newVenue);
    return newVenue;
  },

  update: async (id, data) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const idx = mockVenues.findIndex(v => v.id === id);
    if (idx === -1) throw new Error('notFound');
    mockVenues[idx] = { ...mockVenues[idx], ...data };
    return mockVenues[idx];
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const idx = mockVenues.findIndex(v => v.id === id);
    if (idx === -1) throw new Error('notFound');
    mockVenues.splice(idx, 1);
    return true;
  },

  getTypes: () => VENUE_TYPES,
  getAmenities: () => AMENITIES_LIST,
};