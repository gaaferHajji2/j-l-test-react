import { useState, type ReactNode } from "react";
import { AlertType } from "../constant";

type Props = {
  title: string;
  msg: ReactNode;
  type: AlertType;
  closeable?: boolean;
  onClose?: () => void;
}

const Alert = ({
  title,
  msg,
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
