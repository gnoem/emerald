import React, { useEffect, useState } from "react";
import { useOrientation } from "../../hooks";
import Avatar from "../Avatar";
import styles from "./user.module.css";

const User = React.forwardRef(({ socketId, userInstances, position, orientation: givenOrientation, outfit, isPlayer }, ref) => {
  const [orientation, setOrientation] = useState(null);
  const [isMoving, setIsMoving] = useState(false);
  const [transitionDuration, setTransitionDuration] = useState(null);
  const [transitionTimeout, setTransitionTimeout] = useState(null);
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
    if (!position) return;
    // prevPosition must be based on coords AT TIME OF CLICK
    const { x: prevX, y: prevY } = userInstances.current[socketId].getBoundingClientRect();
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
  }, [position]);
  useEffect(() => {
    const element = userInstances.current[socketId];
    if (!element) return;
    const checkOrientation = (e) => {
      if (!isPlayer || isMoving) return;
      const { clientX, clientY } = e;
      const { top, left, width, height } = element.getBoundingClientRect();
      const x = left + (width / 2);
      const y = top + (height / 2);
      const [dx, dy] = [Math.abs(clientX - x), Math.abs(clientY - y)];
      if ((dx < 30) && (dy < 30)) return;
      setOrientation(useOrientation(x, y, clientX, clientY));
    }
    window.addEventListener('mousemove', checkOrientation);
    return () => window.removeEventListener('mousemove', checkOrientation);
  }, [isMoving, userInstances.current]);
  return (
    <div
      className={styles.User}
      data-self={isPlayer}
      style={{
        transform: `translate3d(${position.x - 24}px, ${position.y - 24}px, 0)`,
        transitionDuration: `${transitionDuration}s`,
        zIndex: `${position.y}`
      }}
      ref={ref}>
        <span className={styles.userAvatar}><Avatar {...{ orientation, outfit, socketId, isMoving }} /></span>
        <span className={styles.userLabel}>{socketId.slice(0, 5)}</span>
    </div>
  );
});

export default User;