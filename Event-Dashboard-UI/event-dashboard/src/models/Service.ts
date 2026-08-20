const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1586769852044-692d6e3703f0?w=400&q=80';

/**
 * DTO Model for Vendor Service
 * Maps to GET /services paginated API response
 */
export class Service {
  constructor(data) {
    this.id = data.id ?? null;
    this.vendorId = data.vendor_id ?? null;
    this.categoryId = data.category_id ?? null;
    this.name = data.name ?? '';
    this.description = data.description ?? '';
    this.price = data.price ?? '0.00';
    this.images = Array.isArray(data.images) ? data.images : [];
    this.status = data.status ?? 'pending';
    this.rejectionReason = data.rejection_reason ?? null;
    this.createdAt = data.created_at ?? null;
    this.updatedAt = data.updated_at ?? null;

    // Nested vendor object
    this.vendor = data.vendor ? {
      id: data.vendor.id ?? null,
      name: data.vendor.name ?? '',
      email: data.vendor.email ?? '',
      phone: data.vendor.phone ?? '',
    } : null;

    // Nested category object
    this.category = data.category ? {
      id: data.category.id ?? null,
      name: data.category.name ?? '',
    } : null;
  }

  get priceAsNumber() {
    return parseFloat(this.price) || 0;
  }

  /** Always returns a valid image URL — first from API images array, or fallback */
  get imageUrl() {
    if (this.images.length > 0 && this.images[0]) {
      return this.images[0];
    }
    return FALLBACK_IMAGE;
  }

  get formattedCreatedAt() {
    if (!this.createdAt) return '';
    return new Date(this.createdAt).toLocaleDateString();
  }

  get isPending() { return this.status === 'pending'; }
  get isActive() { return this.status === 'active'; }
  get isInactive() { return this.status === 'inactive'; }
  get isRejected() { return this.status === 'rejected'; }

  get vendorDisplayName() {
    return this.vendor?.name || `Vendor #${this.vendorId}`;
  }

  get categoryDisplayName() {
    return this.category?.name || '';
  }

  static fromApi(data) {
    return new Service(data);
  }

  /**
   * Parse paginated API response.
   * Response shape: { status, count, data: { current_page, data: [...], total, ... } }
   */
  static fromPaginatedResponse(response) {
    const items = response?.data?.data ?? response?.data ?? [];
    return items.map(item => Service.fromApi(item));
  }

  /** Extract pagination metadata from response */
  static getPaginationMeta(response) {
    const meta = response?.data ?? {};
    return {
      currentPage: meta.current_page ?? 1,
      perPage: meta.per_page ?? 10,
      total: meta.total ?? 0,
      lastPage: meta.last_page ?? 1,
      hasNext: meta.next_page_url !== null,
      hasPrev: meta.prev_page_url !== null,
    };
  }
}