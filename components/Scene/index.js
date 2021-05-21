import React, { useEffect, useRef, useState } from "react";
import { getOrientation } from "../../utils";
import Chat from "../Chat";
import Title from "../Title";

import styles from "./scene.module.css";

const Scene = React.forwardRef(({ children, socket, userList, userInstances, playerId }, ref) => {
  useEffect(() => {
    if (!ref.current || !playerId || !socket) return;
    const moveUser = (e) => {
      if (e.target.closest('[class*=Chat] *')) return;
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
      // need to wait for transition duration to be set, THEN user can start moving
      socket.emit('a user moved', {
        socketId: playerId,
        position,
        orientation
      });
    }
    ref.current.addEventListener('click', moveUser);
    return () => ref.current?.removeEventListener('click', moveUser);
  }, [socket, userList, playerId, ref.current]);
  return (
    <div className={styles.Scene} ref={ref}>
      <Title />
      {children}
      <Chat {...{ socket, playerId }} />
    </div>
  );
});

export default Scene;