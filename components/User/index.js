import React, { useEffect, useRef, useState } from "react";
import { getOrientation } from "../../utils";
import Avatar from "../Avatar";
import styles from "./user.module.css";

const User = React.forwardRef(({ socketId, scene, userInstances, position, orientation: givenOrientation = 'S', outfit, message, isPlayer }, ref) => {
  const [orientation, setOrientation] = useState(null);
  const [isMoving, setIsMoving] = useState(false);
  const [transitionDuration, setTransitionDuration] = useState(null);
  const [transitionTimeout, setTransitionTimeout] = useState(null);
  const animationRef = useRef(null);
  const element = userInstances.current[socketId];
  useEffect(() => setOrientation(givenOrientation), [givenOrientation]);
  useEffect(() => {
    if (!transitionDuration) return;
    if (transitionTimeout) clearTimeout(transitionTimeout);
    setIsMoving(true);
    setTransitionTimeout(setTimeout(() => {
      setIsMoving(false);
      setTransitionDuration(null);
    }, transitionDuration * 1000));
  }, [transitionDuration]);
  useEffect(() => {
    if (!position || !element || !scene) return;
    // prevPosition must be based on coords AT TIME OF CLICK
    const { top, left } = element.getBoundingClientRect();
    const { prevX, prevY } = {
      prevX: left - scene.getBoundingClientRect().left,
      prevY: top - scene.getBoundingClientRect().top
    }
    const { x, y } = position;
    if ((prevX === x) && (prevY === y)) return;
    const getDuration = () => {
      if (!animationRef.current) return null; // prevent initial animation from 0, 0 to randomly generated x, y
      const [diffX, diffY] = [Math.abs(prevX - x), Math.abs(prevY - y)];
      const distance = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
      const speed = 70; // px per second
      const duration = distance / speed;
      return duration;
    }
    // first need to determine transition duration, THEN start moving
    setTransitionDuration(getDuration());
    const getAnimation = (time) => {
      element.style.transform = `translate3d(${position.x}px, ${position.y}px, 0)`;
      if (time < getDuration() * 1000) {
        requestAnimationFrame(getAnimation);
      }
    }
    animationRef.current = requestAnimationFrame(getAnimation);
    return () => cancelAnimationFrame(animationRef.current);
  }, [position, element, scene]);
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
      style={{
        transitionDuration: `${transitionDuration}s`,
        zIndex: `${position.y}`
      }}
      ref={ref}>
        {message && <span className={styles.userMessage}>{message}</span>}
        <span className={styles.userAvatar}><Avatar {...{ orientation, outfit, socketId, isMoving }} /></span>
        <span className={styles.userLabel}>{socketId.slice(0, 5)}</span>
    </div>
  );
});

export default User;