/* eslint-disable react/prop-types */
import React from "react";
import { IconButton, InputBase } from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
// local imports
import styles from "./styles.module.scss";

type Props = {
  sendClick: (message: string, date: string) => void;
  onClick: () => void;
};

const MessageInput: React.FC<Props> = (props) => {
  const [message, setMessage] = React.useState("");

  const getDateString = () => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const dateObj = new Date();
    const month = monthNames[dateObj.getMonth()];
    const day = String(dateObj.getDate()).padStart(2, "0");
    const output = month + " " + day + ",";

    return `${output} - ${new Date().getHours()}: ${new Date().getMinutes()}`;
  };

  const sendHandler = () => {
    props.sendClick(message, getDateString());
    setMessage("");
  };

  return (
    <div className={styles.container} onClick={props.onClick}>
      <InputBase
        className={styles.input}
        placeholder={`Write here ...`}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") sendHandler();
        }}
      />
      <IconButton className={styles.iconButton} onClick={sendHandler}>
        <SendIcon className={styles.send} />
      </IconButton>
    </div>
  );
};

export default MessageInput;
