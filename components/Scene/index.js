import React, { useContext, useEffect } from "react";
import { MapContext, MapContextProvider } from "../../contexts";
import { getDistanceBetween, getOrientation } from "../../utils";
import Chat from "../Chat";
import Title from "../Title";
import UserCard from "../UserCard";
import loadMap from "./loadMap";

import styles from "./scene.module.css";

const Scene = React.forwardRef(({ children, socket, userList, userInstances, playerId, view, updateView }, ref) => {
  return (
    <div className={styles.Scene}>
      <Title />
      <MapContextProvider>
        <Canvas {...{ socket, view, userList, userInstances, playerId, ref }}>
          {loadMap['town']}
          {children}
        </Canvas>
      </MapContextProvider>
      <Chat {...{ socket, playerId }} />
      <UserCard {...{ socket, view, updateView, playerId }} />
    </div>
  );
});

const Canvas = React.forwardRef(({ children, socket, view, userList, userInstances, playerId }, ref) => {
  const { mapObjects } = useContext(MapContext);
  useEffect(() => {
    if (!ref.current || !playerId || !socket) return;
    const moveUser = (e) => {
      if (Object.entries(view).length) return;
      if (e.target.closest('[class*=Chat] *')) return;
      if (e.target.closest('[class*=User] *')) return;
      if (e.target.closest('[class*=UserCard] *')) return;
      const { clientX, clientY } = e;
      const { left: canvasLeft, top: canvasTop, right: canvasRight, bottom: canvasBottom } = ref.current.getBoundingClientRect();
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
          const objectBoundaries = Object.entries(mapObjects).map(([name, element]) => {
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
          });
          const collisionPoints = Object.values(objectBoundaries).map(boundaries => {
            return Object.entries(boundaries).map(([boundaryName, points]) => {
              const [p1, p0] = points;
              const s1 = {
                x: p1.x - p0.x,
                y: p1.y - p0.y
              }
              const s2 = {
                x: prevPosition.x - position.x,
                y: prevPosition.y - position.y
              }
              const s = (-s1.y * (p0.x - position.x) + s1.x * (p0.y - position.y)) / (-s2.x * s1.y + s1.x * s2.y);
              const t = (s2.x * (p0.y - position.y) - s2.y * (p0.x - position.x)) / (-s2.x * s1.y + s1.x * s2.y);
              if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
                return {
                  boundaryName,
                  x: p0.x + (t * s1.x),
                  y: p0.y + (t * s1.y)
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
          return closestCollisionPoint();
        }
        if (collisionPoint()) {
          position = collisionPoint();
        }
      }
      preventCollision();
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