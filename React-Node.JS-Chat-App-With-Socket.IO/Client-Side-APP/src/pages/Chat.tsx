import { useContext } from "react";
import { ChatType, ChatContext } from "../context/ChatContext";
import { Container, Stack } from "react-bootstrap";
import UserChat from "../components/chat/UserChat";
import PotentialChats from "../components/chat/PotentialChats";
import ChatBox from "../components/chat/ChatBox";


const Chat = () => {

    const { userChats, isLoading, user,
        updateCurrentChat, currentChat, messages,
        isMsgLoading, msgMsgError, setMessages, sendTxtMsgError, setSendTxtMsgError,
        setNewMessage, onlineUsers, userNotifications, markThisUserNotificationsAsRead } = useContext(ChatContext);

    // console.log("The User Chats is: ", userChats);
    // console.log("The User Chats Length is: ", userChats?.length);
    // console.log("The Loading Status is: ", isLoading);
    // console.log("The Error Msg is: ", errMsg);

    // console.log("The User Chats is: ", userChats);

    return (
        <Container>
            <PotentialChats onlineUsers={onlineUsers} />

            {isLoading && <p>The Message Chats is Loading</p>}

            {
                userChats?.length > 0 ?
                    <Stack direction="horizontal" gap={4}
                        className="align-items-start">
                        <Stack className="messages-box flex-grow-0 pe-3" gap={3}>
                            {
                                userChats?.map((elem: ChatType, index: number) =>
                                    <div key={index} onClick={() => updateCurrentChat(elem)}>
                                        <UserChat
                                            chat={elem}
                                            user={user}
                                            onlineUsers={onlineUsers}
                                            userNotifications={userNotifications}
                                            markThisUserNotificationsAsRead={markThisUserNotificationsAsRead} />
                                    </div>
                                )
                            }
                        </Stack>
                        <ChatBox
                            user={user}
                            currentChat={currentChat}
                            messages={messages}
                            isMsgLoading={isMsgLoading}
                            msgMsgError={msgMsgError}
                            setMessages={setMessages}
                            sendTxtMsgError={sendTxtMsgError}
                            setSendTxtMsgError={setSendTxtMsgError}
                            setNewMessage={setNewMessage}
                        />
                    </Stack> : null
            }

            {/* {
                userChats?.length > 1 ? <p>We Have Data Here</p> : <p>We Don't Have Any Data</p>
            } */}
        </Container>
    )
}

export default Chat;