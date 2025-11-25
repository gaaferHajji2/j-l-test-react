import { useState, type ReactNode } from "react";
import { AlertType } from "../constant";
import './Alert.css'

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
          {type == AlertType.warning ? "⚠️" : "ℹ️"}
        </span>
        <span className="font-bold">{title}</span>
        {closeable && (
          <button
            aria-label="Close"
            onClick={() => handleClose() }
            className="close-btn"
          >
            <span role="image" aria-label="Close">
              ❌
            </span>
          </button>
        )}
      </div>

      

      <div className="content">{children}</div>
    </div>
  );
};

export default Alert;
