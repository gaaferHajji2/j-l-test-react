import React, { useContext, useState } from 'react'
import { ChatContext, User, UserNotification } from '../../context/ChatContext';
import { unreadNotificationFunc } from '../../utils/unreadNotifications';
import moment from 'moment';

const UserNotifications = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const { userNotifications, userChats, allUsers,
        user, markAllNotificationsAsRead, markNotificationAsRead, currentChat } = useContext(ChatContext);

    const unreadNotifications = unreadNotificationFunc(userNotifications);

    const modifiedNotifications = userNotifications.map((userNotification: UserNotification) => {
        const sender = allUsers.find((pUser: User) => pUser._id === userNotification.senderId);

        return {
            ...userNotification,
            senderName: sender.email,
        }
    });

    console.log("============================================================");
    console.log("The UnRead Notifications Are: ", unreadNotifications);
    console.log("The Modified Notifications Are: ", modifiedNotifications);
    console.log("============================================================");

    return (
        <div className='notifications'>
            <div className="notifications-icon" onClick={() => setIsOpen((prev) => !prev)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-chat-left-fill" viewBox="0 0 16 16">
                    <path d="M2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                </svg>

                {unreadNotifications.length > 0 && <span className='notification-count'>{unreadNotifications.length}</span>}
            </div>

            {isOpen && <div className="notifications-box">
                <div className="notifications-header">
                    <h3>User Notifications</h3>

                    <div className="mark-as-read" onClick={() => {
                        if (unreadNotifications.length == 0) {
                            return;
                        }
                        markAllNotificationsAsRead(unreadNotifications);
                    }
                    }>Mark All As Read</div>
                </div>
                {
                    modifiedNotifications.length === 0 &&
                    <span className='notification'>We Don't Have Notifications Yet...</span>
                }

                {modifiedNotifications.length > 0 && modifiedNotifications.map((n: any, index: number) => {
                    return <div key={index}
                        className={n.isRead ? 'notification' : 'notification not-read'}
                        onClick={() => {
                            if (n.isRead) {
                                console.log("---------------------------------------------------");
                                console.log("The Notification is Read");
                                console.log("---------------------------------------------------");

                                return;
                            }
                            markNotificationAsRead(n, userChats, user, userNotifications);
                            setIsOpen(false);
                        }}
                    >
                        <span>{`${n.senderName} Sent To You A Message`}</span>
                        <span className='notification-time'>{moment(n.date).calendar()}</span>
                    </div>
                })}
            </div>}
        </div>
    )
}

export default UserNotifications