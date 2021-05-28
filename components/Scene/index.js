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
  const [mapIsLoaded, setMapIsLoaded] = useState(false);
  const [loadingScreen, setLoadingScreen] = useState(true);
  useEffect(() => {
    if (mapIsLoaded) {
      setTimeout(() => {
        setLoadingScreen(false);
      }, 1000);
    } else {
      setLoadingScreen(true);
    }
  }, [mapIsLoaded]);
  return (
    <div className={`${styles.Scene} ${loadingScreen ? styles.loading : ''}`}>
      <Title />
      <MapContextProvider>
        <Canvas {...{ socket, room, view, userList, userInstances, playerId, ref, mapIsLoaded, updateMapIsLoaded: setMapIsLoaded }}>
          {children}
        </Canvas>
      </MapContextProvider>
      <Chat {...{ socket, playerId }} />
      <UserCard {...{ socket, view, updateView, playerId }} />
      {loadingScreen && <MapLoading />}
    </div>
  );
});

const Canvas = React.forwardRef(({ children, socket, room, view, userList, userInstances, playerId, mapIsLoaded, updateMapIsLoaded }, ref) => {
  const { portalZones, setPortalZones, collisionZones, setCollisionZones } = useContext(MapContext);
  const [objectsRef, setObjectsRef] = useState({});
  const updateObjectsRef = (name, element) => {
    setObjectsRef(prevObjects => ({
      ...prevObjects,
      [name]: element
    }));
  }
  useEffect(() => {
    updateMapIsLoaded(false);
    setObjectsRef({});
    setCollisionZones({});
    setPortalZones({});
  }, [room]);
  useEffect(() => {
    const { position } = userList[playerId];
    if (mapIsLoaded) {
      const randomPosition = getSpawnPosition(ref.current, objectsRef);
      socket.emit('a user moved', {
        socketId: playerId,
        position: position?.portal?.spawnLocation ?? randomPosition,
        orientation: 'S'
      });
      //updateMapIsLoaded(false); // why? so that this useEffect doesnt run like a bunch of times? seems fine to leave it off
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
        updateMapIsLoaded,
        objectsRef,
        updateObjectsRef
      }} />
      {children}
    </div>
  );
});

const MapLoading = () => {
  return (
    <div className={styles.MapLoading}>
      loading...
    </div>
  );
}

export default Scene;