// import React from 'react';


import { ChatType, OnlineUsers, User, UserNotification } from '../../context/ChatContext'
// import { useFetchRecipientUser } from '../../hook/useFetchRecipientUser';
import { Stack } from 'react-bootstrap';

import Avatar from '../../assets/avatar-01.svg'
import { unreadNotificationFunc } from '../../utils/unreadNotifications';


interface Props {
    chat: ChatType;
    user: User;

    onlineUsers: Array<OnlineUsers>;

    userNotifications: UserNotification[];

    markThisUserNotificationsAsRead: (thisUserNotifications: UserNotification[], userNotifications: UserNotification[]) => void;
}

const UserChat = ({ chat, user, onlineUsers, userNotifications, markThisUserNotificationsAsRead }: Props) => {
    // const { recipientUser, errMsg } = useFetchRecipientUser(chat, user);
    const recipientUser = chat.members.find((elem) => elem._id != user._id);

    // console.log("The Online Users From UserChat is: ", onlineUsers);

    const unreadNotifications = unreadNotificationFunc(userNotifications);

    // Get The Recipient User Notifications.
    const thisUserNotifications = unreadNotifications.filter(un => un.senderId === recipientUser._id);

    return (
        <Stack direction="horizontal"
            gap={3}
            className="user-card align-items-center p-2 justify-content-between"
            onClick={() => {
                if (thisUserNotifications?.length > 0) {
                    markThisUserNotificationsAsRead(thisUserNotifications, userNotifications)
                }
            }}
            role="button">
            <div className="d-flex align-items-center justify-content-center">
                <div className="me-2">
                    <img src={Avatar} width={35} />
                </div>

                <div className="text-content">
                    <div className="name">
                        {recipientUser?.email}
                        {recipientUser == null && <p>No User Found!!</p>}
                    </div>

                    <div className="text">
                        Text Message Here...
                    </div>
                </div>
            </div>

            <div className="d-flex flex-column align-items-end">
                <div className="date">
                    {new Date(chat.createdAt).toDateString()}
                </div>

                {thisUserNotifications?.length > 0 && <div className="this-user-notifications">{thisUserNotifications.length}</div>}

                {thisUserNotifications?.length === 0 && <div className="this-user-notifications">0</div>}

                {onlineUsers?.some(t1 => t1.userId == recipientUser?._id) && <span className="user-online"></span>}
            </div>
        </Stack>
    )
}

export default UserChat