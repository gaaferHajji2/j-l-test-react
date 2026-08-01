/**
 * DTO Model for Venue Owner Request
 * Maps directly to /venue-owner/venues API response
 */
export class VenueOwnerRequest {
  constructor(data) {
    this.id = data.id ?? null;
    this.ownerId = data.owner_id ?? null;
    this.name = data.name ?? '';
    this.address = data.address ?? '';
    this.capacity = data.capacity ?? 0;
    this.price = data.price ?? '0.00';
    this.description = data.description ?? '';
    this.coverImage = data.cover_image ?? '';
    this.images = Array.isArray(data.images) ? data.images : [];
    this.status = data.status ?? 'pending'; // active, pending, rejected
    this.createdAt = data.created_at ?? null;
    this.updatedAt = data.updated_at ?? null;
  }

  /**
   * Get formatted price as number
   */
  get priceAsNumber() {
    return parseFloat(this.price) || 0;
  }

  /**
   * Get formatted created date
   */
  get formattedCreatedAt() {
    if (!this.createdAt) return '';
    return new Date(this.createdAt).toLocaleDateString();
  }

  /**
   * Get formatted updated date
   */
  get formattedUpdatedAt() {
    if (!this.updatedAt) return '';
    return new Date(this.updatedAt).toLocaleDateString();
  }

  /**
   * Check if request is pending
   */
  get isPending() {
    return this.status === 'pending';
  }

  /**
   * Check if request is approved/active
   */
  get isActive() {
    return this.status === 'active';
  }

  /**
   * Check if request is rejected
   */
  get isRejected() {
    return this.status === 'rejected';
  }

  /**
   * Get all images including cover
   */
  get allImages() {
    const imgs = [];
    if (this.coverImage) imgs.push(this.coverImage);
    if (this.images.length > 0) imgs.push(...this.images);
    return imgs;
  }

  /**
   * Create instance from API response item
   */
  static fromApi(data) {
    return new VenueOwnerRequest(data);
  }

  /**
   * Create array of instances from API response
   */
  static fromApiResponse(response) {
    const items = response?.data ?? response ?? [];
    return items.map(item => VenueOwnerRequest.fromApi(item));
  }
}