import { useEffect, useRef } from "react";
import { getOrientation } from "../../utils";
import Chat from "../Chat";
import Title from "../Title";

import styles from "./scene.module.css";

const Scene = ({ children, socket, userList, userInstances, playerId }) => {
  const sceneRef = useRef(null);
  useEffect(() => {
    if (!sceneRef.current || !playerId || !socket) return;
    const moveUser = (e) => {
      if (e.target.closest('[class*=Chat] *')) return;
      const { clientX, clientY } = e;
      const { x, y } = sceneRef.current.getBoundingClientRect();
      const position = {
        x: clientX - y,
        y: clientY - x
      }
      // need to base prev coords on user element's coords AT TIME OF CLICK
      const prevPosition = userInstances.current[playerId].getBoundingClientRect();
      const orientation = getOrientation(prevPosition.x, prevPosition.y, position.x, position.y);
      // need to wait for transition duration to be set, THEN user can start moving
      socket.emit('a user moved', {
        socketId: playerId,
        position,
        orientation
      });
    }
    sceneRef.current.addEventListener('click', moveUser);
    return () => sceneRef.current?.removeEventListener('click', moveUser);
  }, [socket, userList, playerId, sceneRef.current]);
  return (
    <div className={styles.Scene} ref={sceneRef}>
      <Title />
      {children}
      <Chat />
    </div>
  );
}

export default Scene;