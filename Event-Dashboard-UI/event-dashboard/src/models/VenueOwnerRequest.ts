const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80';

/**
 * DTO Model for Venue Owner Request
 * Maps to GET /admin/venue-requests API response
 */
export class VenueOwnerRequest {
  constructor(data) {
    this.id = data.id ?? null;
    this.ownerId = data.owner_id ?? null;
    this.venueId = data.venue_id ?? null;
    this.type = data.type ?? 'create'; // 'create' | 'update'
    this.name = data.name ?? '';
    this.address = data.address ?? '';
    this.capacity = data.capacity ?? 0;
    this.price = data.price ?? '0.00';
    this.description = data.description ?? '';
    this.coverImage = data.cover_image ?? null;
    this.images = Array.isArray(data.images) ? data.images : [];
    this.status = data.status ?? 'pending';
    this.adminNotes = data.admin_notes ?? null;
    this.createdAt = data.created_at ?? null;
    this.updatedAt = data.updated_at ?? null;

    // Nested owner object
    this.owner = data.owner ? {
      id: data.owner.id ?? null,
      name: data.owner.name ?? '',
      email: data.owner.email ?? '',
      avatar: data.owner.avatar ?? null,
      phone: data.owner.phone ?? '',
      role: data.owner.role ?? 'venue_owner',
      emailVerifiedAt: data.owner.email_verified_at ?? null,
      createdAt: data.owner.created_at ?? null,
    } : null;
  }

  get priceAsNumber() { return parseFloat(this.price) || 0; }

  /** Cover image → first gallery image → fallback */
  get imageUrl() {
    if (this.coverImage) return this.coverImage;
    if (this.images.length > 0 && this.images[0]) return this.images[0];
    return FALLBACK_IMAGE;
  }

  get formattedCreatedAt() {
    if (!this.createdAt) return '';
    return new Date(this.createdAt).toLocaleDateString();
  }

  get isPending() { return this.status === 'pending'; }
  get isApproved() { return this.status === 'approved'; }
  get isRejected() { return this.status === 'rejected'; }

  get isCreateRequest() { return this.type === 'create'; }
  get isUpdateRequest() { return this.type === 'update'; }

  get ownerDisplayName() { return this.owner?.name || `Owner #${this.ownerId}`; }
  get ownerEmail() { return this.owner?.email || ''; }
  get ownerPhone() { return this.owner?.phone || ''; }
  get ownerInitials() {
    const name = this.ownerDisplayName;
    return name.split(' ').map(n => n.charAt(0)).join('').substring(0, 2).toUpperCase();
  }

  /** Extract city from address string */
  get city() {
    if (!this.address) return '';
    const parts = this.address.split('-').map(s => s.trim());
    return parts[0] || this.address;
  }

  static fromApi(data) { return new VenueOwnerRequest(data); }
  static fromApiResponse(response) {
    const items = response?.data ?? response ?? [];
    return Array.isArray(items) ? items.map(item => VenueOwnerRequest.fromApi(item)) : [];
  }
}