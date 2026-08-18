import { VendorRequest } from '../models/VendorRequest';

const BASE_URL = 'http://127.0.0.1:8000/api';
const AUTH_TOKEN = '1|TsGcZ0VIZedIMIP2cTZrs8t5nf0azvAcMs4xO9Z2d8f868e0';

// ─── Dummy Data (Fallback) ───────────────────────────────────────────────────
const SERVICE_NAMES = [
  'تنسيق كوشة ملكي', 'تصوير احترافي كامل', 'ديكور قاعة فاخر',
  'نظام صوت وإضاءة', 'فريق حراسة أمنية', 'خدمة نقل ضيوف',
  'تنسيق زهور طبيعي', 'إضاءة مسرح LED', 'DJ ونظام صوتي',
  'خيمة خارجية مكيفة', 'طباعة دعوات وبطاقات', 'فرقة موسيقية حية',
];

const generateDummyRequests = () => {
  const statuses = ['pending', 'pending', 'pending', 'approved', 'approved', 'rejected'];

  return Array.from({ length: 25 }, (_, index) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const serviceName = SERVICE_NAMES[index % SERVICE_NAMES.length];
    const submittedDate = new Date();
    submittedDate.setDate(submittedDate.getDate() - Math.floor(Math.random() * 60));

    return new VendorRequest({
      id: index + 1,
      vendor_id: Math.floor(Math.random() * 10) + 1,
      category_id: Math.floor(Math.random() * 12) + 1,
      name: serviceName,
      description: `خدمة ${serviceName} متكاملة تشمل التجهيز والتنفيذ والتفكيك. مناسبة للفعاليات حتى ${Math.floor(Math.random() * 400) + 100} ضيف.`,
      price: String(Math.floor(Math.random() * 15000) + 1000) + '.00',
      images: [],
      status,
      rejection_reason: status === 'rejected'
        ? 'المستندات المقدمة غير مكتملة. يرجى إعادة التقديم مع إرفاق السجل التجاري وشهادة التأمين.'
        : null,
      created_at: submittedDate.toISOString(),
      updated_at: status !== 'pending'
        ? new Date(submittedDate.getTime() + 86400000 * Math.floor(Math.random() * 5)).toISOString()
        : submittedDate.toISOString(),
      vendor: {
        id: Math.floor(Math.random() * 10) + 1,
        name: `مورد ${String.fromCharCode(1571 + (index % 10))}`,
        email: `vendor${index + 1}@example.com`,
        avatar: null,
        phone: `+966 5${Math.floor(Math.random() * 10)} ${Math.floor(1000000 + Math.random() * 9000000)}`,
        role: 'vendor',
        email_verified_at: Math.random() > 0.3 ? submittedDate.toISOString() : null,
        created_at: submittedDate.toISOString(),
      },
    });
  });
};

let dummyRequests = generateDummyRequests();

// ─── Fetch Helper ────────────────────────────────────────────────────────────
const getHeaders = () => ({
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${AUTH_TOKEN}`,
});

// ─── Service ──────────────────────────────────────────────────────────────────
export const vendorRequestService = {
  /**
   * Fetch all service requests.
   * GET /admin/services/requests
   */
  getAll: async (filters = {}) => {
    let requests = [];

    try {
      const response = await fetch(`${BASE_URL}/admin/services/requests`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const json = await response.json();
      if (json?.status !== 'success') throw new Error(json?.message || 'Non-success response');

      requests = VendorRequest.fromApiResponse(json);
    } catch (error) {
      console.warn('API fetch failed, using dummy data:', error.message);
      requests = [...dummyRequests];
    }

    // Client-side filters
    if (filters.status && filters.status !== 'all') {
      requests = requests.filter(r => r.status === filters.status);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      requests = requests.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.vendorDisplayName.toLowerCase().includes(q) ||
        r.vendorEmail.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q)
      );
    }
    if (filters.sortBy) {
      const { field, order } = filters.sortBy;
      requests.sort((a, b) => {
        let cmp = 0;
        if (field === 'created_at') cmp = new Date(a.createdAt) - new Date(b.createdAt);
        else if (field === 'name') cmp = a.name.localeCompare(b.name);
        else if (field === 'price') cmp = a.priceAsNumber - b.priceAsNumber;
        return order === 'asc' ? cmp : -cmp;
      });
    }

    return requests;
  },

  /**
   * Approve a service request.
   * POST /admin/services/{id}/approve
   */
  approve: async (requestId) => {
    try {
      const response = await fetch(`${BASE_URL}/admin/services/${requestId}/approve`, {
        method: 'PUT',
        headers: getHeaders(),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const json = await response.json();
      return VendorRequest.fromApi(json?.data ?? json);
    } catch (error) {
      console.warn('API approve failed, updating dummy data:', error.message);
      const idx = dummyRequests.findIndex(r => r.id === requestId);
      if (idx === -1) throw new Error('notFound');
      dummyRequests[idx] = new VendorRequest({
        ...dummyRequests[idx],
        status: 'approved',
        rejection_reason: null,
        updated_at: new Date().toISOString(),
      });
      return dummyRequests[idx];
    }
  },

  /**
   * Reject a service request with reason.
   * POST /admin/services/{id}/reject
   */
  reject: async (requestId, reason) => {
    try {
      const response = await fetch(`${BASE_URL}/admin/services/${requestId}/reject`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ rejection_reason: reason }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const json = await response.json();
      return VendorRequest.fromApi(json?.data ?? json);
    } catch (error) {
      console.warn('API reject failed, updating dummy data:', error.message);
      const idx = dummyRequests.findIndex(r => r.id === requestId);
      if (idx === -1) throw new Error('notFound');
      dummyRequests[idx] = new VendorRequest({
        ...dummyRequests[idx],
        status: 'rejected',
        rejection_reason: reason,
        updated_at: new Date().toISOString(),
      });
      return dummyRequests[idx];
    }
  },
};