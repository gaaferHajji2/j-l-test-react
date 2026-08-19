/**
 * DTO Model for Service Category
 * Maps to /admin/service-categories API
 */
export class ServiceCategory {
  constructor(data) {
    this.id = data.id ?? null;
    this.name = data.name ?? '';
    this.description = data.description ?? '';
  }

  static fromApi(data) {
    return new ServiceCategory(data);
  }

  static fromApiResponse(response) {
    const items = response?.categories ?? response?.data ?? [];
    return Array.isArray(items) ? items.map(item => ServiceCategory.fromApi(item)) : [];
  }
}