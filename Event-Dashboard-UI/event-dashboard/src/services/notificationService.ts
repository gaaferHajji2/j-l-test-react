const generateMockHistory = () => {
  const recipients = ['agents', 'vendors', 'all'];
  const priorities = ['low', 'normal', 'high', 'urgent'];
  const subjects = [
    'Venue Inspection Schedule Update',
    'New Event Guidelines Released',
    'Monthly Compliance Reminder',
    'Emergency Protocol Changes',
    'Quarterly Review Meeting',
    'System Maintenance Notice',
    'Holiday Working Hours',
    'New Vendor Onboarding Process',
  ];

  return Array.from({ length: 15 }, (_, index) => {
    const sentDate = new Date();
    sentDate.setDate(sentDate.getDate() - Math.floor(Math.random() * 60));

    return {
      id: index + 1,
      subject: subjects[Math.floor(Math.random() * subjects.length)],
      message: `This is a sample notification message body for testing purposes. It contains important information that was sent to the selected recipients. Notification #${index + 1}.`,
      recipients: recipients[Math.floor(Math.random() * recipients.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      sentAt: sentDate.toISOString(),
      recipientCount: Math.floor(Math.random() * 50) + 5,
    };
  }).sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt));
};

let mockHistory = generateMockHistory();
let nextId = 16;

export const notificationService = {
  send: async (data) => {
    await new Promise(resolve => setTimeout(resolve, 800));

    const record = {
      id: nextId++,
      subject: data.subject.trim(),
      message: data.message.trim(),
      recipients: data.recipients,
      priority: data.priority || 'normal',
      sentAt: new Date().toISOString(),
      recipientCount: data.recipients === 'all' 
        ? Math.floor(Math.random() * 40) + 30 
        : Math.floor(Math.random() * 25) + 5,
    };

    mockHistory.unshift(record);
    return record;
  },

  getHistory: async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return [...mockHistory];
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const idx = mockHistory.findIndex(n => n.id === id);
    if (idx === -1) throw new Error('notFound');
    mockHistory.splice(idx, 1);
    return true;
  },
};