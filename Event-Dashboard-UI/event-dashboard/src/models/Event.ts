/**
 * DTO Model for Venue Owner Event
 * Maps to GET /venue-owner/events API response
 */
export class Event {
  constructor(data) {
    this.id = data.id ?? null;
    this.customerId = data.customer_id ?? null;
    this.eventName = data.event_name ?? '';
    this.eventType = data.event_type ?? '';
    this.venueId = data.venue_id ?? null;
    this.date = data.date ?? '';
    this.startTime = data.start_time ?? '';
    this.endTime = data.end_time ?? '';
    this.guestsCount = data.guests_count ?? 0;
    this.totalPrice = data.total_price ?? '0.00';
    this.invoiceId = data.invoice_id ?? null;
    this.paymentId = data.payment_id ?? null;
    this.note = data.note ?? null;
    this.status = data.status ?? 'pending';
    this.rejectionReason = data.rejection_reason ?? null;
    this.createdAt = data.created_at ?? null;
    this.updatedAt = data.updated_at ?? null;

    // Nested customer object
    this.customer = data.customer ? {
      id: data.customer.id ?? null,
      name: data.customer.name ?? '',
      email: data.customer.email ?? '',
      phone: data.customer.phone ?? '',
    } : null;

    // Nested venue object
    this.venue = data.venue ? {
      id: data.venue.id ?? null,
      name: data.venue.name ?? '',
    } : null;
  }

  get totalPriceAsNumber() { return parseFloat(this.totalPrice) || 0; }

  get formattedDate() {
    if (!this.date) return '';
    return new Date(this.date).toLocaleDateString();
  }

  get formattedCreatedAt() {
    if (!this.createdAt) return '';
    return new Date(this.createdAt).toLocaleDateString();
  }

  get timeRange() {
    if (!this.startTime || !this.endTime) return '';
    return `${this.startTime.substring(0, 5)} – ${this.endTime.substring(0, 5)}`;
  }

  get isPending() { return this.status === 'pending'; }
  get isApproved() { return this.status === 'approved' || this.status === 'accepted'; }
  get isRejected() { return this.status === 'rejected'; }

  get customerDisplayName() {
    return this.customer?.name || `Customer #${this.customerId}`;
  }

  get venueDisplayName() {
    return this.venue?.name || `Venue #${this.venueId}`;
  }

  static fromApi(data) { return new Event(data); }

  static fromApiResponse(response) {
    const items = response?.data ?? response ?? [];
    return items.map(item => Event.fromApi(item));
  }
}