/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useCallback, useEffect, useState } from "react";

import { BASE_URL, getRequest, postRequest } from "../utils/services";

import { Socket, io } from "socket.io-client";
// import UserNotifications from "../components/chat/UserNotifications";

// import { User } from "./AuthContext";

export interface User {
    _id: string,
    name: string;
    email: string;
}

interface Props {
    children: React.ReactElement;

    user: User,
}

export interface ChatType {
    members: Array<User>;
    _id: string;

    createdAt: string;
    updatedAt: string;
}

export interface Chats {
    chats: Array<ChatType>;
}

export interface Message {
    chat: ChatType;
    sender: User;
    text: string;

    _id: string;

    createdAt: string;
    updatedAt: string;
}

export interface MessageCD {
    message: Message;
    _id: string;
    sender: User;
    chat: ChatType;
    text: string;
    recipientId: string;

    createdAt: string;
    updatedAt: string;
}

export interface OnlineUsers {
    socketId: string;
    userId: string;
}

export interface UserNotification {
    senderId: string,
    isRead: boolean,
    date: Date,
}

interface ChatContextType {
    userChats: Array<ChatType>;
    isLoading: boolean;
    errMsg: string;

    user: User;

    potentialChats: Array<User>;

    createChat: (firstId: string, secId: string) => Promise<void>;

    updateCurrentChat: (chat: ChatType) => void;

    currentChat: ChatType | null;

    messages: Array<Message>;
    isMsgLoading: boolean;
    msgMsgError: string;

    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;

    sendTxtMsgError: string;

    setSendTxtMsgError: React.Dispatch<React.SetStateAction<string>>;

    newMessage: Message | undefined;

    setNewMessage: React.Dispatch<React.SetStateAction<Message | undefined>>;

    onlineUsers: Array<OnlineUsers>;

    logoutUserFromChat: () => void;

    userNotifications: UserNotification[];

    allUsers: User[];

    markAllNotificationsAsRead: (notifications: UserNotification[]) => void;

    markNotificationAsRead: (n: UserNotification, userChats: Array<ChatType>,
        user: User, notifications: UserNotification[]) => void;

    markThisUserNotificationsAsRead: (thisUserNotifications: UserNotification[], userNotifications: UserNotification[]) => void;
}

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatContextProvider = ({ children, user }: Props) => {

    const [userChats, setUserChats] = useState<Array<ChatType>>([]);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [errMsg, setErrMsg] = useState<string>("");

    const [potentialChats, setPotentialChats] = useState<Array<User>>([]);

    const [currentChat, setCurrentChat] = useState<ChatType | null>(null);

    const [isMsgLoading, setIsMsgLoading] = useState<boolean>(false);

    const [msgMsgError, setMsgMsgError] = useState<string>("");

    const [messages, setMessages] = useState<Message[]>([]);

    const [sendTxtMsgError, setSendTxtMsgError] = useState<string>("");

    const [newMessage, setNewMessage] = useState<Message>();

    const [socket, setSocket] = useState<Socket>();

    const [onlineUsers, setOnlineUsers] = useState<Array<OnlineUsers>>([]);

    const [userNotifications, setUserNotifications] = useState<UserNotification[]>([]);

    const [allUsers, setAllUsers] = useState<User[]>([]);

    // console.log("The Current Chat is: ", currentChat);

    // console.log("The Current Messages is: ", messages);

    useEffect(() => {
        let newSocket = io("http://localhost:3000");

        setSocket(newSocket);

        // console.log("The Socket ID is: ", socket?.id);

        // console.log("New Connection For Socket.IO Has Been Established...");

        return () => {
            // console.log("Disconnecting From Server...");

            if (socket?.connected) {

                socket?.off("getOnlineUsers");

                // socket?.off("getOnlineUsers");

                socket?.off("getMessage");

                socket?.off("getNotification");

                localStorage.setItem("currentChat", "");

                // socket?.disconnect();
            }
        };
    }, [user]);

    useEffect(() => {
        if (user) {
            socket?.emit("addNewUser", user._id);

            // console.log("Emitting The addNewUser-Event, with Socket ID is: ", socket?.id);

            socket?.on("getOnlineUsers", (onlineUsers: Array<OnlineUsers>) => {
                setOnlineUsers(onlineUsers);
                // console.log("Online Users Are: ", onlineUsers);
            });
        }
    }, [socket]);

    // Send A Message
    useEffect(() => {
        if (socket) {
            let recipient = currentChat?.members.find(t1 => t1._id !== user._id);

            if (!recipient) return console.log("No Recipient Found For NewMessage: ", newMessage);

            // console.log("The Recipient Id is: ", recipient);

            socket.emit("addMessage", { ...newMessage, recipientId: recipient._id });
        }
    }, [newMessage]);

    // Receive A Message And Notification
    useEffect(() => {
        // console.log("The CurrentChat Of Socket is: ", currentChat);

        if (socket === null) return;

        socket?.on("getMessage", (message: MessageCD) => {
            // console.log("------------------------------------");
            // console.log("The New Message is (GetMessage-Event): ", message);
            // // console.log("The Current Chat is: ", currentChat);
            // console.log("------------------------------------");

            const t1 = localStorage.getItem("currentChat");

            const t2 = t1 ? JSON.parse(t1) : null;

            if (t2?._id === message?.chat?._id) {
                // if (messages && messages.length == 0) {
                //     console.log("The Messages is NULL NOW");
                //     setMessages([message]);
                // } else if(!messages) {
                //     console.log("The Messages is NULL NOW 2");
                //     setMessages([message]);
                // } else {
                //     console.log("The Messages is NOT NULL");
                //     setMessages((prev: Message[]) => [...prev, message]);
                // }

                if (!messages) {
                    // console.log("The Messages is Undefined.");
                    setMessages([message]);
                } else {
                    setMessages((prev: Message[]) => [...prev, message]);
                }

                // console.log("The New Messages: ", messages);
            } else {
                // console.log("------------------------------------");
                // console.log("The Current Chat is: ", currentChat);
                // console.log("The T2 Chat ID is: ", t2?._id);
                // console.log("The Message Chat ID is: ", message.chat._id);
                // console.log("The Get Message Not Current Chat Now...");
                // console.log("------------------------------------");
            }
        });

        socket?.on("getNotification", (notification: UserNotification) => {
            // console.log("============================================");
            // console.log("New Notification Received: ", notification);
            // console.log("============================================");

            const t1 = localStorage.getItem("currentChat");

            const t2 = t1 ? JSON.parse(t1) : null;

            const isChatOpen = t2?.members.some((user: User) => user._id === notification.senderId);

            // console.log("The User ID is: ", user._id);
            // console.log("The Notification Sender ID: ", notification.senderId);

            // console.log("The Length of Members Are: ", t2?.members.length);

            // t2?.members.forEach((user: User) => {
            //     console.log("---------------------------------------");
            //     console.log("The User From Members is: ", user._id);
            //     console.log("---------------------------------------");
            // });

            if (isChatOpen) {
                setUserNotifications((prev) => [{ ...notification, isRead: true }, ...prev]);

                // console.log("--------------------------------------------");
                // console.log("The Notifications Are: ", notifications);
                // console.log("--------------------------------------------");
            } else {
                // console.log("============================================");
                // console.log("The Chat is Not Open");
                // console.log("============================================");

                setUserNotifications((prev) => [notification, ...prev]);
            }
        });

        // return () => {
        //     // console.log("Disconnecting From Server...");

        //     // if (socket?.connected) {

        //     //     socket?.off("getMessage")

        //     //     localStorage.setItem("currentChat", "");
        //     // }
        // };
    }, [currentChat, socket]);

    useEffect(() => {
        const getUsers = async () => {
            const response = await getRequest(`${BASE_URL}/users`);

            // console.log("The Complete List of Users is: ", response.data.data);

            setAllUsers(response.data.data);

            const result = response.data.data.filter((elem: User) => {
                if (elem?._id === user?._id) {
                    return false;
                }

                let isChatCreated = false;

                if (userChats) {
                    isChatCreated = userChats?.some((chat) => {
                        return chat.members[0]._id === elem._id || chat.members[1]._id === elem._id;
                    })
                }

                return !isChatCreated;
            });
            // console.log("The Final Result of Comparing is: ", result);

            setPotentialChats(result);
        }

        getUsers();
    }, [userChats]);

    useEffect(() => {
        const getUserChats = async () => {
            try {
                if (user?._id) {
                    setIsLoading(true);
                    setErrMsg("");

                    const response = await getRequest(`${BASE_URL}/chats/get-user-chats-by-user-id/${user._id}`);

                    setUserChats(response.data.chats);
                    setIsLoading(false);
                } else {
                    // console.log("No User Provided For getUserChats in ChatContext.tsx");
                }
            } catch (ex: any) {
                setIsLoading(false);

                if (ex.response != null) {
                    return setErrMsg(ex.response.data.msg);
                } else {
                    return setErrMsg(ex.message);
                }
            }
        };

        getUserChats().then((_) => {
            // console.log("All Data Fetched OK...");
        });
    }, [user, userNotifications]);

    useEffect(() => {
        const getAllMessages = async () => {
            if (currentChat) {
                try {
                    // console.log("The Current Chat Has Been Changed");
                    // console.log("Updating The Messages");

                    setIsMsgLoading(true);
                    setMsgMsgError("");

                    const response = await getRequest(`${BASE_URL}/messages/get-chat-messages-by-chat-id/${currentChat._id}`);

                    // console.log("-------------------------------------");
                    // console.log("The Response Data is: ", response.data);
                    // console.log("-------------------------------------");

                    if (response.data.messages === undefined) {
                        console.log("We Initialize with empty array");
                        setMessages([]);
                    } else {
                        setMessages(response.data.messages);
                    }
                    setIsMsgLoading(false);
                    setMsgMsgError("");

                } catch (ex: any) {
                    setIsMsgLoading(false);
                    setMsgMsgError(ex.response.data.msg);
                }
            }
        }

        getAllMessages().then((_) => {
            // console.log("------------------------------------");
            // console.log("The Messages Has Been Loaded", messages);
            // console.log("------------------------------------");
        });
    }, [currentChat]);

    const createChat = useCallback(async (firstId: string, secId: string) => {
        setIsMsgLoading(true);

        const response = await postRequest(`${BASE_URL}/chats/create-new-chat`, { firstId, secId });

        // console.log("The Status Of Creating New Chat is: ", response.status);

        setIsMsgLoading(false);

        setMsgMsgError("");

        if (response.status == 201) {
            // console.log("The Response Data is: ", response.data.chat);
            // setUserChats([...userChats, response.data.chat]);

            // console.log("The First Id is: ", firstId);
            // console.log("The Second Id is: ", secId);

            // console.log("The Potential Chats Data is: ", potentialChats.length);
            // console.log("The User Chats Data is: ", userChats.length);

            // potentialChats.forEach((elem: User) => {
            //     console.log("--------------------------------");
            //     console.log("The Potential User is: ", elem._id)
            //     console.log("The Result of Changing 01 is: ", elem._id == firstId);
            //     console.log("The Result of Changing 02 is: ", elem._id == secId);
            //     // console.log("--------------------------------");
            // });

            // const t1 = potentialChats.filter(
            //     (elem: User) => elem._id != secId || elem._id != firstId
            // )

            // console.log("The Result of Filtering is: ", t1);

            // setPotentialChats(
            // );

            // console.log("The Email is: ", response.data.chat.email);
            // console.log("The Name is: ", response.data.chat.name);
            // console.log("The _id is: ", response.data.chat._id);

            setUserChats([...userChats, response.data.chat]);
        }
    }, [userChats]);


    const logoutUserFromChat = useCallback(() => {
        if (socket?.connected) {
            socket?.off("getOnlineUsers");

            socket?.off("getMessage");

            socket?.off("getNotification");

            // socket?.disconnect();
        }
    }, [user, socket]);

    const updateCurrentChat = useCallback((chat: ChatType) => {
        // console.log("The Previous Chat is: ", currentChat);

        if (chat === null) {
            return;
        }
        // else {
        //     console.log("The Chat is: ", chat);
        // }

        if (chat._id === currentChat?._id) {
            console.log("Duplicate Current Chat...");
            return;
        }

        setCurrentChat(chat);

        // console.log("The Current Chat is: ", currentChat);

        // setIsLoading(false);
    }, [currentChat]);

    useEffect(() => {
        // console.log("The Current Chat To Save: ", currentChat);

        localStorage.setItem("currentChat", JSON.stringify(currentChat));
    }, [currentChat]);

    // useEffect(() => {
    //     console.log("The Notifications From Side Effect is: ", userNotifications);
    // }, [userNotifications]);

    // useEffect(() => {
    //     console.log("The New Messages is: ", messages);
    // }, [messages]);

    const markAllNotificationsAsRead = useCallback((userNotifications: UserNotification[]) => {
        const mNotifications = userNotifications.map(n => ({ ...n, isRead: true }));

        setUserNotifications(mNotifications);
    }, []);

    const markNotificationAsRead = useCallback((
        n: UserNotification,
        userChats: Array<ChatType>,
        user: User,
        notifications: UserNotification[]) => {
        // Find A Chat To Open.
        const desiredChat = userChats.find(chat => {
            const chatMembers = [user._id, n.senderId];

            // console.log("The Chat Members Are: ", chatMembers);

            const isDesiredChat = chat?.members.every((member) => {
                const id1 = member._id;
                // const id2 = member[1]._id;

                // const t1 = [id1, id2];
                // console.log("The Data Of Chats Are: ", id1, " And The Member is: ", member);

                return chatMembers.includes(id1);
            });

            return isDesiredChat;
        });

        const mNotifications = notifications.map(el => {
            if (el.senderId === n.senderId) {
                return { ...el, isRead: true };
            }

            return el;
        });

        if (desiredChat?._id === currentChat?._id) {
            console.log("---------------------------------------------------");
            console.log("Current Chat is Loaded");
            console.log("---------------------------------------------------");

            return;
        }

        if (desiredChat) {
            updateCurrentChat(desiredChat);
        } else {
            console.log("======================================");
            console.log("No Desired Chat Found!!!");
            console.log("======================================");
        }

        setUserNotifications(mNotifications);
    }, []);

    const markThisUserNotificationsAsRead = useCallback(
        (thisUserNotifications: UserNotification[], notifications: UserNotification[]) => {
            let mNotifications = notifications.map((el: UserNotification) => {
                let notification: UserNotification = { senderId: '', isRead: false, date: new Date() };

                thisUserNotifications.forEach(n => {
                    if (el.senderId === n.senderId) {
                        notification = { ...n, isRead: true };
                    } else {
                        notification = el;
                    }
                });

                return notification;
            });

            setUserNotifications(mNotifications);
        }, []);

    return <ChatContext.Provider value={{
        userChats,
        isLoading,
        errMsg,
        user,

        potentialChats,

        createChat,

        updateCurrentChat,

        currentChat,

        messages,
        msgMsgError,
        isMsgLoading,

        setMessages,

        sendTxtMsgError,
        setSendTxtMsgError,

        newMessage,

        setNewMessage,

        onlineUsers,

        logoutUserFromChat,

        userNotifications,

        allUsers,

        markAllNotificationsAsRead,

        markNotificationAsRead,

        markThisUserNotificationsAsRead,
    }}>
        {children}
    </ChatContext.Provider>
}