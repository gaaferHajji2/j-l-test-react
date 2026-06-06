const VENUE_OPTIONS = [
  'Riyadh International Convention Center',
  'Jeddah Superdome',
  'King Fahd Cultural Center',
  'Dammam Exhibition Center',
  'Madinah Al Munawrah Hall',
  'Abha Palace Hotel',
  'NEOM Event Space',
  'Al Ula Heritage Venue',
];

const ROLE_OPTIONS = [
  'Venue Manager',
  'Site Inspector',
  'Event Coordinator',
  'Safety Officer',
  'Technical Supervisor',
  'Guest Relations',
  'Logistics Coordinator',
];

const generateMockAgents = () => {
  const statuses = ['active', 'active', 'active', 'inactive', 'onLeave'];
  
  return Array.from({ length: 20 }, (_, index) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const venue = VENUE_OPTIONS[Math.floor(Math.random() * VENUE_OPTIONS.length)];
    const role = ROLE_OPTIONS[Math.floor(Math.random() * ROLE_OPTIONS.length)];
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 180));

    return {
      id: index + 1,
      fullName: `Agent ${String.fromCharCode(65 + (index % 26))} ${Math.floor(index / 26) + 1}`,
      email: `agent${index + 1}@venue-sa.com`,
      phone: `+966 5${Math.floor(Math.random() * 10)} ${Math.floor(1000000 + Math.random() * 9000000)}`,
      venue,
      role,
      notes: Math.random() > 0.4 ? `Responsible for ${role.toLowerCase()} duties at ${venue}. Available weekdays 8AM-5PM.` : '',
      status,
      visitsCount: Math.floor(Math.random() * 50) + 5,
      lastVisit: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000).toISOString(),
      createdAt: createdAt.toISOString(),
    };
  });
};

let mockAgents = generateMockAgents();
let nextId = 21;

export const agentService = {
  getAll: async (filters = {}) => {
    await new Promise(resolve => setTimeout(resolve, 400));

    let filtered = [...mockAgents];

    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(a => a.status === filters.status);
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter(a =>
        a.fullName.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.venue.toLowerCase().includes(q) ||
        a.role.toLowerCase().includes(q)
      );
    }

    if (filters.sortBy) {
      const { field, order } = filters.sortBy;
      filtered.sort((a, b) => {
        let cmp = 0;
        if (field === 'fullName') cmp = a.fullName.localeCompare(b.fullName);
        else if (field === 'venue') cmp = a.venue.localeCompare(b.venue);
        else if (field === 'createdAt') cmp = new Date(a.createdAt) - new Date(b.createdAt);
        else if (field === 'lastVisit') cmp = new Date(a.lastVisit) - new Date(b.lastVisit);
        return order === 'asc' ? cmp : -cmp;
      });
    }

    return filtered;
  },

  create: async (data) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const newAgent = {
      id: nextId++,
      fullName: data.fullName.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      venue: data.venue.trim(),
      role: data.role.trim(),
      notes: data.notes?.trim() || '',
      status: data.status || 'active',
      visitsCount: 0,
      lastVisit: null,
      createdAt: new Date().toISOString(),
    };

    mockAgents.push(newAgent);
    return newAgent;
  },

  update: async (id, data) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const idx = mockAgents.findIndex(a => a.id === id);
    if (idx === -1) throw new Error('notFound');

    mockAgents[idx] = {
      ...mockAgents[idx],
      fullName: data.fullName.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      venue: data.venue.trim(),
      role: data.role.trim(),
      notes: data.notes?.trim() || '',
      status: data.status || mockAgents[idx].status,
    };

    return mockAgents[idx];
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const idx = mockAgents.findIndex(a => a.id === id);
    if (idx === -1) throw new Error('notFound');
    mockAgents.splice(idx, 1);
    return true;
  },

  getVenueOptions: () => VENUE_OPTIONS,
  getRoleOptions: () => ROLE_OPTIONS,
};