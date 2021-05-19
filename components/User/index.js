import { useEffect, useRef, useState } from "react";
import { useOrientation, usePrevious } from "../../hooks";
import Avatar from "../Avatar";
import styles from "./user.module.css";

const User = ({ socketId, position, orientation: givenOrientation, outfit, isPlayer }) => {
  const [orientation, setOrientation] = useState(null);
  const [isMoving, setIsMoving] = useState(false);
  const [transitionDuration, setTransitionDuration] = useState(null);
  const [transitionTimeout, setTransitionTimeout] = useState(null);
  const userRef = useRef(null);
  const prevPosition = usePrevious(position);
  useEffect(() => {
    setOrientation(givenOrientation ?? 'S');
  }, [givenOrientation]);
  useEffect(() => {
    if (!transitionDuration) return;
    if (transitionTimeout) clearTimeout(transitionTimeout);
    setIsMoving(true);
    setTransitionTimeout(setTimeout(() => {
      setIsMoving(false);
    }, transitionDuration * 1000));
  }, [transitionDuration]);
  useEffect(() => {
    if (!prevPosition || !position) return;
    const { x: prevX, y: prevY } = prevPosition;
    const { x, y } = position;
    if ((prevX === x) && (prevY === y)) return;
    const getDuration = () => {
      const [diffX, diffY] = [Math.abs(prevX - x), Math.abs(prevY - y)];
      const distance = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
      const speed = 70; // px per second
      const duration = distance / speed;
      return duration;
    }
    setTransitionDuration(getDuration());
  }, [position, prevPosition]);
  useEffect(() => {
    if (!userRef.current) return;
    const checkOrientation = (e) => {
      if (!isPlayer || isMoving) return;
      const { clientX, clientY } = e;
      const { top, left, width, height } = userRef.current.getBoundingClientRect();
      const x = left + (width / 2);
      const y = top + (height / 2);
      const [dx, dy] = [Math.abs(clientX - x), Math.abs(clientY - y)];
      if ((dx < 30) && (dy < 30)) return;
      setOrientation(useOrientation(x, y, clientX, clientY));
    }
    window.addEventListener('mousemove', checkOrientation);
    return () => window.removeEventListener('mousemove', checkOrientation);
  }, [isMoving, userRef.current]);
  return (
    <div
      className={styles.User}
      data-self={isPlayer}
      style={{
        transform: `translate3d(${position.x - 24}px, ${position.y - 24}px, 0)`,
        transitionDuration: `${transitionDuration}s`,
        zIndex: `${position.y}`
      }}
      ref={userRef}>
        <span className={styles.userAvatar}><Avatar {...{ orientation, outfit, socketId, isMoving }} /></span>
        <span className={styles.userLabel}>{socketId.slice(0, 5)}</span>
    </div>
  );
}

export default User;