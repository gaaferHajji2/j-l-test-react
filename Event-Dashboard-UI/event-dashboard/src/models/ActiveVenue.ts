const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80';

/**
 * DTO Model for Active Venue
 * Maps to GET /admin/venues/active API response
 */
export class ActiveVenue {
  constructor(data) {
    this.id = data.id ?? null;
    this.ownerId = data.owner_id ?? null;
    this.name = data.name ?? '';
    this.address = data.address ?? '';
    this.capacity = data.capacity ?? 0;
    this.price = data.price ?? '0.00';
    this.description = data.description ?? '';
    this.status = data.status ?? 'active';
    this.createdAt = data.created_at ?? null;
    this.updatedAt = data.updated_at ?? null;
    this.coverImageUrl = data.cover_image_url ?? null;
    this.imagesUrls = Array.isArray(data.images_urls) ? data.images_urls : [];

    // Nested owner object
    this.owner = data.owner ? {
      id: data.owner.id ?? null,
      name: data.owner.name ?? '',
      email: data.owner.email ?? '',
      phone: data.owner.phone ?? '',
    } : null;
  }

  get priceAsNumber() {
    return parseFloat(this.price) || 0;
  }

  /** Cover image → first gallery image → fallback Unsplash */
  get imageUrl() {
    if (this.coverImageUrl) return this.coverImageUrl;
    if (this.imagesUrls.length > 0 && this.imagesUrls[0]) return this.imagesUrls[0];
    return FALLBACK_IMAGE;
  }

  get formattedCreatedAt() {
    if (!this.createdAt) return '';
    return new Date(this.createdAt).toLocaleDateString();
  }

  get ownerDisplayName() {
    return this.owner?.name || `Owner #${this.ownerId}`;
  }

  get ownerInitials() {
    const name = this.ownerDisplayName;
    return name.split(' ').map(n => n.charAt(0)).join('').substring(0, 2).toUpperCase();
  }

  static fromApi(data) {
    return new ActiveVenue(data);
  }

  static fromApiResponse(response) {
    const items = response?.data ?? response ?? [];
    return Array.isArray(items) ? items.map(item => ActiveVenue.fromApi(item)) : [];
  }
}