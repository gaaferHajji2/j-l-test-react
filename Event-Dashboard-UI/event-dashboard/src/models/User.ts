/**
 * DTO Model for Admin User
 * Maps to GET /admin/users API response
 */
export class User {
  constructor(data) {
    this.id = data.id ?? null;
    this.name = data.name ?? '';
    this.email = data.email ?? '';
    this.avatar = data.avatar ?? null;
    this.phone = data.phone ?? '';
    this.emailVerifiedAt = data.email_verified_at ?? null;
    this.role = data.role ?? 'customer';
    this.vendorCategoryId = data.vendor_category_id ?? null;
    this.createdAt = data.created_at ?? null;
    this.updatedAt = data.updated_at ?? null;
  }

  get isEmailVerified() {
    return this.emailVerifiedAt !== null;
  }

  get formattedCreatedAt() {
    if (!this.createdAt) return '';
    return new Date(this.createdAt).toLocaleDateString();
  }

  get initials() {
    return this.name
      .split(' ')
      .map(n => n.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  /** Avatar URL or null (UI should fall back to initials) */
  get avatarUrl() {
    return this.avatar || null;
  }

  static fromApi(data) {
    return new User(data);
  }

  static fromApiResponse(response) {
    const items = response?.data ?? response ?? [];
    return Array.isArray(items) ? items.map(item => User.fromApi(item)) : [];
  }
}