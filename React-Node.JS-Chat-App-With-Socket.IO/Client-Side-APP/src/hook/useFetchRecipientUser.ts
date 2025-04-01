import React, { useEffect, useState } from 'react'
import { ChatType, User } from '../context/ChatContext'

// interface Props {
//     chat: ChatType;
//     user: User;
// }

export const useFetchRecipientUser = (chat: ChatType, user: User) => {
    const [recipientUser, setRecipientUser ] = useState<User|undefined>(undefined);

    const [errMsg, setErrMsg] = useState<string>("");

    useEffect(()=> {
        const recipient = chat?.members.find((member: User) => member._id != user._id);

        // console.log("The Recipient User is: ", recipient);

        if(recipient == null) {
            setErrMsg("No Recipient Found For Chat...");
        } else{
            setErrMsg("");
            setRecipientUser(recipient);
        }
    }, [])

    return { recipientUser, errMsg };
};
