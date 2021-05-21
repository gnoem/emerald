import { useState } from "react";
import styles from "./chat.module.css";

const Chat = () => {
  const [message, setMessage] = useState('');
  const writeMessage = (e) => setMessage(e.target.value);
  const submitMessage = () => {
    console.log(message);
  }
  return (
    <div className={styles.Chat}>
      <input type="text" defaultValue={message} onInput={writeMessage} />
      <button type="button" onClick={submitMessage}>Send</button>
    </div>
  );
}

export default Chat;