import React from 'react'


interface AlertData {
    title: string,
    msg: string
}

const Alert = (props: AlertData) => {
  return (
    <div>
        <div>
            <span role='image' aria-label="Warning">⚠️⚠️⚠️</span>
            <span>{props.title}</span>
        </div>

        <div>
            {props.msg}
        </div>
    </div>
  )
}


export default Alert;