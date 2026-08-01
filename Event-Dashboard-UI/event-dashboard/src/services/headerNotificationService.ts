import { api } from './api';
import { Notification } from '../models/Notification';

// ─── Dummy Data (Fallback) ───────────────────────────────────────────────────
const generateDummyNotifications = () => {
  const templates = [
    {
      type: 'App\\Notifications\\EventCancelledByCustomerNotification',
      data: {
        event_id: 3,
        type: 'booking_cancelled_by_customer',
        title: 'تم إلغاء الحجز من قبل الزبون ❌',
        message: 'قام الزبون بإلغاء حجز مناسبة (حفل زفاف) بتاريخ 2026-08-01. تم استرجاع مبلغ (600000) للزبون بحسب سياسة الاسترجاع.',
      },
    },
    {
      type: 'App\\Notifications\\InvoicePaidNotification',
      data: {
        event_id: 3,
        payment_id: 2,
        type: 'invoice_paid',
        title: 'تم استلام الدفعة 💰',
        message: 'قام الزبون بدفع فاتورة مناسبة (حفل زفاف) بمبلغ (600000.00) بنجاح، الحجز أصبح معتمداً ومدفوعاً بالكامل.',
      },
    },
    {
      type: 'App\\Notifications\\NewEventNotification',
      data: {
        event_id: 3,
        title: 'طلب حجز جديد قيد الانتظار',
        message: 'تم تقديم طلب حجز جديد لصالتك بتاريخ 2026-08-01',
        type: 'new_booking',
      },
    },
    {
      type: 'App\\Notifications\\NewEventNotification',
      data: {
        event_id: 5,
        title: 'طلب حجز جديد قيد الانتظار',
        message: 'تم تقديم طلب حجز جديد لفعالية (مؤتمر تقني) بتاريخ 2026-09-15',
        type: 'new_booking',
      },
    },
    {
      type: 'App\\Notifications\\InvoicePaidNotification',
      data: {
        event_id: 7,
        payment_id: 4,
        type: 'invoice_paid',
        title: 'تم استلام الدفعة 💰',
        message: 'قام الزبون بدفع فاتورة مناسبة (معرض فني) بمبلغ (25000.00) بنجاح.',
      },
    },
    {
      type: 'App\\Notifications\\EventCancelledByCustomerNotification',
      data: {
        event_id: 8,
        type: 'booking_cancelled_by_customer',
        title: 'تم إلغاء الحجز من قبل الزبون ❌',
        message: 'قام الزبون بإلغاء حجز مناسبة (عيد ميلاد) بتاريخ 2026-08-20.',
      },
    },
    {
      type: 'App\\Notifications\\NewEventNotification',
      data: {
        event_id: 10,
        title: 'طلب حجز جديد قيد الانتظار',
        message: 'تم تقديم طلب حجز جديد لفعالية (حفلة موسيقية) بتاريخ 2026-10-01',
        type: 'new_booking',
      },
    },
    {
      type: 'App\\Notifications\\InvoicePaidNotification',
      data: {
        event_id: 12,
        payment_id: 6,
        type: 'invoice_paid',
        title: 'تم استلام الدفعة 💰',
        message: 'قام الزبون بدفع فاتورة مناسبة (قمة ريادة أعمال) بمبلغ (45000.00) بنجاح.',
      },
    },
  ];

  return templates.map((tmpl, index) => {
    const date = new Date();
    date.setMinutes(date.getMinutes() - index * 45 - Math.floor(Math.random() * 30));

    // Generate a deterministic pseudo-GUID for dummy data
    const hex = (index + 1).toString(16).padStart(8, '0');
    const guid = `${hex}-15ce-41f7-a0f3-2cfa914c${String(index).padStart(4, '0')}`;

    return new Notification({
      id: guid,
      type: tmpl.type,
      notifiable_type: 'App\\Models\\User',
      notifiable_id: 9,
      data: tmpl.data,
      read_at: index > 3 ? date.toISOString() : null,
      created_at: date.toISOString(),
      updated_at: date.toISOString(),
    });
  });
};

let dummyNotifications = generateDummyNotifications();

// ─── Service ──────────────────────────────────────────────────────────────────
export const headerNotificationService = {
  /**
   * Fetch all notifications from API.
   * GET /notifications
   * Falls back to dummy data if API fails.
   */
  getRecent: async () => {
    try {
      const response = await api.get('/notifications', true);
      return Notification.fromApiResponse(response);
    } catch (error) {
      console.warn('API fetch failed, using dummy notifications:', error.message);
      return [...dummyNotifications].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }
  },

  /**
   * Get unread count.
   * Derived from full list (API or dummy).
   */
  getUnreadCount: async () => {
    try {
      const notifications = await headerNotificationService.getRecent();
      return notifications.filter(n => !n.isRead).length;
    } catch (error) {
      return 0;
    }
  },

  /**
   * Mark a single notification as read by GUID.
   * POST /notifications/{guid}/read
   * Falls back to updating dummy data if API fails.
   */
  markAsRead: async (guid) => {
    try {
      await api.put(`/notifications/${guid}/read`, {}, true);
      return true;
    } catch (error) {
      console.warn(`API markAsRead failed for ${guid}, updating dummy:`, error.message);
      const idx = dummyNotifications.findIndex(n => n.id === guid);
      if (idx !== -1) {
        dummyNotifications[idx] = new Notification({
          ...dummyNotifications[idx],
          read_at: new Date().toISOString(),
        });
      }
      return false;
    }
  },

  /**
   * Mark all notifications as read.
   * Calls markAsRead for each unread notification.
   */
  markAllAsRead: async () => {
    try {
      const notifications = await headerNotificationService.getRecent();
      const unread = notifications.filter(n => !n.isRead);

      // Fire all read requests in parallel
      await Promise.allSettled(
        unread.map(n => headerNotificationService.markAsRead(n.id))
      );

      return true;
    } catch (error) {
      console.warn('API markAllAsRead failed:', error.message);
      // Fallback: mark all dummy as read
      dummyNotifications = dummyNotifications.map(
        n => n.isRead ? n : new Notification({ ...n, read_at: new Date().toISOString() })
      );
      return false;
    }
  },
};