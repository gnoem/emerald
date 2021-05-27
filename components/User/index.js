import React, { useEffect, useState } from "react";
import { usePrevious } from "../../hooks";
import { getOrientation } from "../../utils";
import Avatar from "../Avatar";
import { handleMovement } from "./logic";
import styles from "./user.module.css";

const User = React.forwardRef(({ socketId, scene, room, userInstances, userData, isPlayer, viewUserCard }, ref) => {
  const { position, orientation: givenOrientation = 'S', outfit, message, timestamp } = userData;
  const [orientation, setOrientation] = useState(null);
  const [isMoving, setIsMoving] = useState(false);
  const [transitionTimeout, setTransitionTimeout] = useState(null);
  const prevPosition = usePrevious(position);
  const element = userInstances[socketId];
  useEffect(() => setOrientation(givenOrientation), [givenOrientation]);
  useEffect(() => {
    setIsMoving(false);
    setOrientation('S');
    clearTimeout(transitionTimeout);
  }, [room]);
  useEffect(() => {
    if (!position || !element || !scene) return;
    const { actuallyMoved, elementProps, transitionDuration } = handleMovement(element, { prevPosition, position }, scene);
    Object.assign(element.style, elementProps);
    if (actuallyMoved) {
      if (transitionTimeout) clearTimeout(transitionTimeout);
      setIsMoving(true);
      setTransitionTimeout(setTimeout(() => {
        setIsMoving(false);
      }, transitionDuration * 1000));
    }
  }, [prevPosition, position, element, scene]);
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