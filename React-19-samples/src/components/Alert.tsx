import { AlertType } from "../constant";



interface AlertData {
    title: string,
    msg: string,
    type: AlertType 
}



const Alert = ({title, msg, type = AlertType.information }: AlertData) => {
  return (
    <div>
        <div>
            <span role='image' aria-label={type == AlertType.warning ? "Warning" : "Information"}>
              {type == AlertType.warning ? "⚠️⚠️⚠️" : "ℹ️ℹ️ℹ️"}
            </span>
            <span>{title}</span>
        </div>

        <div>
            {msg}
        </div>
    </div>
  )
}


export default Alert;