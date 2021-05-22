import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import Avatar from "../Avatar";
import styles from "./userCard.module.css";

const UserCard = ({ view, updateView }) => {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const closeCard = () => {
    setClosing(true);
    updateView(prevView => ({
      ...prevView,
      selfDestruct: true
    }));
    setTimeout(() => {
      setClosing(false);
      setOpen(false);
      updateView({});
    }, 500);
  }
  useEffect(() => {
    if (view.user) setOpen(true);
  }, [view.user]);
  return (
    <div className={`${styles.UserCard} ${open ? styles.open : ''} ${closing ? styles.closing : ''}`}>
      <div>
        <div className={styles.Card}>
          <button onClick={closeCard}><FontAwesomeIcon icon={faTimes} /></button>
          {view.user && <CardContent {...{ user: view.user }} />}
        </div>
        <img className={styles.Foreground} src="http://i.imgur.com/cQ06xWU.png" />
      </div>
    </div>
  );
}

const CardContent = ({ user }) => {
  return (
    <div className={styles.CardContent}>
      <h2>{user.slice(0, 5)}</h2>
      <div>
        <CardAvatar />
      </div>
    </div>
  );
}

const CardAvatar = () => {
  return (
    <div className={styles.CardAvatar}>
      {/* <Avatar /> */}
    </div>
  );
}

export default UserCard;