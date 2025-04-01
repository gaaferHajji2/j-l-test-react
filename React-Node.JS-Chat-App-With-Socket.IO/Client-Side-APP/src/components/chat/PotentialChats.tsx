// import React, { useContext } from 'react'
import { useContext } from 'react';
import { ChatContext, OnlineUsers, User } from '../../context/ChatContext'


interface Props {
    onlineUsers: Array<OnlineUsers>;
}

const PotentialChats = ({ onlineUsers }: Props) => {

    const { potentialChats, createChat, user } = useContext(ChatContext);

    // console.log("The Potential Chats are: ", potentialChats);

    // console.log("The Online Users are: ", onlineUsers);

    return (
        <>
            <div className="all-users">
                {
                    potentialChats && potentialChats.map((userChat: User) => {
                        return (
                            <div className="single-user"
                                key={userChat._id}
                                onClick={() => createChat(user._id, userChat._id)}>

                                {userChat.email}
                                {onlineUsers?.some(user => user.userId === userChat._id) && <span className="user-online"></span>}

                            </div>
                        );
                    })}
            </div>
        </>
    )
}

export default PotentialChats