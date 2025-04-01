import { useState } from 'react'
import { AiFillHeart } from 'react-icons/ai';

import { AiOutlineHeart } from 'react-icons/ai'

interface Props {
    onClick: () => void;
}

const Like = ( { onClick }: Props) => {

    const [liked, setLiked] = useState(false)

    const toggle = () => {
        setLiked(!liked);

        onClick();
    }
    
    if (liked)
        return (
            <AiFillHeart  fill='red'  onClick={ toggle } size={20} display='block' />
        )
    
    return <AiOutlineHeart color='#000' size={20} onClick={ toggle } display='block' />
}

export default Like