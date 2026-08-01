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