// Lightweight service for header notification badge/dropdown
// Separate from the full notificationService to keep header performant

const generateHeaderNotifications = () => {
  const types = [
    { icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9', color: 'blue' },
    { icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: 'green' },
    { icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z', color: 'amber' },
    { icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', color: 'purple' },
    { icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: 'emerald' },
  ];

  const messages = [
    'New vendor request from "Al-Damashkey Catering" pending review',
    'Event "Tech Conference 2026" has been approved',
    'Product "LED Uplight Package" was rejected — missing certification',
    'Vendor "Ahmed Al-Farsi" submitted a new venue inspection report',
    'Payment of 12,500 SYR received for "Summer Music Festival"',
    'New rating (★5) received for "Art Exhibition Opening"',
    'Venue "Damascus Convention Center" availability updated',
    '3 new product submissions awaiting approval',
  ];

  return Array.from({ length: 8 }, (_, i) => {
    const type = types[i % types.length];
    const date = new Date();
    date.setMinutes(date.getMinutes() - i * 45 - Math.floor(Math.random() * 30));

    return {
      id: i + 1,
      message: messages[i % messages.length],
      icon: type.icon,
      color: type.color,
      isRead: i > 3,
      createdAt: date.toISOString(),
    };
  });
};

let mockNotifications = generateHeaderNotifications();

export const headerNotificationService = {
  getRecent: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...mockNotifications].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  getUnreadCount: async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockNotifications.filter(n => !n.isRead).length;
  },

  markAllAsRead: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    mockNotifications = mockNotifications.map(n => ({ ...n, isRead: true }));
    return true;
  },

  markAsRead: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 150));
    const idx = mockNotifications.findIndex(n => n.id === id);
    if (idx !== -1) mockNotifications[idx] = { ...mockNotifications[idx], isRead: true };
    return true;
  },
};