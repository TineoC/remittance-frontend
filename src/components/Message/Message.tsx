import Alert from "react-bootstrap/Alert";
import CloseButton from "react-bootstrap/CloseButton";

import classes from "./Message.module.css";

interface Props {
  variant: "success" | "danger";
  onClose: () => void;
  children: React.ReactNode;
}

const Message: React.FC<Props> = ({ variant, children, onClose }) => (
  <Alert
    key={variant}
    variant={variant}
    className={`${classes["message-container"]} mt-2`}
  >
    <div>{children}</div>
    <div className={classes["message-close-button"]}>
      <CloseButton onClick={onClose} />
    </div>
  </Alert>
);

export default Message;
