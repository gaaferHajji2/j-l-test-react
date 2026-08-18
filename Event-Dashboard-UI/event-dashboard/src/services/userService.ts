import { User } from '../models/User';

const BASE_URL = 'http://127.0.0.1:8000/api';
const AUTH_TOKEN = '1|TsGcZ0VIZedIMIP2cTZrs8t5nf0azvAcMs4xO9Z2d8f868e0';

// ─── Dummy Data (Fallback) ───────────────────────────────────────────────────
const ROLES = ['customer', 'vendor', 'admin', 'venue_owner'];

const generateDummyUsers = () => {
  return Array.from({ length: 20 }, (_, index) => {
    const role = ROLES[Math.floor(Math.random() * ROLES.length)];
    const createdDate = new Date();
    createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 180));

    return new User({
      id: index + 1,
      name: `User ${String.fromCharCode(65 + (index % 26))} ${['Al-Rashid', 'Johnson', 'Al-Farsi', 'Chen', 'Ibrahim', 'Hassan', 'Wilson', 'Al-Saud', 'Bakri', 'Mahmoud'][index % 10]}`,
      email: `user${index + 1}@example.com`,
      avatar: null,
      phone: `+966 5${Math.floor(Math.random() * 10)} ${Math.floor(1000000 + Math.random() * 9000000)}`,
      email_verified_at: Math.random() > 0.3 ? createdDate.toISOString() : null,
      role,
      vendor_category_id: role === 'vendor' ? Math.floor(Math.random() * 12) + 1 : null,
      created_at: createdDate.toISOString(),
      updated_at: createdDate.toISOString(),
    });
  });
};

let dummyUsers = generateDummyUsers();

// ─── Fetch Helper ────────────────────────────────────────────────────────────
const getHeaders = () => ({
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${AUTH_TOKEN}`,
});

// ─── Service ──────────────────────────────────────────────────────────────────
export const userService = {
  /**
   * Fetch all users via native fetch.
   * GET /admin/users
   * Falls back to dummy data on any error.
   */
  getAll: async (filters = {}) => {
    let users = [];

    try {
      const response = await fetch(`${BASE_URL}/admin/users`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const json = await response.json();

      if (json?.status !== 'success') {
        throw new Error(json?.message || 'API returned non-success status');
      }

      users = User.fromApiResponse(json);
    } catch (error) {
      console.warn('API fetch failed, using dummy users:', error.message);
      users = [...dummyUsers];
    }

    // Client-side filters
    if (filters.role && filters.role !== 'all') {
      users = users.filter(u => u.role === filters.role);
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      users = users.filter(u =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.includes(q)
      );
    }

    if (filters.sortBy) {
      const { field, order } = filters.sortBy;
      users.sort((a, b) => {
        let cmp = 0;
        if (field === 'name') cmp = a.name.localeCompare(b.name);
        else if (field === 'created_at') cmp = new Date(a.createdAt) - new Date(b.createdAt);
        else if (field === 'role') cmp = a.role.localeCompare(b.role);
        return order === 'asc' ? cmp : -cmp;
      });
    }

    return users;
  },

  /** Get unique roles for filter dropdown */
  getRoles: () => ROLES,
};