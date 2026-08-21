import { Rating, VenueRatingStats } from '../models/Rating';

const BASE_URL = 'https://eventak.abukm.com/api';
const VENUE_IDS = Array.from({ length: 10 }, (_, i) => i + 1);

// ─── Dummy Data (Fallback) ───────────────────────────────────────────────────
const CUSTOMER_NAMES = [
  'Ahmed Al-Rashid', 'SYRah Johnson', 'Mohammed Al-Farsi', 'Emily Chen',
  'Khalid Ibrahim', 'Fatima Hassan', 'James Wilson', 'Noura Al-Saud',
  'Omar Bakri', 'Layla Mahmoud', 'David Park', 'Reem Al-Qahtani',
  'Yusuf Demir', 'Aisha Williams', 'Tariq Al-Mansour', 'Sophie Martin',
  'Hassan Al-Zahrani', 'Maria Garcia', 'Faisal Al-Otaibi', 'Anna Kowalski',
];

const REVIEW_TEMPLATES = {
  5: [
    "خدمة ممتازة، كل التفاصيل كانت منظمة بشكل رائع",
    "أفضل فعالية حضرتها هذا العام، تنظيم احترافي",
    "تجاوزت كل التوقعات، الأجواء كانت مميزة",
  ],
  4: [
    "فعالية جيدة جداً مع بعض الملاحظات البسيطة",
    "تنظيم جيد والمحتوى كان مفيداً",
    "تجربة إيجابية بشكل عام، أنصح بالحضور",
  ],
  3: [
    "فعالية عادية، لم تكن مميزة",
    "متوسط من حيث التنظيم والمحتوى",
    "تجربة مقبولة لكن تحتاج تحسين",
  ],
  2: [
    "تنظيم ضعيف وتأخير في البداية",
    "لم تكن كما توقعت، خدمات محدودة",
    "تحتاج تحسينات كبيرة في المستقبل",
  ],
  1: [
    "تجربة سيئة، عدم تنظيم واضح",
    "ضياع وقت ومال، لن أكرر التجربة",
    "أسوأ فعالية حضرتها، لا أنصح بها",
  ],
};

const generateDummyRatings = () => {
  const ratings = [];
  let idCounter = 1;

  VENUE_IDS.forEach(venueId => {
    const count = Math.floor(Math.random() * 8) + 3;
    for (let i = 0; i < count; i++) {
      const score = Math.random() < 0.35 ? 5 : Math.random() < 0.55 ? 4 : Math.random() < 0.75 ? 3 : Math.random() < 0.9 ? 2 : 1;
      const templates = REVIEW_TEMPLATES[score];
      const submittedDate = new Date();
      submittedDate.setDate(submittedDate.getDate() - Math.floor(Math.random() * 90));

      ratings.push(new Rating({
        rating: score,
        comment: templates[Math.floor(Math.random() * templates.length)],
        customer_name: CUSTOMER_NAMES[Math.floor(Math.random() * CUSTOMER_NAMES.length)],
        created_at: submittedDate.toISOString(),
      }, venueId));
    }
  });

  return ratings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

let dummyRatings = generateDummyRatings();

// ─── Fetch Helper ────────────────────────────────────────────────────────────
const getAuthHeaders = () => {
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };
  const token = localStorage.getItem('authToken');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

/**
 * Fetch ratings for a single venue using native fetch.
 * Returns { stats, ratings } or null on failure.
 */
const fetchVenueRatings = async (venueId) => {
  try {
    const response = await fetch(`${BASE_URL}/venues/${venueId}/ratings`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) return null;

    const json = await response.json().catch(() => null);
    if (!json || json.status !== 'success' || !json.data) return null;

    const stats = new VenueRatingStats(json.data, venueId);
    const ratings = (json.data.ratings || []).map(r => Rating.fromApi(r, venueId));

    return { stats, ratings };
  } catch {
    return null;
  }
};

// ─── Service ──────────────────────────────────────────────────────────────────
export const ratingService = {
  /**
   * Fetch ratings from all 25 venues in parallel using native fetch.
   * Falls back to dummy data if ALL requests fail.
   */
  getAll: async (filters = {}) => {
    let allRatings = [];
    let aggregatedStats = null;

    try {
      // Fire all 25 venue requests in parallel
      const results = await Promise.allSettled(
        VENUE_IDS.map(id => fetchVenueRatings(id))
      );

      const successfulResults = results
        .filter(r => r.status === 'fulfilled' && r.value !== null)
        .map(r => r.value);

      if (successfulResults.length === 0) {
        throw new Error('All venue rating requests failed');
      }

      // Flatten all ratings
      allRatings = successfulResults.flatMap(r => r.ratings);

      // Aggregate stats across all venues
      const totalRatings = successfulResults.reduce((sum, r) => sum + r.stats.ratingsCount, 0);
      const weightedSum = successfulResults.reduce(
        (sum, r) => sum + r.stats.averageRating * r.stats.ratingsCount, 0
      );
      const distribution = [5, 4, 3, 2, 1].map(score => {
        const count = allRatings.filter(r => r.rating === score).length;
        return {
          score,
          count,
          percentage: totalRatings > 0 ? Math.round((count / totalRatings) * 100) : 0,
        };
      });

      aggregatedStats = {
        total: totalRatings,
        average: totalRatings > 0 ? (weightedSum / totalRatings).toFixed(1) : '0.0',
        distribution,
      };
    } catch (error) {
      console.warn('API fetch failed, using dummy ratings:', error.message);
      allRatings = [...dummyRatings];

      const total = allRatings.length;
      const avg = total > 0
        ? (allRatings.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1)
        : '0.0';
      const distribution = [5, 4, 3, 2, 1].map(score => {
        const count = allRatings.filter(r => r.rating === score).length;
        return {
          score,
          count,
          percentage: total > 0 ? Math.round((count / total) * 100) : 0,
        };
      });

      aggregatedStats = { total, average: avg, distribution };
    }

    // Apply client-side filters
    if (filters.score && filters.score !== 'all') {
      allRatings = allRatings.filter(r => r.rating === Number(filters.score));
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      allRatings = allRatings.filter(r =>
        r.customerName.toLowerCase().includes(q) ||
        r.comment.toLowerCase().includes(q)
      );
    }

    return { ratings: allRatings, stats: aggregatedStats };
  },

  /**
   * Get unique venue IDs that have ratings (for filter dropdown).
   */
  getUniqueVenues: async () => {
    try {
      const results = await Promise.allSettled(
        VENUE_IDS.map(id => fetchVenueRatings(id))
      );

      return results
        .filter(r => r.status === 'fulfilled' && r.value !== null && r.value.ratings.length > 0)
        .map(r => ({ id: r.value.stats.venueId, name: `Venue #${r.value.stats.venueId}` }))
        .sort((a, b) => a.id - b.id);
    } catch {
      // Fallback: extract unique venue IDs from dummy data
      const venueMap = new Map();
      dummyRatings.forEach(r => {
        if (r.venueId && !venueMap.has(r.venueId)) {
          venueMap.set(r.venueId, { id: r.venueId, name: `Venue #${r.venueId}` });
        }
      });
      return Array.from(venueMap.values()).sort((a, b) => a.id - b.id);
    }
  },
};