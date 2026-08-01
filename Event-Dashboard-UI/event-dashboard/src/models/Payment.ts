/**
 * DTO Model for Payment
 * Maps to customer/payments API response
 */
export class Payment {
  constructor(data) {
    this.paymentId = data.payment_id ?? null;
    this.eventId = data.event_id ?? null;
    this.amount = data.amount ?? '0.00';
    this.paymentMethod = data.payment_method ?? '';
    this.transactionId = data.transaction_id ?? '';
    this.status = data.status ?? '';
    this.paidAt = data.paid_at ?? null;
  }

  get amountAsNumber() {
    return parseFloat(this.amount) || 0;
  }

  get formattedPaidAt() {
    if (!this.paidAt) return '';
    return new Date(this.paidAt).toLocaleString();
  }

  get isSuccess() {
    return this.status === 'success';
  }

  static fromApi(data) {
    return new Payment(data);
  }
}

/**
 * DTO Model for Payment Detail
 * Maps to GET /customer/payments/{id} API response
 */
export class PaymentDetail {
  constructor(data) {
    this.id = data.id ?? null;
    this.invoiceId = data.invoice_id ?? null;
    this.transactionId = data.transaction_id ?? '';
    this.paymentMethod = data.payment_method ?? '';
    this.amount = data.amount ?? '0.00';
    this.refundAmount = data.refund_amount ?? null;
    this.status = data.status ?? '';
    this.paidAt = data.paid_at ?? null;
    this.refundedAt = data.refunded_at ?? null;
    this.createdAt = data.created_at ?? null;
    this.updatedAt = data.updated_at ?? null;

    // Nested invoice object
    this.invoice = data.invoice ? {
      id: data.invoice.id ?? null,
      eventId: data.invoice.event_id ?? null,
      venuePrice: data.invoice.venue_price ?? '0.00',
      servicesTotal: data.invoice.services_total ?? '0.00',
      totalAmount: data.invoice.total_amount ?? '0.00',
      status: data.invoice.status ?? '',
      createdAt: data.invoice.created_at ?? null,
      updatedAt: data.invoice.updated_at ?? null,

      // Deeply nested event object
      event: data.invoice.event ? {
        id: data.invoice.event.id ?? null,
        customerId: data.invoice.event.customer_id ?? null,
        eventName: data.invoice.event.event_name ?? '',
        eventType: data.invoice.event.event_type ?? '',
        venueId: data.invoice.event.venue_id ?? null,
        date: data.invoice.event.date ?? '',
        startTime: data.invoice.event.start_time ?? '',
        endTime: data.invoice.event.end_time ?? '',
        guestsCount: data.invoice.event.guests_count ?? 0,
        totalPrice: data.invoice.event.total_price ?? '0.00',
        invoiceId: data.invoice.event.invoice_id ?? null,
        paymentId: data.invoice.event.payment_id ?? null,
        note: data.invoice.event.note ?? null,
        status: data.invoice.event.status ?? '',
        rejectionReason: data.invoice.event.rejection_reason ?? null,
        createdAt: data.invoice.event.created_at ?? null,
        updatedAt: data.invoice.event.updated_at ?? null,
      } : null,
    } : null;
  }

  // ─── Computed Getters ──────────────────────────────────────────────────────

  get amountAsNumber() { return parseFloat(this.amount) || 0; }
  get refundAmountAsNumber() { return parseFloat(this.refundAmount) || 0; }
  get hasRefund() { return this.refundAmount !== null && this.refundAmountAsNumber > 0; }
  get isSuccess() { return this.status === 'success'; }
  get isRefunded() { return this.status === 'refunded' || this.hasRefund; }

  get formattedPaidAt() {
    if (!this.paidAt) return '';
    return new Date(this.paidAt).toLocaleString();
  }

  get formattedCreatedAt() {
    if (!this.createdAt) return '';
    return new Date(this.createdAt).toLocaleString();
  }

  get formattedRefundedAt() {
    if (!this.refundedAt) return '';
    return new Date(this.refundedAt).toLocaleString();
  }

  /** Get event name with fallback */
  get eventName() {
    return this.invoice?.event?.eventName || `Invoice #${this.invoiceId}`;
  }

  /** Get event type with fallback */
  get eventType() {
    return this.invoice?.event?.eventType || '';
  }

  /** Get event date formatted */
  get eventDate() {
    const d = this.invoice?.event?.date;
    if (!d) return '';
    return new Date(d).toLocaleDateString();
  }

  /** Get event time range */
  get eventTimeRange() {
    const ev = this.invoice?.event;
    if (!ev?.startTime || !ev?.endTime) return '';
    return `${ev.startTime.substring(0, 5)} – ${ev.endTime.substring(0, 5)}`;
  }

  /** Get guests count */
  get guestsCount() {
    return this.invoice?.event?.guestsCount ?? 0;
  }

  /** Get venue price as number */
  get venuePriceAsNumber() {
    return parseFloat(this.invoice?.venuePrice) || 0;
  }

  /** Get services total as number */
  get servicesTotalAsNumber() {
    return parseFloat(this.invoice?.servicesTotal) || 0;
  }

  /** Get invoice total as number */
  get invoiceTotalAsNumber() {
    return parseFloat(this.invoice?.totalAmount) || 0;
  }

  // ─── Static Factory Methods ────────────────────────────────────────────────

  static fromApi(data) {
    return new PaymentDetail(data);
  }

  static fromApiResponse(response) {
    const payload = response?.data ?? response;
    return PaymentDetail.fromApi(payload);
  }
}