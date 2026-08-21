const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1586769852044-692d6e3703f0?w=400&q=80';

/**
 * DTO Model for Admin Service Request
 * Maps to GET /admin/services/requests API response
 */
export class VendorRequest {
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
      avatar: data.vendor.avatar ?? null,
      phone: data.vendor.phone ?? '',
      role: data.vendor.role ?? 'vendor',
      emailVerifiedAt: data.vendor.email_verified_at ?? null,
      createdAt: data.vendor.created_at ?? null,
    } : null;
  }

  get priceAsNumber() { return parseFloat(this.price) || 0; }

  /** First image from API or fallback Unsplash URL */
  get imageUrl() {
    if (this.images.length > 0 && this.images[0]) return this.images[0];
    return FALLBACK_IMAGE;
  }

  get formattedCreatedAt() {
    if (!this.createdAt) return '';
    return new Date(this.createdAt).toLocaleDateString();
  }

  get isPending() { return this.status === 'pending'; }
  get isPendingDelete() { return this.status === 'pending_delete'; }
  get needsReview() { return this.status === 'pending' || this.status === 'pending_delete'; }

  get isApproved() { return this.status === 'approved' || this.status === 'active'; }
  get isRejected() { return this.status === 'rejected'; }

  get vendorDisplayName() { return this.vendor?.name || `Vendor #${this.vendorId}`; }
  get vendorEmail() { return this.vendor?.email || ''; }
  get vendorPhone() { return this.vendor?.phone || ''; }
  get vendorInitials() {
    const name = this.vendorDisplayName;
    return name.split(' ').map(n => n.charAt(0)).join('').substring(0, 2).toUpperCase();
  }

  static fromApi(data) { return new VendorRequest(data); }
  static fromApiResponse(response) {
    const items = response?.data ?? response ?? [];
    return Array.isArray(items) ? items.map(item => VendorRequest.fromApi(item)) : [];
  }
}