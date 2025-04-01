import { UserNotification } from "../context/ChatContext";

export const unreadNotificationFunc = (notifications: UserNotification[],) => {
    return notifications.filter(n => n.isRead === false);
};