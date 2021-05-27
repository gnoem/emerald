import React, { useContext, useEffect, useState } from "react";
import { rooms } from "../../config";
import { MapContext, MapContextProvider } from "../../contexts";
import Chat from "../Chat";
import Map from "../Map";
import Title from "../Title";
import UserCard from "../UserCard";
import { getSpawnPosition, moveUser } from "./logic";

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
  const [objectsRef, setObjectsRef] = useState({});
  const [isReady, setIsReady] = useState(false);
  const updateObjectsRef = (name, element) => {
    setObjectsRef(prevObjects => ({
      ...prevObjects,
      [name]: element
    }));
  }
  const clearObjectsRef = () => setObjectsRef({});
  useEffect(() => {
    if (isReady) {
      const randomPosition = getSpawnPosition(ref.current, objectsRef);
      socket.emit('a user moved', {
        socketId: playerId,
        position: randomPosition,
        orientation: 'S'
      });
      setIsReady(false);
    }
  }, [isReady, objectsRef]);
  useEffect(() => {
    if (!ref.current || !userInstances[playerId] || !socket) return;
    const handleClick = (e) => moveUser(e, { socket, playerId, view, userInstances, ref, collisionZones });
    ref.current.addEventListener('click', handleClick);
    return () => ref.current?.removeEventListener('click', handleClick);
  }, [socket, view, userList, playerId, collisionZones, ref.current]);
  return (
    <div className={`${styles.Canvas} ${(view.user && !view.selfDestruct) ? styles.dim : ''}`} ref={ref}>
      <Map {...{
        room,
        updateIsReady: setIsReady,
        objectsRef,
        updateObjectsRef,
        clearObjectsRef
      }} />
      {children}
    </div>
  );
});

export default Scene;