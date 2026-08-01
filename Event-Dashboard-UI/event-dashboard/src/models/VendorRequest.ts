/**
 * DTO Model for Vendor Request (Event Booking)
 * Maps directly to /venue-owner/events API response
 */
export class VendorRequest {
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
    this.note = data.note ?? '';
    this.status = data.status ?? 'pending';
    this.rejectionReason = data.rejection_reason ?? null;
    this.createdAt = data.created_at ?? null;
    this.updatedAt = data.updated_at ?? null;

    // Nested objects
    this.customer = data.customer ? {
      id: data.customer.id ?? null,
      name: data.customer.name ?? '',
      email: data.customer.email ?? '',
      phone: data.customer.phone ?? '',
    } : null;

    this.venue = data.venue ? {
      id: data.venue.id ?? null,
      name: data.venue.name ?? '',
    } : null;
  }

  /** Get formatted total price as number */
  get totalPriceAsNumber() {
    return parseFloat(this.totalPrice) || 0;
  }

  /** Get formatted created date */
  get formattedCreatedAt() {
    if (!this.createdAt) return '';
    return new Date(this.createdAt).toLocaleDateString();
  }

  /** Get formatted event date */
  get formattedDate() {
    if (!this.date) return '';
    return new Date(this.date).toLocaleDateString();
  }

  /** Get formatted time range */
  get timeRange() {
    if (!this.startTime || !this.endTime) return '';
    const formatTime = (t) => t?.substring(0, 5);
    return `${formatTime(this.startTime)} – ${formatTime(this.endTime)}`;
  }

  /** Check status helpers */
  get isPending() { return this.status === 'pending'; }
  get isApproved() { return this.status === 'approved'; }
  get isRejected() { return this.status === 'rejected'; }

  /** Get customer display name with fallback */
  get customerDisplayName() {
    return this.customer?.name || `Customer #${this.customerId}`;
  }

  /** Get venue display name with fallback */
  get venueDisplayName() {
    return this.venue?.name || `Venue #${this.venueId}`;
  }

  /** Create instance from API response item */
  static fromApi(data) {
    return new VendorRequest(data);
  }

  /** Create array of instances from API response */
  static fromApiResponse(response) {
    const items = response?.data ?? response ?? [];
    return items.map(item => VendorRequest.fromApi(item));
  }
}