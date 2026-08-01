/**
 * DTO Model for Notification
 * Maps to GET /notifications API response
 */
export class Notification {
  constructor(data) {
    this.id = data.id ?? ''; // GUID
    this.type = data.type ?? '';
    this.notifiableType = data.notifiable_type ?? '';
    this.notifiableId = data.notifiable_id ?? null;
    this.readAt = data.read_at ?? null;
    this.createdAt = data.created_at ?? null;
    this.updatedAt = data.updated_at ?? null;

    // Nested data object
    this.data = data.data ? {
      eventId: data.data.event_id ?? null,
      paymentId: data.data.payment_id ?? null,
      type: data.data.type ?? '',
      title: data.data.title ?? '',
      message: data.data.message ?? '',
    } : {
      eventId: null,
      paymentId: null,
      type: '',
      title: '',
      message: '',
    };
  }

  /** Whether this notification has been read */
  get isRead() {
    return this.readAt !== null;
  }

  /** Formatted creation timestamp */
  get formattedCreatedAt() {
    if (!this.createdAt) return '';
    return new Date(this.createdAt).toLocaleString();
  }

  /** Relative time ago string */
  get timeAgo() {
    if (!this.createdAt) return '';
    const diff = Date.now() - new Date(this.createdAt).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  /** Get display title from nested data */
  get title() {
    return this.data.title || 'Notification';
  }

  /** Get display message from nested data */
  get message() {
    return this.data.message || '';
  }

  /** Get notification category from nested data.type */
  get category() {
    return this.data.type || '';
  }

  /** Map notification type to icon path and color */
  get visualStyle() {
    const map = {
      booking_cancelled_by_customer: {
        icon: 'M6 18L18 6M6 6l12 12',
        color: 'red',
      },
      invoice_paid: {
        icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
        color: 'emerald',
      },
      new_booking: {
        icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
        color: 'blue',
      },
      event_approved: {
        icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
        color: 'green',
      },
      product_rejected: {
        icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z',
        color: 'amber',
      },
    };

    return map[this.category] || {
      icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
      color: 'blue',
    };
  }

  static fromApi(data) {
    return new Notification(data);
  }

  static fromApiResponse(response) {
    const items = response?.data ?? response ?? [];
    return items.map(item => Notification.fromApi(item));
  }
}