import { useState } from "react";
import { AlertType } from "../constant";

interface AlertData {
  title: string;
  msg: string;
  type: AlertType;
  closeable: boolean;
}

const Alert = ({
  title,
  msg,
  type = AlertType.information,
  closeable = true,
}: AlertData) => {
  const [visible, setVisible] = useState<boolean>(true);

  if (!visible) {
    return null;
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
        <button aria-label="Close" onClick={() => setVisible((prev) => !prev)}>
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
