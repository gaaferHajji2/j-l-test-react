const PRESET_COLORS = [
  '#3B82F6', // blue
  '#10B981', // green
  '#F59E0B', // yellow
  '#EF4444', // red
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#06B6D4', // cyan
  '#F97316', // orange
];

const initialTypes = [
  { id: 1, name: 'Conference', description: 'Large professional gatherings and summits', color: '#3B82F6', eventsCount: 12, createdAt: '2026-01-15T10:00:00Z' },
  { id: 2, name: 'Workshop', description: 'Hands-on learning sessions', color: '#10B981', eventsCount: 8, createdAt: '2026-02-01T14:30:00Z' },
  { id: 3, name: 'Festival', description: 'Cultural and entertainment festivals', color: '#F59E0B', eventsCount: 5, createdAt: '2026-02-20T09:00:00Z' },
  { id: 4, name: 'Seminar', description: 'Educational presentations and lectures', color: '#8B5CF6', eventsCount: 15, createdAt: '2026-03-10T11:00:00Z' },
  { id: 5, name: 'Exhibition', description: 'Product and art exhibitions', color: '#EC4899', eventsCount: 3, createdAt: '2026-04-05T16:00:00Z' },
];

let mockEventTypes = [...initialTypes];
let nextId = 6;

export const eventTypeService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return [...mockEventTypes].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  create: async (data) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const duplicate = mockEventTypes.find(
      t => t.name.toLowerCase() === data.name.trim().toLowerCase()
    );
    if (duplicate) throw new Error('duplicateName');

    const newType = {
      id: nextId++,
      name: data.name.trim(),
      description: data.description?.trim() || '',
      color: data.color || PRESET_COLORS[0],
      eventsCount: 0,
      createdAt: new Date().toISOString(),
    };

    mockEventTypes.push(newType);
    return newType;
  },

  update: async (id, data) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const index = mockEventTypes.findIndex(t => t.id === id);
    if (index === -1) throw new Error('notFound');

    const duplicate = mockEventTypes.find(
      t => t.id !== id && t.name.toLowerCase() === data.name.trim().toLowerCase()
    );
    if (duplicate) throw new Error('duplicateName');

    mockEventTypes[index] = {
      ...mockEventTypes[index],
      name: data.name.trim(),
      description: data.description?.trim() || '',
      color: data.color || mockEventTypes[index].color,
    };

    return mockEventTypes[index];
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = mockEventTypes.findIndex(t => t.id === id);
    if (index === -1) throw new Error('notFound');
    mockEventTypes.splice(index, 1);
    return true;
  },

  getPresetColors: () => PRESET_COLORS,
};