import React, { useContext, useEffect } from "react";
import { rooms } from "../../config";
import { MapContext, MapContextProvider } from "../../contexts";
import { getDistanceBetween, getOrientation } from "../../utils";
import Chat from "../Chat";
import Map from "../Map";
import Title from "../Title";
import UserCard from "../UserCard";

import styles from "./scene.module.css";

const Scene = React.forwardRef(({ children, room, socket, userList, userInstances, playerId, view, updateView }, ref) => {
  const switchRooms = Object.keys(rooms).map(roomName => {
    if (roomName === room) return null;
    const switchToRoom = () => {
      socket.emit('a user switched rooms', {
        socketId: playerId,
        room: roomName
      });
    }
    return <button onClick={switchToRoom}>{roomName}</button>;
  });
  return (
    <div className={styles.Scene}>
      <Title />
      {switchRooms}
      <MapContextProvider>
        <Canvas {...{ socket, room, view, userList, userInstances, playerId, ref }}>
          {children}
        </Canvas>
      </MapContextProvider>
      <Chat {...{ socket, playerId }} />
      <UserCard {...{ socket, view, updateView, playerId }} />
    </div>
  );
});

const Canvas = React.forwardRef(({ children, socket, room, view, userList, userInstances, playerId }, ref) => {
  const { collisionZones } = useContext(MapContext);
  useEffect(() => {
    if (!ref.current || !playerId || !socket) return;
    const moveUser = (e) => {
      if (Object.entries(view).length) return;
      if (e.target.closest('[class*=Chat] *')) return;
      if (e.target.closest('button')) return;
      if (e.target.closest('[class*=User] *')) return;
      if (e.target.closest('[class*=UserCard] *')) return;
      const { clientX, clientY } = e;
      const { left: canvasLeft, top: canvasTop } = ref.current.getBoundingClientRect();
      let position = {
        x: (clientX - canvasLeft),
        y: (clientY - canvasTop)
      }
      // need to base prev coords on user element's coords AT TIME OF CLICK
      let prevPosition = userInstances[playerId].getBoundingClientRect();
      prevPosition = {
        x: prevPosition.x - canvasLeft,
        y: prevPosition.y - canvasTop
      }
      const orientation = getOrientation(prevPosition.x, prevPosition.y, position.x, position.y);
      // todo: check for collisions - look at what objects are inside the map and check to see if they lie in the user's projected path
      // if so, adjust position so that the projected path ends at the collision object's boundary
      const preventCollision = () => {
        const collisionPoint = () => { // will return { x, y } coordinates if collision
          // loop through solid objects - for each, get top, left, right, bottom;
          // get 4 lines, N boundary, E boundary, S boundary, W boundary and determine a Forbidden Range for each
          const objectBoundaries = Object.entries(collisionZones).map(([name, element]) => {
            if (!element) return null;
            let { top: originalTop, bottom: originalBottom, left: originalLeft, right: originalRight } = element.getBoundingClientRect();
            const [width, height] = [originalRight - originalLeft, originalBottom - originalTop];
            const top = originalTop - canvasTop;
            const bottom = top + height;
            const left = originalLeft - canvasLeft;
            const right = left + width;
            return {
              [`${name}-N`]: [{ x: left, y: top }, { x: right, y: top }],
              [`${name}-E`]: [{ x: right, y: top }, { x: right, y: bottom }],
              [`${name}-S`]: [{ x: right, y: bottom }, { x: left, y: bottom }],
              [`${name}-W`]: [{ x: left, y: bottom }, { x: left, y: top }]
            }
          }).filter(el => el);
          const collisionPoints = Object.values(objectBoundaries).map(boundaries => {
            return Object.entries(boundaries).map(([boundaryName, points]) => {
              const [p1, p0] = points;
              const boundary = {
                x: p1.x - p0.x,
                y: p1.y - p0.y
              }
              const path = {
                x: prevPosition.x - position.x,
                y: prevPosition.y - position.y
              }
              const s = (-boundary.y * (p0.x - position.x) + boundary.x * (p0.y - position.y)) / (-path.x * boundary.y + boundary.x * path.y);
              const t = (path.x * (p0.y - position.y) - path.y * (p0.x - position.x)) / (-path.x * boundary.y + boundary.x * path.y);
              const getPadding = () => { // this is to prevent getting "stuck" on the boundary line
                const direction = boundaryName.split('-')[1];
                switch (direction) {
                  case 'N': return { x: 0, y: -1 };
                  case 'E': return { x: 1, y: 0 };
                  case 'S': return { x: 0, y: 1 };
                  case 'W': return { x: -1, y: 0 };
                }
              }
              if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
                return { // point of intersection
                  boundaryName,
                  x: p0.x + (t * boundary.x) + getPadding().x,
                  y: p0.y + (t * boundary.y) + getPadding().y
                }
              }
              return null;
            });
          }).flat().filter(el => el);
          const showCollisionPoints = () => {
            collisionPoints.forEach(point => {
              const div = document.createElement('div');
              div.className = `${styles.collisionPoint} ${point.boundaryName}` //.add(styles.collisionPoint);
              console.log(point);
              div.style.top = `${point.y}px`;
              div.style.left = `${point.x}px`;
              div.addEventListener('click', () => {
                console.log(Object.values(objectBoundaries).find(element => element.boundaryName === point.boundaryName));
              });
              ref.current.appendChild(div);
            });
          }
          const closestCollisionPoint = () => {
            const distances = collisionPoints.map(point => {
              return getDistanceBetween(prevPosition.x, prevPosition.y, point.x, point.y);
            });
            distances.sort((a, b) => a - b);
            const shortestDistance = distances[0];
            const closestPoint = collisionPoints.find(point => {
              return getDistanceBetween(prevPosition.x, prevPosition.y, point.x, point.y) === shortestDistance;
            })
            return closestPoint;
          }
          //showCollisionPoints();
          return closestCollisionPoint();
        }
        if (collisionPoint()) {
          position = collisionPoint();
        }
      }
      preventCollision();
      // todo also? check if currently on top of a boundary line and prevent movement in opposite direction (e.g. if on top of S boundary, prevent moving N)
      socket.emit('a user moved', {
        socketId: playerId,
        position,
        orientation
      });
    }
    ref.current.addEventListener('click', moveUser);
    return () => ref.current?.removeEventListener('click', moveUser);
  }, [socket, view, userList, playerId, collisionZones, ref.current]);
  return (
    <div className={`${styles.Canvas} ${(view.user && !view.selfDestruct) ? styles.dim : ''}`} ref={ref}>
      <Map room={room} />
      {children}
    </div>
  );
});

export default Scene;