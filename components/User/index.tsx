import React, { useEffect, useState } from "react";
import { usePrevious } from "../../hooks";
import { getOrientation } from "../../utils";
import Avatar from "../Avatar";
import { handleMovement } from "./logic";
import styles from "./user.module.css";

interface IUserProps extends React.HTMLProps<HTMLDivElement> {
  socket: any;
  socketId: string;
  playerId: string;
  scene: any;
  room: any;
  userInstances: any; // array
  userData: any; // obj
  viewUserCard: any; // function
}

const User = React.forwardRef<HTMLDivElement, IUserProps>(({ socket, socketId, playerId, scene, room, userInstances, userData, viewUserCard }, ref) => {
  const isPlayer = playerId === socketId;
  const { position, orientation: givenOrientation = 'S', outfit, message, timestamp } = userData;
  const [elementStyle, setElementStyle] = useState(null);
  const [orientation, setOrientation] = useState(null);
  const [isMoving, setIsMoving] = useState(false);
  const [movementTimeout, setMovementTimeout] = useState(null);
  const [portalTimeout, setPortalTimeout] = useState(null);
  const prevPosition = usePrevious(position);
  const element = userInstances[socketId];
  useEffect(() => setOrientation(givenOrientation), [givenOrientation]);
  useEffect(() => {
    setIsMoving(false);
    setOrientation('S');
    clearTimeout(movementTimeout);
    clearTimeout(portalTimeout);
  }, [room]);
  useEffect(() => {
    if (!position || !element || !scene) return;
    const didntMove = (prevPosition?.x === position.x) && (prevPosition?.y === position.y);
    if (!prevPosition || didntMove) {
      if (!elementStyle) {
        setElementStyle({
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          zIndex: `${Math.round(position.y)}`
        });
      }
      return;
    }
    const { actuallyMoved, elementProps, transitionDuration } = handleMovement(element, { prevPosition, position }, scene);
    setElementStyle(elementProps);
    if (actuallyMoved) {
      if (movementTimeout) clearTimeout(movementTimeout);
      if (portalTimeout) clearTimeout(portalTimeout);
      setIsMoving(true);
      setMovementTimeout(setTimeout(() => {
        setIsMoving(false);
      }, transitionDuration * 1000));
    }
    if (position.portal) {
      if (portalTimeout) clearTimeout(portalTimeout);
      setPortalTimeout(setTimeout(() => {
        socket.emit('a user switched rooms', {
          socketId,
          room: position.portal.roomName,
          position: position.portal.spawnLocation
        });
      }, (transitionDuration * 1000) - 50));
    }
  }, [prevPosition, position, scene]);
  useEffect(() => {
    if (!element) return;
    const checkOrientation = (e) => {
      if (!isPlayer || isMoving) return;
      const { clientX, clientY } = e;
      const { top, left, width, height } = element.getBoundingClientRect();
      const x = left + (width / 2);
      const y = top + (height / 2);
      const [dx, dy] = [Math.abs(clientX - x), Math.abs(clientY - y)];
      if ((dx < 30) && (dy < 30)) return;
      setOrientation(getOrientation(x, y, clientX, clientY));
    }
    window.addEventListener('mousemove', checkOrientation);
    return () => window.removeEventListener('mousemove', checkOrientation);
  }, [isMoving, element]);
  return (
    <div
      className={styles.User}
      data-self={isPlayer}
      style={elementStyle}
      ref={ref}>
        {message && <span className={styles.userMessage} style={{ zIndex: timestamp }}>{message}</span>}
        <span className={styles.userAvatar} onClick={viewUserCard}>
          <Avatar {...{ orientation, outfit, socketId, isMoving }} />
        </span>
        <span className={styles.userLabel}>{socketId.slice(0, 5)}</span>
    </div>
  );
});

export default User;