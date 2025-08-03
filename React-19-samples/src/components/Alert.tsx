import { useState } from "react";
import { AlertType } from "../constant";

interface AlertData {
  title: string;
  msg: string;
  type: AlertType;
  closeable: boolean;
  onClose?: () => void;
}

const Alert = ({
  title,
  msg,
  type = AlertType.information,
  closeable = true,
  onClose,
}: AlertData) => {
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
    <div>
      <div>
        <span
          role="image"
          aria-label={type == AlertType.warning ? "Warning" : "Information"}
        >
          {type == AlertType.warning ? "⚠️⚠️⚠️" : "ℹ️ℹ️ℹ️"}
        </span>
        <span>{title}</span>
      </div>

      {closeable && (
        <button
          aria-label="Close"
          onClick={() => handleClose() }
        >
          <span role="image" aria-label="Close">
            ❌
          </span>
        </button>
      )}

      <div>{msg}</div>
    </div>
  );
};

export default Alert;
