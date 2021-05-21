import { useEffect, useRef, useState } from "react";
import styles from "./chat.module.css";

const Chat = ({ socketId }) => {
  const [message, setMessage] = useState('');
  const inputRef = useRef(null);
  const buttonRef = useRef(null);
  const writeMessage = (e) => setMessage(e.target.value);
  const submitMessage = () => {
    console.log(message);
  }
  useEffect(() => {
    if (!inputRef.current || !buttonRef.current) return;
    const checkMessageSubmit = (e) => {
      if (inputRef.current !== document.activeElement) return;
      if (e.code === 'Enter') buttonRef.current.click();
    }
    window.addEventListener('keydown', checkMessageSubmit);
    return () => window.removeEventListener('keydown', checkMessageSubmit);
  }, [inputRef.current, buttonRef.current]);
  return (
    <div className={styles.Chat}>
      <input type="text" defaultValue={message} onInput={writeMessage} ref={inputRef} />
      <button type="button" onClick={submitMessage} ref={buttonRef}>Send</button>
    </div>
  );
}

export default Chat;