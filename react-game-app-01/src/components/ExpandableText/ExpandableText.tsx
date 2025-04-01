import { useState } from "react";

interface Props {
    children: string,
    maxChars?: number,
}

const ExpandableText = ({ children, maxChars=50 } : Props) => {

    const [expanded, setExpanded] = useState(false);

    const btn = <button onClick={() => setExpanded(!expanded)}>{expanded ? 'Less' : 'More'}</button>

    if (children.length <= maxChars) return <p>{children}</p>

    let text = expanded ? children : children.substring(0, maxChars);

    return (
        <p>{text}... {btn}</p>
    )
}

export default ExpandableText