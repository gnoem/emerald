import React, { useEffect, useRef, useState } from "react";
import styles from "./chat.module.css";

interface IChatProps {
  socket: any;
  playerId: string;
}

const Chat: React.FC<IChatProps> = ({ socket, playerId }): JSX.Element => {
  const [message, setMessage] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
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