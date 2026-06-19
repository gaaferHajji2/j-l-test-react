const VENUE_TYPES = [
  'Convention Center', 'Hotel Ballroom', 'Outdoor Space', 'Theater',
  'Gallery', 'Stadium', 'Rooftop Venue', 'Heritage Site',
  'Conference Hall', 'Banquet Hall', 'Open Air Arena', 'Private Estate'
];

const CITIES = [
  'Al-Sham', 'Masaken Barzah', 'Barzah', 'Beirut Street', 'Damascus',
  'Rif Damascus', 'Lattakia', 'Tartouse', 'Al-Baramkah', 'Al-Mazzah'
];

const generateMockRequests = () => {
  const statuses = ['pending', 'pending', 'pending', 'approved', 'approved', 'rejected'];

  return Array.from({ length: 24 }, (_, index) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const venueType = VENUE_TYPES[Math.floor(Math.random() * VENUE_TYPES.length)];
    const city = CITIES[Math.floor(Math.random() * CITIES.length)];
    const submittedDate = new Date();
    submittedDate.setDate(submittedDate.getDate() - Math.floor(Math.random() * 60));

    return {
      id: index + 1,
      ownerName: `Owner ${String.fromCharCode(65 + (index % 26))} Al-${['Rashid', 'Saud', 'Farsi', 'Mansour', 'Qahtani', 'Otaibi'][index % 6]}`,
      venueName: `${city} ${venueType} ${index + 1}`,
      email: `venue.owner${index + 1}@example.com`,
      phone: `+966 5${Math.floor(Math.random() * 10)} ${Math.floor(1000000 + Math.random() * 9000000)}`,
      city,
      venueType,
      capacity: [200, 500, 800, 1200, 2000, 3500, 5000][Math.floor(Math.random() * 7)],
      description: `Premium ${venueType.toLowerCase()} located in the heart of ${city}. Features state-of-the-art facilities, ample parking, and professional on-site management team. Suitable for conferences, weddings, exhibitions, and cultural events.`,
      address: `Building ${Math.floor(Math.random() * 200) + 1}, King Fahd Road, ${city}`,
      documentsCount: Math.floor(Math.random() * 6) + 1,
      status,
      rejectionReason: status === 'rejected'
        ? 'Property ownership documents are incomplete. Please provide valid title deed and municipality approval certificate before resubmission.'
        : null,
      submittedAt: submittedDate.toISOString(),
      reviewedAt: status !== 'pending'
        ? new Date(submittedDate.getTime() + 86400000 * Math.floor(Math.random() * 5)).toISOString()
        : null,
    };
  });
};

let mockRequests = generateMockRequests();

export const venueOwnerRequestService = {
  getAll: async (filters = {}) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    let filtered = [...mockRequests];

    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(r => r.status === filters.status);
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter(r =>
        r.ownerName.toLowerCase().includes(q) ||
        r.venueName.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.city.toLowerCase().includes(q) ||
        r.venueType.toLowerCase().includes(q)
      );
    }

    if (filters.sortBy) {
      const { field, order } = filters.sortBy;
      filtered.sort((a, b) => {
        let cmp = 0;
        if (field === 'submittedAt') cmp = new Date(a.submittedAt) - new Date(b.submittedAt);
        else if (field === 'ownerName') cmp = a.ownerName.localeCompare(b.ownerName);
        else if (field === 'venueName') cmp = a.venueName.localeCompare(b.venueName);
        else if (field === 'city') cmp = a.city.localeCompare(b.city);
        return order === 'asc' ? cmp : -cmp;
      });
    }

    return filtered;
  },

  updateStatus: async (id, newStatus, reason = null) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const idx = mockRequests.findIndex(r => r.id === id);
    if (idx === -1) throw new Error('notFound');
    mockRequests[idx] = {
      ...mockRequests[idx],
      status: newStatus,
      rejectionReason: newStatus === 'rejected' ? reason : null,
      reviewedAt: new Date().toISOString(),
    };
    return mockRequests[idx];
  },
};