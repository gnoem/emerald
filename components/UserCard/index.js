import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { UsersContext } from "../../contexts/UsersContext";
import Avatar, { colorMap } from "../Avatar";
import styles from "./userCard.module.css";

const UserCard = ({ socket, view, updateView, playerId }) => {
  const [isPlayer, setIsPlayer] = useState(null);
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
    if (view.user) {
      setOpen(true);
      setIsPlayer(playerId === view.user);
    }
  }, [view.user]);
  return (
    <div className={`${styles.UserCard} ${open ? styles.open : ''} ${closing ? styles.closing : ''}`}>
      <div>
        <div className={styles.Card}>
          <button onClick={closeCard}><FontAwesomeIcon icon={faTimes} /></button>
          {view.user && <CardContent {...{ socket, socketId: view.user, isPlayer }} />}
        </div>
        <img className={styles.Foreground} src="http://i.imgur.com/cQ06xWU.png" />
      </div>
    </div>
  );
}

const CardContent = ({ socket, socketId, isPlayer }) => {
  const { userList } = useContext(UsersContext);
  const { outfit } = userList[socketId];
  return (
    <div className={styles.CardContent}>
      <h2>{socketId.slice(0, 5)}</h2>
      <div>
        <CardAvatar isPlayer={isPlayer}>
          <Avatar outfit={outfit} orientation="SE" socketId={`userCard-${socketId}`} />
        </CardAvatar>
        <CardDescription>
          <b>location:</b> {userList[socketId].room}
          {isPlayer
            ? <Wardrobe {...{ socket, socketId, outfit }} />
            : <UserDescription />}
        </CardDescription>
      </div>
    </div>
  );
}

const CardAvatar = ({ children, isPlayer }) => {
  return (
    <div className={styles.CardAvatar}>
      {children}
    </div>
  );
}

const CardDescription = ({ children }) => {
  return (
    <div className={styles.CardDescription}>
      {children}
    </div>
  );
}

const Wardrobe = ({ socket, socketId, outfit }) => {
  const colorOptions = Object.keys(colorMap).map(color => {
    const handleClick = () => {
      const updatedOutfit = {...outfit};
      updatedOutfit.color = color;
      socket.emit('a user changed their outfit', {
        socketId,
        outfit: updatedOutfit
      });
    }
    return (
      <button onClick={handleClick} key={`wardrobeColor-${color}-${socketId}`}>
        <Avatar orientation="S" outfit={{ color }} socketId={`wardrobeColor-${color}-${socketId}`} />
      </button>
    );
  });
  return (
    <div className={styles.WardrobeCategory}>
      {colorOptions}
    </div>
  );
}

const UserDescription = () => {
  return (
    <div>

    </div>
  );
}

export default UserCard;