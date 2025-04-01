// import React from 'react'
import { Stack } from 'react-bootstrap';
import { ChatType, Message, User } from '../../context/ChatContext'
import moment from 'moment';

import InputEmoji from "react-input-emoji";
import { useEffect, useRef, useState } from 'react';

import { BASE_URL, postRequest } from '../../utils/services';

interface Props {
    user: User;

    currentChat: ChatType;

    messages: Array<Message>;

    isMsgLoading: boolean;

    msgMsgError: string;

    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;

    sendTxtMsgError: string;

    setSendTxtMsgError: React.Dispatch<React.SetStateAction<string>>;

    setNewMessage: React.Dispatch<React.SetStateAction<Message>>;
}

const ChatBox = ({ user, currentChat, messages, isMsgLoading,
    msgMsgError, setMessages, setSendTxtMsgError, setNewMessage }: Props) => {
    const recipientUser = currentChat?.members.find((elem) => elem._id != user._id);

    const [txtMsg, setTxtMsg] = useState<string>("");

    const scroll = useRef<HTMLSpanElement>(null);

    useEffect(()=>{
        scroll.current?.scrollIntoView({behavior: "smooth"});
    }, [messages]);

    // console.log("The Text Message is: ", txtMsg);

    const sendMessage = async () => {
        try {
            if (!txtMsg) return console.log("You Must Enter Message First...");

            const response = await postRequest(`${BASE_URL}/messages/create-new-message`, {
                senderId: user?._id,
                chatId: currentChat?._id,
                text: txtMsg
            });

            setTxtMsg("");

            if (response.status == 201) {
                // console.log("Message Sended Successfully");

                if (!messages || messages.length == 0) {
                    setMessages([response.data.message]);
                } else {
                    setMessages([...messages, response.data.message]);
                }

                setNewMessage(response.data.message);

                // console.log('---------------------------------------');
                // console.log("The New Message is: ", response.data.message);
                // console.log('---------------------------------------');
            }
        } catch (ex: any) {
            console.error("Exception is: ", ex);

            setSendTxtMsgError(ex.response.data.msg);

            console.error("Exception Msg is: ", ex.response.data.msg);

        }
    }

    // if (messages && messages.length > 0) {
    //     // console.log("The Length of Messages is: ", messages.length);

    //     // console.log("The User _id is: ", user?._id);
    //     // console.log("The User Email is: ", user?.email);

    //     // console.log("The Current Chat ID is: ", currentChat?._id);

    //     // console.log("The Member-01 is: ", currentChat?.members[0]._id);
    //     // console.log("The Member-01 is: ", currentChat?.members[0].email);

    //     // console.log("The Member-02 is: ", currentChat?.members[1]._id);
    //     // console.log("The Member-02 is: ", currentChat?.members[1].email);
    // }

    if (!recipientUser) {
        return <p style={{ textAlign: "center", width: "100%" }}>
            No Recipient User Found
        </p>
    }

    if (isMsgLoading) {
        return <p style={{ textAlign: "center", width: "100%" }}>
            The Messages Are Loading...
        </p>
    }

    // if (!messages || messages.length == 0) {
    //     return <p style={{ textAlign: "center", width: "100%" }}>
    //         There Are No Messages Between You And This User, Start Chatting...
    //     </p>
    // }

    if (msgMsgError != "") {
        return <p style={{ textAlign: "center", width: "100%" }}>
            We Have Error: {msgMsgError}
        </p>
    }

    return (
        <Stack gap={4} className="chat-box">
            <div className="chat-header">
                <strong>{recipientUser?.email}</strong>
            </div>

            <Stack gap={3} className="messages">
                {messages && messages.map((message: Message, index: number) => {
                    return (
                        <Stack
                            key={index}
                            className={`${message?.sender._id === user._id
                                ? "message self align-self-end flex-grow-0"
                                : "message align-self-start flex-grow-0"}`
                            }
                            ref={scroll}
                        >
                            <span>{message.text}</span>
                            <span className="message-footer">{moment(message.createdAt).calendar()}</span>
                        </Stack>
                    );
                })}
            </Stack>

            <Stack direction="horizontal" gap={3} className="chat-input flex-grow-0">
                <InputEmoji 
                    value={txtMsg} 
                    onChange={setTxtMsg} 
                    fontFamily="nunito" 
                    borderColor="rgba(72, 112, 223, 0.2)" 
                    onEnter={() => sendMessage()} 
                />

                <button className="send-btn" onClick={() => sendMessage()}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send" viewBox="0 0 16 16">
                        <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
                    </svg>
                </button>
            </Stack>
        </Stack>
    )
}

export default ChatBox