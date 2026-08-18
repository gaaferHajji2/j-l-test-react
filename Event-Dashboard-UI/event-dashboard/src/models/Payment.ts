/**
 * DTO Model for Admin Payment
 * Maps to GET /admin/payments/finance API response
 */
export class Payment {
  constructor(data) {
    this.id = data.id ?? null;
    this.invoiceId = data.invoice_id ?? null;
    this.transactionId = data.transaction_id ?? null;
    this.paymentMethod = data.payment_method ?? '';
    this.amount = data.amount ?? '0.00';
    this.refundAmount = data.refund_amount ?? null;
    this.status = data.status ?? '';
    this.paidAt = data.paid_at ?? null;
    this.refundedAt = data.refunded_at ?? null;
    this.createdAt = data.created_at ?? null;
    this.updatedAt = data.updated_at ?? null;

    // Nested invoice
    this.invoice = data.invoice ? {
      id: data.invoice.id ?? null,
      eventId: data.invoice.event_id ?? null,
      totalAmount: data.invoice.total_amount ?? '0.00',
      status: data.invoice.status ?? '',
      venuePrice: data.invoice.venue_price ?? '0.00',
      servicesTotal: data.invoice.services_total ?? '0.00',

      // Deeply nested event
      event: data.invoice.event ? {
        id: data.invoice.event.id ?? null,
        customerId: data.invoice.event.customer_id ?? null,
        venueId: data.invoice.event.venue_id ?? null,
        eventName: data.invoice.event.event_name ?? '',
        date: data.invoice.event.date ?? '',
        status: data.invoice.event.status ?? '',

        // Customer
        customer: data.invoice.event.customer ? {
          id: data.invoice.event.customer.id ?? null,
          name: data.invoice.event.customer.name ?? '',
          phone: data.invoice.event.customer.phone ?? '',
          email: data.invoice.event.customer.email ?? '',
        } : null,

        // Venue
        venue: data.invoice.event.venue ? {
          id: data.invoice.event.venue.id ?? null,
          name: data.invoice.event.venue.name ?? '',
          address: data.invoice.event.venue.address ?? '',
          coverImageUrl: data.invoice.event.venue.cover_image_url ?? null,
          imagesUrls: Array.isArray(data.invoice.event.venue.images_urls)
            ? data.invoice.event.venue.images_urls : [],
        } : null,
      } : null,
    } : null;
  }

  get amountAsNumber() { return parseFloat(this.amount) || 0; }
  get refundAmountAsNumber() { return parseFloat(this.refundAmount) || 0; }
  get hasRefund() { return this.refundAmount !== null && this.refundAmountAsNumber > 0; }
  get isSuccess() { return this.status === 'success'; }
  get isFailed() { return this.status === 'failed'; }
  get isRefunded() { return this.status === 'refunded' || this.hasRefund; }

  get formattedPaidAt() {
    if (!this.paidAt) return '';
    return new Date(this.paidAt).toLocaleString();
  }
  get formattedCreatedAt() {
    if (!this.createdAt) return '';
    return new Date(this.createdAt).toLocaleDateString();
  }
  get formattedRefundedAt() {
    if (!this.refundedAt) return '';
    return new Date(this.refundedAt).toLocaleString();
  }

  get eventName() { return this.invoice?.event?.eventName || `Invoice #${this.invoiceId}`; }
  get customerName() { return this.invoice?.event?.customer?.name || 'Unknown'; }
  get customerEmail() { return this.invoice?.event?.customer?.email || ''; }
  get venueName() { return this.invoice?.event?.venue?.name || ''; }
  get eventDate() {
    const d = this.invoice?.event?.date;
    return d ? new Date(d).toLocaleDateString() : '';
  }
  get venuePriceAsNumber() { return parseFloat(this.invoice?.venuePrice) || 0; }
  get servicesTotalAsNumber() { return parseFloat(this.invoice?.servicesTotal) || 0; }
  get invoiceTotalAsNumber() { return parseFloat(this.invoice?.totalAmount) || 0; }

  static fromApi(data) { return new Payment(data); }
  static fromApiResponse(response) {
    const items = response?.data ?? response ?? [];
    return Array.isArray(items) ? items.map(item => Payment.fromApi(item)) : [];
  }
}

/**
 * Finance Summary DTO
 * Maps to the "summary" key in /admin/payments/finance response
 */
export class FinanceSummary {
  constructor(data) {
    this.paymentsCount = data.payments_count ?? 0;
    this.successfulPaymentsCount = data.successful_payments_count ?? 0;
    this.failedPaymentsCount = data.failed_payments_count ?? 0;
    this.refundedPaymentsCount = data.refunded_payments_count ?? 0;
    this.totalCollectedAmount = data.total_collected_amount ?? 0;
    this.totalRefundedAmount = data.total_refunded_amount ?? 0;
    this.paidInvoicesCount = data.paid_invoices_count ?? 0;
    this.pendingInvoicesCount = data.pending_invoices_count ?? 0;
    this.totalInvoicesAmount = data.total_invoices_amount ?? 0;
  }

  get pendingAmount() {
    return Math.max(this.totalInvoicesAmount - this.totalCollectedAmount, 0);
  }

  static fromApi(data) { return new FinanceSummary(data); }
}