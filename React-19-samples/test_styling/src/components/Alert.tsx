import { useState, type ReactNode } from "react";
import { AlertType } from "../constant";
import './Alert.css';

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
  closeable = true,
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
    <div className={`container ${type == AlertType.information ? 'information' : 'warning'}`}>
      <div className="header">
        <span
          role="image"
          aria-label={type == AlertType.warning ? "Warning" : "Information"}
          className="header-icon"
        >
          {type == AlertType.warning ? "⚠️" : "ℹ️"}
        </span>
        <span className="header-text">{title}</span>
      </div>

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

      <div className="content">{children}</div>
    </div>
  );
};

export default Alert;
