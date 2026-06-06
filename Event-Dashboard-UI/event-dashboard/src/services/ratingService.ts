const CUSTOMER_NAMES = [
  'Ahmed Al-Rashid', 'Sarah Johnson', 'Mohammed Al-Farsi', 'Emily Chen',
  'Khalid Ibrahim', 'Fatima Hassan', 'James Wilson', 'Noura Al-Saud',
  'Omar Bakri', 'Layla Mahmoud', 'David Park', 'Reem Al-Qahtani',
  'Yusuf Demir', 'Aisha Williams', 'Tariq Al-Mansour', 'Sophie Martin',
  'Hassan Al-Zahrani', 'Maria Garcia', 'Faisal Al-Otaibi', 'Anna Kowalski',
];

const EVENT_NAMES = [
  'Tech Conference 2026', 'Music Festival Summer', 'Art Exhibition Opening',
  'Food & Culture Fair', 'Startup Summit', 'Wedding Expo',
  'Sports Tournament Finals', 'Charity Gala Dinner', 'Book Launch Event',
  'Fashion Week Showcase', 'Health & Wellness Retreat', 'Gaming Convention',
];

const REVIEW_TEMPLATES = {
  5: [
    "Absolutely outstanding event! Every detail was perfectly organized. The venue was stunning and the staff went above and beyond.",
    "Best event I've attended this year. Seamless registration, amazing speakers, and incredible networking opportunities.",
    "Exceeded all expectations. The atmosphere was electric and everything ran like clockwork. Highly recommend!",
  ],
  4: [
    "Really enjoyed the event overall. Great organization with only minor hiccups. Would definitely attend again.",
    "Very well put together. The content was relevant and engaging. Only wish there was more time for Q&A sessions.",
    "Solid experience from start to finish. Good venue choice and professional staff. A few small improvements needed.",
  ],
  3: [
    "Decent event but nothing extraordinary. Some sessions were great while others felt rushed. Average organization.",
    "It was okay. Met basic expectations but didn't wow me. Parking was an issue and the food options were limited.",
    "Mixed feelings about this one. Good concept but execution could be better. Hope they improve next time.",
  ],
  2: [
    "Disappointed with the overall experience. Long wait times at registration and several sessions started late.",
    "Below average organization. Sound issues during presentations and inadequate seating. Needs significant improvement.",
    "Not what I expected based on the promotion. Felt overcrowded and poorly managed. Won't be returning.",
  ],
  1: [
    "Terrible experience. Complete disorganization from arrival to departure. Waste of time and money.",
    "Extremely disappointing. Keynote speaker cancelled last minute with no communication. Venue was uncomfortable.",
    "Worst event I've ever attended. Nothing went according to schedule. Staff seemed unprepared and unhelpful.",
  ],
};

const generateMockRatings = () => {
  return Array.from({ length: 40 }, (_, index) => {
    const score = Math.random() < 0.35 ? 5 : Math.random() < 0.55 ? 4 : Math.random() < 0.75 ? 3 : Math.random() < 0.9 ? 2 : 1;
    const templates = REVIEW_TEMPLATES[score];
    const submittedDate = new Date();
    submittedDate.setDate(submittedDate.getDate() - Math.floor(Math.random() * 90));
    const hasResponse = Math.random() > 0.7;

    return {
      id: index + 1,
      eventId: Math.floor(Math.random() * 12) + 1,
      eventName: EVENT_NAMES[Math.floor(Math.random() * EVENT_NAMES.length)],
      customerId: Math.floor(Math.random() * 20) + 1,
      customerName: CUSTOMER_NAMES[Math.floor(Math.random() * CUSTOMER_NAMES.length)],
      customerAvatar: null,
      score,
      description: templates[Math.floor(Math.random() * templates.length)],
      isVerified: Math.random() > 0.2,
      helpfulCount: Math.floor(Math.random() * 30),
      isFlagged: Math.random() > 0.9,
      adminResponse: hasResponse ? "Thank you for your valuable feedback. We appreciate your input and will use it to improve future events." : null,
      respondedAt: hasResponse ? new Date(submittedDate.getTime() + 86400000).toISOString() : null,
      submittedAt: submittedDate.toISOString(),
    };
  }).sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
};

let mockRatings = generateMockRatings();

export const ratingService = {
  getAll: async (filters = {}) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    let filtered = [...mockRatings];

    if (filters.score && filters.score !== 'all') {
      filtered = filtered.filter(r => r.score === Number(filters.score));
    }

    if (filters.eventId && filters.eventId !== 'all') {
      filtered = filtered.filter(r => r.eventId === Number(filters.eventId));
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter(r =>
        r.eventName.toLowerCase().includes(q) ||
        r.customerName.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q)
      );
    }

    return filtered;
  },

  getStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const total = mockRatings.length;
    const avg = total > 0 ? (mockRatings.reduce((sum, r) => sum + r.score, 0) / total).toFixed(1) : '0.0';
    const distribution = [5, 4, 3, 2, 1].map(score => ({
      score,
      count: mockRatings.filter(r => r.score === score).length,
      percentage: total > 0 ? Math.round((mockRatings.filter(r => r.score === score).length / total) * 100) : 0,
    }));

    return { total, average: avg, distribution };
  },

  getUniqueEvents: async () => {
    const eventsMap = new Map();
    mockRatings.forEach(r => {
      if (!eventsMap.has(r.eventId)) {
        eventsMap.set(r.eventId, { id: r.eventId, name: r.eventName });
      }
    });
    return Array.from(eventsMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  },

  respond: async (ratingId, response) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const idx = mockRatings.findIndex(r => r.id === ratingId);
    if (idx === -1) throw new Error('notFound');
    mockRatings[idx] = {
      ...mockRatings[idx],
      adminResponse: response.trim(),
      respondedAt: new Date().toISOString(),
    };
    return mockRatings[idx];
  },

  flag: async (ratingId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const idx = mockRatings.findIndex(r => r.id === ratingId);
    if (idx === -1) throw new Error('notFound');
    mockRatings[idx] = { ...mockRatings[idx], isFlagged: true };
    return mockRatings[idx];
  },

  delete: async (ratingId) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const idx = mockRatings.findIndex(r => r.id === ratingId);
    if (idx === -1) throw new Error('notFound');
    mockRatings.splice(idx, 1);
    return true;
  },
};