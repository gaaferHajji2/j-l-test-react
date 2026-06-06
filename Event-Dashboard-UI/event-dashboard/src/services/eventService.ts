// Mock data generator
const generateMockEvents = () => {
  const statuses = ['pending', 'approved', 'rejected'];
  const categories = ['Conference', 'Workshop', 'Seminar', 'Festival', 'Exhibition', 'Concert'];
  
  return Array.from({ length: 25 }, (_, index) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const date = new Date();
    date.setDate(date.getDate() + Math.floor(Math.random() * 90) - 30);
    
    return {
      id: index + 1,
      name: `${category} ${index + 1}`,
      description: `This is a sample ${category.toLowerCase()} event with detailed information about the program and schedule.`,
      category,
      date: date.toISOString().split('T')[0],
      location: `Venue ${Math.floor(Math.random() * 10) + 1}, City ${String.fromCharCode(65 + Math.floor(Math.random() * 5))}`,
      organizer: `Organizer ${Math.floor(Math.random() * 20) + 1}`,
      attendees: Math.floor(Math.random() * 500) + 50,
      status,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 180) * 24 * 60 * 60 * 1000).toISOString(),
    };
  });
};

let mockEvents = generateMockEvents();

export const eventService = {
  getAll: async (filters = {}) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filtered = [...mockEvents];
    
    // Apply filters
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(event => event.status === filters.status);
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(event =>
        event.name.toLowerCase().includes(searchLower) ||
        event.description.toLowerCase().includes(searchLower) ||
        event.organizer.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply sorting
    if (filters.sortBy) {
      const { field, order } = filters.sortBy;
      filtered.sort((a, b) => {
        let comparison = 0;
        if (field === 'date') {
          comparison = new Date(a.date) - new Date(b.date);
        } else if (field === 'name') {
          comparison = a.name.localeCompare(b.name);
        } else if (field === 'status') {
          comparison = a.status.localeCompare(b.status);
        }
        return order === 'asc' ? comparison : -comparison;
      });
    }
    
    return filtered;
  },
  
  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockEvents.find(event => event.id === parseInt(id));
  },
  
  updateStatus: async (id, newStatus) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const eventIndex = mockEvents.findIndex(e => e.id === id);
    if (eventIndex !== -1) {
      mockEvents[eventIndex] = {
        ...mockEvents[eventIndex],
        status: newStatus,
      };
      return mockEvents[eventIndex];
    }
    throw new Error('Event not found');
  },
};