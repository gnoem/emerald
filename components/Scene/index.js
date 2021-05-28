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
      socket.emit('a user spawned', {
        socketId: playerId,
        room: roomName
      });
    }
    return <button onClick={switchToRoom}>{roomName}</button>;
  });
  return (
    <div className={styles.Scene}>
      <Title />
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
  const { portalZones, setPortalZones, collisionZones, setCollisionZones } = useContext(MapContext);
  const [objectsRef, setObjectsRef] = useState({});
  const [mapIsLoaded, setMapIsLoaded] = useState(false);
  const updateObjectsRef = (name, element) => {
    setObjectsRef(prevObjects => ({
      ...prevObjects,
      [name]: element
    }));
  }
  useEffect(() => {
    setMapIsLoaded(false);
    setObjectsRef({});
    setCollisionZones({});
    setPortalZones({});
  }, [room]);
  useEffect(() => {
    const element = userInstances[playerId];
    if (element) {
      console.log(`setting element to hidden`);
      element.setAttribute('data-hidden', 'true');
    }
  }, [room, userInstances, playerId]);
  useEffect(() => {
    const { position } = userList[playerId];
    const element = userInstances[playerId];
    if (mapIsLoaded) {
      element.setAttribute('data-hidden', 'false');
      const randomPosition = getSpawnPosition(ref.current, objectsRef);
      socket.emit('a user moved', {
        socketId: playerId,
        position: position?.portal?.spawnLocation ?? randomPosition,
        orientation: 'S'
      });
      setMapIsLoaded(false);
    }
  }, [playerId, mapIsLoaded, objectsRef]);
  useEffect(() => {
    if (!ref.current || !userInstances[playerId] || !socket) return;
    const handleClick = (e) => moveUser(e, { socket, playerId, room, view, userInstances, ref, collisionZones, portalZones });
    ref.current.addEventListener('click', handleClick);
    return () => ref.current?.removeEventListener('click', handleClick);
  }, [socket, view, room, userList, playerId, collisionZones, ref.current]);
  return (
    <div className={`${styles.Canvas} ${(view.user && !view.selfDestruct) ? styles.dim : ''}`} ref={ref}>
      <Map {...{
        room,
        updateMapIsLoaded: setMapIsLoaded,
        objectsRef,
        updateObjectsRef
      }} />
      {children}
    </div>
  );
});

export default Scene;