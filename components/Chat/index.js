import { useEffect, useRef, useState } from "react";
import styles from "./chat.module.css";

const Chat = ({ socket, playerId }) => {
  const [message, setMessage] = useState('');
  const inputRef = useRef(null);
  const buttonRef = useRef(null);
  const writeMessage = (e) => setMessage(e.target.value);
  const submitMessage = () => {
    setMessage('');
    socket.emit('a user talked', {
      socketId: playerId,
      message,
      timestamp: Date.now()
    });
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
      <input type="text" value={message} onInput={writeMessage} ref={inputRef} />
      <button type="button" className="btn" onClick={submitMessage} ref={buttonRef}>Send</button>
    </div>
  );
}

export default Chat;