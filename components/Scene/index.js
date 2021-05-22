import React, { useEffect, useRef, useState } from "react";
import { getOrientation } from "../../utils";
import Chat from "../Chat";
import Title from "../Title";
import UserCard from "../UserCard";

import styles from "./scene.module.css";

const Scene = React.forwardRef(({ children, socket, userList, userInstances, playerId, viewingUser, updateViewingUser }, ref) => {
  return (
    <div className={styles.Scene}>
      <Title />
      <Canvas {...{ socket, viewingUser, userList, userInstances, playerId, ref }}>
        <img src="/assets/map/town.png" className={styles.map} />
        {children}
      </Canvas>
      <Chat {...{ socket, playerId }} />
      <UserCard {...{ user: viewingUser, updateViewingUser }} />
    </div>
  );
});

const Canvas = React.forwardRef(({ children, socket, viewingUser, userList, userInstances, playerId }, ref) => {
  useEffect(() => {
    if (!ref.current || !playerId || !socket) return;
    const moveUser = (e) => {
      if (viewingUser) return;
      if (e.target.closest('[class*=Chat] *')) return;
      if (e.target.closest('[class*=User] *')) return;
      if (e.target.closest('[class*=UserCard] *')) return;
      const { clientX, clientY } = e;
      const { x, y } = ref.current.getBoundingClientRect();
      const position = {
        x: (clientX - x),
        y: (clientY - y)
      }
      // need to base prev coords on user element's coords AT TIME OF CLICK
      let prevPosition = userInstances.current[playerId].getBoundingClientRect();
      prevPosition = {
        x: prevPosition.x - x,
        y: prevPosition.y - y
      }
      const orientation = getOrientation(prevPosition.x, prevPosition.y, position.x, position.y);
      //console.log(`moving player ${orientation} from (${prevPosition.x}, ${prevPosition.y}) to (${position.x}, ${position.y})`);
      // need to wait for transition duration to be set, THEN user can start moving
      socket.emit('a user moved', {
        socketId: playerId,
        position,
        orientation
      });
    }
    ref.current.addEventListener('click', moveUser);
    return () => ref.current?.removeEventListener('click', moveUser);
  }, [socket, viewingUser, userList, playerId, ref.current]);
  return (
    <div className={`${styles.Canvas} ${viewingUser ? styles.dim : ''}`} ref={ref}>
      {children}
    </div>
  );
});

export default Scene;