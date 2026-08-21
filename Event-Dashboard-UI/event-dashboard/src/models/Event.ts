/**
 * DTO Model for Admin Event
 * Maps to GET /admin/events/all API response
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

    // Nested customer
    this.customer = data.customer ? {
      id: data.customer.id ?? null,
      name: data.customer.name ?? '',
      phone: data.customer.phone ?? '',
    } : null;

    // Nested venue
    this.venue = data.venue ? {
      id: data.venue.id ?? null,
      name: data.venue.name ?? '',
      price: data.venue.price ?? '0.00',
    } : null;

    // Nested services array
    this.services = Array.isArray(data.services)
      ? data.services.map(s => ({
          id: s.id ?? null,
          name: s.name ?? '',
          price: s.price ?? '0.00',
          quantity: s.pivot?.quantity ?? 1,
          servicePrice: s.pivot?.price ?? s.price ?? '0.00',
          status: s.pivot?.status ?? null,
        }))
      : [];

    // Nested invoice
    this.invoice = data.invoice ? {
      id: data.invoice.id ?? null,
      eventId: data.invoice.event_id ?? null,
      venuePrice: data.invoice.venue_price ?? '0.00',
      servicesTotal: data.invoice.services_total ?? '0.00',
      totalAmount: data.invoice.total_amount ?? '0.00',
      status: data.invoice.status ?? '',
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
  get isConfirmed() { return this.status === 'confirmed'; }
  get isPaid() { return this.status === 'paid'; }
  get isCancelled() { return this.status === 'cancelled' || this.status === 'rejected'; }
  get needsReview() { return this.status === 'pending'; }

  get customerDisplayName() { return this.customer?.name || `Customer #${this.customerId}`; }
  get venueDisplayName() { return this.venue?.name || `Venue #${this.venueId}`; }
  get servicesCount() { return this.services.length; }

  static fromApi(data) { return new Event(data); }
  static fromApiResponse(response) {
    const items = response?.data ?? response ?? [];
    return Array.isArray(items) ? items.map(item => Event.fromApi(item)) : [];
  }
}