import { ServiceCategory } from '../models/ServiceCategory';

const BASE_URL = 'https://eventak.abukm.com/api';
const AUTH_TOKEN = '15|9PYfYdFWh9rFuluRPW0Uxx4YvXPlGCXv50SIXyoU9c0cce61';

// ─── Dummy Data (Fallback) ───────────────────────────────────────────────────
const generateDummyCategories = () => [
  new ServiceCategory({ id: 1, name: 'تنسيق قاعات', description: 'تزيين وطاولات وإضاءة' }),
  new ServiceCategory({ id: 2, name: 'تصوير فوتوغرافي', description: 'تصوير احترافي وفيديو للفعاليات' }),
  new ServiceCategory({ id: 3, name: 'خدمات تموين', description: 'وجبات وبوفيهات ومشروبات' }),
  new ServiceCategory({ id: 4, name: 'ديكور وزهور', description: 'تنسيقات زهور طبيعية وصناعية' }),
  new ServiceCategory({ id: 5, name: 'صوت وإضاءة', description: 'أنظمة صوتية وإضاءة مسرحية' }),
  new ServiceCategory({ id: 6, name: 'نقل ومواصلات', description: 'خدمات نقل الضيوف والباصات' }),
  new ServiceCategory({ id: 7, name: 'حراسة أمنية', description: 'فريق حراسة وتنظيم دخول' }),
  new ServiceCategory({ id: 8, name: 'طباعة ومطبوعات', description: 'دعوات وبطاقات ولافتات' }),
];

let dummyCategories = generateDummyCategories();
let nextDummyId = 9;

// ─── Fetch Helper ────────────────────────────────────────────────────────────
const getHeaders = () => ({
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${AUTH_TOKEN}`,
});

// ─── Service ──────────────────────────────────────────────────────────────────
export const serviceCategoryService = {
  /**
   * GET /admin/service-categories
   */
  getAll: async () => {
    try {
      const response = await fetch(`${BASE_URL}/admin/service-categories`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const json = await response.json();
      if (json?.status !== 'success') throw new Error(json?.message || 'Non-success response');

      return ServiceCategory.fromApiResponse(json);
    } catch (error) {
      console.warn('API fetch failed, using dummy categories:', error.message);
      return [...dummyCategories];
    }
  },

  /**
   * POST /admin/service-categories
   */
  create: async (data) => {
    try {
      const response = await fetch(`${BASE_URL}/admin/service-categories`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ name: data.name.trim(), description: data.description?.trim() || '' }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const json = await response.json();
      return ServiceCategory.fromApi(json?.data ?? json?.category ?? json);
    } catch (error) {
      console.warn('API create failed, adding to dummy data:', error.message);
      const newCat = new ServiceCategory({
        id: nextDummyId++,
        name: data.name.trim(),
        description: data.description?.trim() || '',
      });
      dummyCategories.push(newCat);
      return newCat;
    }
  },

  /**
   * PUT /admin/service-categories/{id}
   */
  update: async (id, data) => {
    try {
      const response = await fetch(`${BASE_URL}/admin/service-categories/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ name: data.name.trim(), description: data.description?.trim() || '' }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const json = await response.json();
      return ServiceCategory.fromApi(json?.data ?? json?.category ?? json);
    } catch (error) {
      console.warn('API update failed, updating dummy data:', error.message);
      const idx = dummyCategories.findIndex(c => c.id === id);
      if (idx === -1) throw new Error('notFound');
      dummyCategories[idx] = new ServiceCategory({
        ...dummyCategories[idx],
        name: data.name.trim(),
        description: data.description?.trim() || '',
      });
      return dummyCategories[idx];
    }
  },

  /**
   * DELETE /admin/service-categories/{id}
   */
  delete: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/admin/service-categories/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      return true;
    } catch (error) {
      console.warn('API delete failed, removing from dummy data:', error.message);
      const idx = dummyCategories.findIndex(c => c.id === id);
      if (idx === -1) throw new Error('notFound');
      dummyCategories.splice(idx, 1);
      return true;
    }
  },
};