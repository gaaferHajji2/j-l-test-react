const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1586769852044-692d6e3703f0?w=400&q=80';

/**
 * DTO for a single service within a category group
 */
export class CategoryService {
  constructor(data) {
    this.id = data.id ?? null;
    this.vendorId = data.vendor_id ?? null;
    this.categoryId = data.category_id ?? null;
    this.name = data.name ?? '';
    this.description = data.description ?? '';
    this.price = data.price ?? '0.00';
    this.images = Array.isArray(data.images) ? data.images : [];
    this.status = data.status ?? 'active';
    this.createdAt = data.created_at ?? null;

    this.vendor = data.vendor ? {
      id: data.vendor.id ?? null,
      name: data.vendor.name ?? '',
      email: data.vendor.email ?? '',
      avatar: data.vendor.avatar ?? null,
      phone: data.vendor.phone ?? '',
    } : null;
  }

  get priceAsNumber() { return parseFloat(this.price) || 0; }

  get imageUrl() {
    if (this.images.length > 0 && this.images[0]) return this.images[0];
    return FALLBACK_IMAGE;
  }

  get vendorDisplayName() { return this.vendor?.name || `Vendor #${this.vendorId}`; }

  get vendorInitials() {
    const name = this.vendorDisplayName;
    return name.split(' ').map(n => n.charAt(0)).join('').substring(0, 2).toUpperCase();
  }

  static fromApi(data) { return new CategoryService(data); }
}

/**
 * DTO for a category with its nested services array
 */
export class ServiceCategoryGroup {
  constructor(data) {
    this.id = data.id ?? null;
    this.name = data.name ?? '';
    this.description = data.description ?? '';
    this.createdAt = data.created_at ?? null;
    this.services = Array.isArray(data.services)
      ? data.services.map(s => CategoryService.fromApi(s))
      : [];
  }

  get servicesCount() { return this.services.length; }

  get minPrice() {
    if (this.services.length === 0) return 0;
    return Math.min(...this.services.map(s => s.priceAsNumber));
  }

  get hasServices() { return this.services.length > 0; }

  static fromApi(data) { return new ServiceCategoryGroup(data); }

  static fromApiResponse(response) {
    const items = response?.data ?? response ?? [];
    return Array.isArray(items) ? items.map(item => ServiceCategoryGroup.fromApi(item)) : [];
  }
}