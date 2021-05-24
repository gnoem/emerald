import React, { useEffect } from "react";
import { getOrientation } from "../../utils";
import Chat from "../Chat";
import Title from "../Title";
import UserCard from "../UserCard";
import loadMap from "./loadMap";

import styles from "./scene.module.css";

const Scene = React.forwardRef(({ children, socket, userList, userInstances, playerId, view, updateView }, ref) => {
  return (
    <div className={styles.Scene}>
      <Title />
      <Canvas {...{ socket, view, userList, userInstances, playerId, ref }}>
        {loadMap['town']}
        {children}
      </Canvas>
      <Chat {...{ socket, playerId }} />
      <UserCard {...{ socket, view, updateView, playerId }} />
    </div>
  );
});

const Canvas = React.forwardRef(({ children, socket, view, userList, userInstances, playerId }, ref) => {
  useEffect(() => {
    if (!ref.current || !playerId || !socket) return;
    const moveUser = (e) => {
      if (Object.entries(view).length) return;
      if (e.target.closest('[class*=Chat] *')) return;
      if (e.target.closest('[class*=User] *')) return;
      if (e.target.closest('[class*=UserCard] *')) return;
      const { clientX, clientY } = e;
      const { x, y } = ref.current.getBoundingClientRect();
      let position = {
        x: (clientX - x),
        y: (clientY - y)
      }
      // need to base prev coords on user element's coords AT TIME OF CLICK
      let prevPosition = userInstances[playerId].getBoundingClientRect();
      prevPosition = {
        x: prevPosition.x - x,
        y: prevPosition.y - y
      }
      // todo: check for collisions - look at what objects are inside the map and check to see if they lie in the user's projected path
      // if so, adjust position so that the projected path ends at the collision object's boundary
      const preventCollision = () => {
        const collisionPoint = () => { // returns { x, y } coordinates if collision
          return null;
        }
        if (collisionPoint()) {
          position = collisionPoint();
        }
      }
      preventCollision();
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
  }, [socket, view, userList, playerId, ref.current]);
  return (
    <div className={`${styles.Canvas} ${(view.user && !view.selfDestruct) ? styles.dim : ''}`} ref={ref}>
      {children}
    </div>
  );
});

export default Scene;