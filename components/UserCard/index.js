import { useEffect, useState } from "react";
import styles from "./userCard.module.css";

const UserCard = ({ user, updateViewingUser }) => {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const closeCard = () => {
    setClosing(true);
    updateViewingUser(false);
    setTimeout(() => {
      setClosing(false);
      setOpen(false);
    }, 500);
  }
  useEffect(() => {
    if (user) setOpen(true);
  }, [user]);
  return (
    <div className={`${styles.UserCard} ${open ? styles.open : ''} ${closing ? styles.closing : ''}`}>
      <div>
        <div className={styles.Card}><button onClick={closeCard}>[x]</button></div>
        <img className={styles.Foreground} src="http://i.imgur.com/cQ06xWU.png" />
      </div>
    </div>
  );
}

export default UserCard;