const generateMockVendors = () => {
  const statuses = ['pending', 'active', 'inactive', 'rejected'];
  const categories = ['Catering', 'Photography', 'Decoration', 'Audio/Visual', 'Venue', 'Transportation', 'Entertainment', 'Printing'];
  
  return Array.from({ length: 30 }, (_, index) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const submittedDate = new Date();
    submittedDate.setDate(submittedDate.getDate() - Math.floor(Math.random() * 60));
    
    return {
      id: index + 1,
      businessName: `${category} Services ${index + 1}`,
      contactPerson: `Contact Person ${index + 1}`,
      email: `vendor${index + 1}@example.com`,
      phone: `+966 5${Math.floor(Math.random() * 10)} ${Math.floor(1000000 + Math.random() * 9000000)}`,
      category,
      description: `Professional ${category.toLowerCase()} services provider with over ${Math.floor(Math.random() * 10) + 1} years of experience in the industry.`,
      website: `www.vendor${index + 1}.com`,
      address: `Building ${Math.floor(Math.random() * 100) + 1}, Street ${Math.floor(Math.random() * 50) + 1}, City ${String.fromCharCode(65 + Math.floor(Math.random() * 5))}`,
      documents: Math.floor(Math.random() * 5) + 1,
      status,
      submittedAt: submittedDate.toISOString(),
      reviewedAt: status !== 'pending' ? new Date(submittedDate.getTime() + 86400000 * Math.floor(Math.random() * 7)).toISOString() : null,
    };
  });
};

let mockVendors = generateMockVendors();

export const vendorService = {
  getAll: async (filters = {}) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filtered = [...mockVendors];
    
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(vendor => vendor.status === filters.status);
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(vendor =>
        vendor.businessName.toLowerCase().includes(searchLower) ||
        vendor.contactPerson.toLowerCase().includes(searchLower) ||
        vendor.email.toLowerCase().includes(searchLower) ||
        vendor.category.toLowerCase().includes(searchLower)
      );
    }
    
    if (filters.sortBy) {
      const { field, order } = filters.sortBy;
      filtered.sort((a, b) => {
        let comparison = 0;
        if (field === 'submittedAt') {
          comparison = new Date(a.submittedAt) - new Date(b.submittedAt);
        } else if (field === 'businessName') {
          comparison = a.businessName.localeCompare(b.businessName);
        } else if (field === 'status') {
          comparison = a.status.localeCompare(b.status);
        }
        return order === 'asc' ? comparison : -comparison;
      });
    }
    
    return filtered;
  },
  
  updateStatus: async (id, newStatus) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const vendorIndex = mockVendors.findIndex(v => v.id === id);
    if (vendorIndex !== -1) {
      mockVendors[vendorIndex] = {
        ...mockVendors[vendorIndex],
        status: newStatus,
        reviewedAt: new Date().toISOString(),
      };
      return mockVendors[vendorIndex];
    }
    throw new Error('Vendor not found');
  },
};