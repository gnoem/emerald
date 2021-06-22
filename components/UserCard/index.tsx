import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useState } from "react";
import { UsersContext } from "../../contexts/UsersContext";
import Avatar, { colorMap } from "../Avatar";
import styles from "./userCard.module.css";

interface IUserCardProps {
  socket: any;
  view: any;
  updateView: any;
  playerId: string;
}

const UserCard: React.FC<IUserCardProps> = ({ socket, view, updateView, playerId }): JSX.Element => {
  const [isPlayer, setIsPlayer] = useState<boolean | undefined>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [closing, setClosing] = useState<boolean>(false);
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

interface ICardContentProps {
  socket: any;
  socketId: string;
  isPlayer: boolean | undefined;
}

const CardContent: React.FC<ICardContentProps> = ({ socket, socketId, isPlayer }): JSX.Element => {
  const { userList } = useContext(UsersContext);
  const { outfit } = userList[socketId];
  return (
    <div className={styles.CardContent}>
      <h2>{socketId.slice(0, 5)}</h2>
      <div>
        <CardAvatar>
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

const CardAvatar: React.FC = ({ children }): JSX.Element => {
  return (
    <div className={styles.CardAvatar}>
      {children}
    </div>
  );
}

const CardDescription: React.FC = ({ children }): JSX.Element => {
  return (
    <div className={styles.CardDescription}>
      {children}
    </div>
  );
}

interface IWardrobeProps {
  socket: any;
  socketId: string;
  outfit: any;
}

const Wardrobe: React.FC<IWardrobeProps> = ({ socket, socketId, outfit }): JSX.Element => {
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

const UserDescription: React.FC = (): JSX.Element => {
  return (
    <div></div>
  );
}

export default UserCard;