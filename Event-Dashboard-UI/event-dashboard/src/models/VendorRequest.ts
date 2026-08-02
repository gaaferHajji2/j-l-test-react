/**
 * DTO Model for Vendor Service Request
 * Maps to GET /vendor/services API response
 */
export class VendorRequest {
  constructor(data) {
    this.id = data.id ?? null;
    this.orderId = data.order_id ?? null;
    this.eventId = data.event_id ?? null;
    this.vendorId = data.vendor_id ?? null;
    this.serviceName = data.service_name ?? '';
    this.description = data.description ?? '';
    this.price = data.price ?? '0.00';
    this.quantity = data.quantity ?? 1;
    this.status = data.status ?? 'pending';
    this.rejectionReason = data.rejection_reason ?? null;
    this.createdAt = data.created_at ?? null;
    this.updatedAt = data.updated_at ?? null;

    // Nested event object (if provided by API)
    this.event = data.event ? {
      id: data.event.id ?? null,
      eventName: data.event.event_name ?? '',
      eventType: data.event.event_type ?? '',
      date: data.event.date ?? '',
      startTime: data.event.start_time ?? '',
      endTime: data.event.end_time ?? '',
      guestsCount: data.event.guests_count ?? 0,
      status: data.event.status ?? '',
    } : null;

    // Nested vendor object (if provided by API)
    this.vendor = data.vendor ? {
      id: data.vendor.id ?? null,
      name: data.vendor.name ?? '',
      email: data.vendor.email ?? '',
      phone: data.vendor.phone ?? '',
    } : null;
  }

  get priceAsNumber() { return parseFloat(this.price) || 0; }
  get totalPrice() { return this.priceAsNumber * this.quantity; }
  get formattedCreatedAt() {
    if (!this.createdAt) return '';
    return new Date(this.createdAt).toLocaleDateString();
  }
  get isPending() { return this.status === 'pending'; }
  get isApproved() { return this.status === 'approved' || this.status === 'accepted'; }
  get isRejected() { return this.status === 'rejected'; }

  get eventDisplayName() {
    return this.event?.eventName || `Event #${this.eventId}`;
  }
  get vendorDisplayName() {
    return this.vendor?.name || `Vendor #${this.vendorId}`;
  }
  get eventDateFormatted() {
    if (!this.event?.date) return '';
    return new Date(this.event.date).toLocaleDateString();
  }

  static fromApi(data) { return new VendorRequest(data); }
  static fromApiResponse(response) {
    const items = response?.data ?? response ?? [];
    return items.map(item => VendorRequest.fromApi(item));
  }
}