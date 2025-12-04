import { useState, type ReactNode } from "react"
import { AlertType } from "../constant"
import crossIcon from "../assets/cross.svg"
import infoIcon from "../assets/info.svg"
import warningIcon from "../assets/warning.svg"
// import './Alert.css'

type Props = {
  title: string;
  children: ReactNode;
  type: AlertType;
  closeable?: boolean;
  onClose?: () => void;
}

const Alert = ({
  title,
  children,
  type = AlertType.information,
  closeable = false,
  onClose,
}: Props) => {
  const [visible, setVisible] = useState<boolean>(true);

  if (!visible) {
    return null;
  }

  function handleClose() {
    setVisible(false)
    if(onClose){
      onClose()
    }
  }

  return (
    <div className={
      `border inline-flex flex-col rounded-md border-gray-400 p-3 text-center 
      ${type === AlertType.warning ? 'text-amber-300' : 'text-blue-600'}
      bg-transparent`
    }>
      <div className="mb-1 flex items-center">
        <span
          role="image"
          aria-label={type == AlertType.warning ? "Warning" : "Information"}
          className={`w-7`}
        >
          <img src={type == AlertType.warning ? warningIcon : infoIcon} 
          alt={type == AlertType.warning ? 'wraning' : 'information'}
          className="mr-1 w-6 h-6" />
        </span>
        <span className="font-bold">{title}</span>
        {closeable && (
          <button
            aria-label="Close"
            onClick={() => handleClose() }
            className="ml-auto flex h-6 w-6 cursor-pointer items-center 
            justify-center border-none bg-transparent p-0"
          >
            <img src={crossIcon} alt="Close">
              
            </img>
          </button>
        )}
      </div>

      

      <div className="ml-7 pr-5 text-black">{children}</div>
    </div>
  );
};

export default Alert;
