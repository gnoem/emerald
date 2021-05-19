import { useEffect, useRef } from "react";
import { useOrientation } from "../../hooks";

import styles from "./scene.module.css";

const Scene = ({ children, socket, userList, userInstances, playerId }) => {
  const sceneRef = useRef(null);
  useEffect(() => {
    if (!sceneRef.current || !playerId || !socket) return;
    const getCoords = (e) => {
      const { clientX, clientY } = e;
      const { x, y } = sceneRef.current.getBoundingClientRect();
      const position = {
        x: clientX - y,
        y: clientY - x
      }
      // need to base prev coords on user element's coords AT TIME OF CLICK
      const prevPosition = userInstances.current[playerId].getBoundingClientRect();
      const orientation = useOrientation(prevPosition.x, prevPosition.y, position.x, position.y);
      socket.emit('a user moved', {
        socketId: playerId,
        position,
        orientation
      });
    }
    sceneRef.current.addEventListener('click', getCoords);
    return () => sceneRef.current?.removeEventListener('click', getCoords);
  }, [socket, userList, playerId, sceneRef.current]);
  return (
    <div className={styles.Scene} ref={sceneRef}>
      {children}
    </div>
  );
}

export default Scene;