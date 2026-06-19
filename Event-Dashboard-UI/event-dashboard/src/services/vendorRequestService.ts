const VENDOR_TYPES = [
  'Catering', 'Photography', 'Decoration', 'Audio/Visual',
  'Security', 'Transportation', 'Printing', 'Entertainment',
  'Lighting', 'Stage Equipment', 'Tent Rental', 'Floral Design'
];

const generateMockRequests = () => {
  const statuses = ['pending', 'pending', 'pending', 'approved', 'approved', 'rejected'];

  return Array.from({ length: 25 }, (_, index) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const type = VENDOR_TYPES[Math.floor(Math.random() * VENDOR_TYPES.length)];
    const submittedDate = new Date();
    submittedDate.setDate(submittedDate.getDate() - Math.floor(Math.random() * 60));

    return {
      id: index + 1,
      businessName: `${type} Services ${String.fromCharCode(65 + (index % 26))}`,
      contactPerson: `Contact Person ${index + 1}`,
      email: `vendor${index + 1}@example.com`,
      phone: `+966 5${Math.floor(Math.random() * 10)} ${Math.floor(1000000 + Math.random() * 9000000)}`,
      type,
      description: `Professional ${type.toLowerCase()} services provider with over ${Math.floor(Math.random() * 10) + 1} years of experience. We offer comprehensive solutions for events of all sizes including setup, execution, and teardown.`,
      website: `www.vendor${index + 1}.com`,
      address: `Building ${Math.floor(Math.random() * 100) + 1}, Street ${Math.floor(Math.random() * 50) + 1}, Riyadh`,
      documentsCount: Math.floor(Math.random() * 5) + 1,
      status,
      rejectionReason: status === 'rejected' ? 'Incomplete documentation. Please resubmit with valid commercial registration and insurance certificates.' : null,
      submittedAt: submittedDate.toISOString(),
      reviewedAt: status !== 'pending' ? new Date(submittedDate.getTime() + 86400000 * Math.floor(Math.random() * 5)).toISOString() : null,
    };
  });
};

let mockRequests = generateMockRequests();

export const vendorRequestService = {
  getAll: async (filters = {}) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    let filtered = [...mockRequests];

    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(r => r.status === filters.status);
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter(r =>
        r.businessName.toLowerCase().includes(q) ||
        r.contactPerson.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q)
      );
    }

    if (filters.sortBy) {
      const { field, order } = filters.sortBy;
      filtered.sort((a, b) => {
        let cmp = 0;
        if (field === 'submittedAt') cmp = new Date(a.submittedAt) - new Date(b.submittedAt);
        else if (field === 'businessName') cmp = a.businessName.localeCompare(b.businessName);
        else if (field === 'type') cmp = a.type.localeCompare(b.type);
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