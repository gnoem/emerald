import React, { useEffect, useState } from "react";
import { usePrevious } from "../../hooks";
import { getOrientation } from "../../utils";
import Avatar from "../Avatar";
import styles from "./user.module.css";

const User = React.forwardRef(({ socketId, scene, userInstances, position, orientation: givenOrientation = 'S', outfit, message, timestamp, isPlayer, viewUserCard }, ref) => {
  const [orientation, setOrientation] = useState(null);
  const [isMoving, setIsMoving] = useState(false);
  const [transitionTimeout, setTransitionTimeout] = useState(null);
  const prevPosition = usePrevious(position);
  const element = userInstances.current[socketId];
  useEffect(() => setOrientation(givenOrientation), [givenOrientation]);
  useEffect(() => {
    if (!position || !element || !scene) return;
    const actuallyMoved = (prevPosition?.x !== position.x) || (prevPosition?.y !== position.y);
    // prevX and prevY are the user's coords AT TIME OF CLICK, including mid-translation (so not the same as prevPosition)
    const { top, left } = element.getBoundingClientRect();
    const { prevX, prevY } = {
      prevX: left - scene.getBoundingClientRect().left,
      prevY: top - scene.getBoundingClientRect().top
    }
    const { x, y } = position;
    if ((prevX === x) && (prevY === y)) return;
    const getDuration = () => {
      if (!actuallyMoved) return null;
      const [diffX, diffY] = [Math.abs(prevX - x), Math.abs(prevY - y)];
      const distance = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
      const speed = 40; // px per second
      const duration = distance / speed;
      return duration;
    }
    // first need to determine transition duration, THEN start moving
    element.style.transitionDuration = `${getDuration()}s`;
    element.style.zIndex = `${Math.round(position.y)}`; // should ideally be based on element.getBoundingClientRect() (relative to container)
    element.style.transform = `translate3d(${position.x}px, ${position.y}px, 0)`;
    if (actuallyMoved) {
      if (transitionTimeout) clearTimeout(transitionTimeout);
      setIsMoving(true);
      setTransitionTimeout(setTimeout(() => {
        setIsMoving(false);
      }, getDuration() * 1000));
    }
    //console.dir(`user ${socketId.slice(0, 5)} is moving ${orientation} from (${prevX}, ${prevY}) to (${position.x}, ${position.y})`);
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