import React, { useContext, useEffect, useState } from "react";
import { useRef } from "react";
import { MapContext, MapContextProvider } from "../../contexts";
import Chat from "../Chat";
import Map from "../Map";
import Title from "../Title";
import UserCard from "../UserCard";
import { getSpawnPosition, moveUser } from "./logic";

import styles from "./scene.module.css";

interface ISceneProps extends React.HTMLProps<HTMLDivElement> {
  room: any;
  socket: any;
  userList: any;
  userInstances: any;
  playerId: string;
  view: string;
  updateView: any;
}

const Scene = React.forwardRef<HTMLDivElement, ISceneProps>(({ children, room, socket, userList, userInstances, playerId, view, updateView }, ref) => {
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

interface ICanvasProps extends React.HTMLProps<HTMLDivElement> {
  room: any;
  socket: any;
  view: any;
  userList: any;
  userInstances: any;
  playerId: string;
  mapIsLoaded: boolean;
  updateMapIsLoaded: any;
}

const Canvas = React.forwardRef<HTMLDivElement, ICanvasProps>(({
  children, room, socket, view, userList, userInstances, playerId, mapIsLoaded, updateMapIsLoaded
}, ref) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const createCanvasRef = (node) => {
    canvasRef.current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      (ref as React.MutableRefObject<HTMLDivElement>).current = node;
    }
  }
  const { portalZones, setPortalZones, collisionZones, setCollisionZones } = useContext(MapContext);
  const [objectsRef, setObjectsRef] = useState({});
  const [loadObjects, setLoadObjects] = useState(false);
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
    setLoadObjects(true);
  }, [room]);
  useEffect(() => {
    const { position } = userList[playerId];
    if (mapIsLoaded) {
      const randomPosition = getSpawnPosition(canvasRef.current, objectsRef);
      socket.emit('a user moved', {
        socketId: playerId,
        position: position?.portal?.spawnLocation ?? randomPosition,
        orientation: 'S'
      });
      //updateMapIsLoaded(false); // why? so that this useEffect doesnt run like a bunch of times? seems fine to leave it off
    }
  }, [playerId, mapIsLoaded, objectsRef]);
  useEffect(() => {
    if (!canvasRef.current || !userInstances[playerId] || !socket) return;
    const handleClick = (e) => moveUser(e, { socket, playerId, room, view, userInstances, ref, collisionZones, portalZones });
    canvasRef.current.addEventListener('click', handleClick);
    return () => canvasRef.current?.removeEventListener('click', handleClick);
  }, [socket, view, room, userList, playerId, collisionZones, canvasRef.current]);
  return (
    <div className={`${styles.Canvas} ${(view.user && !view.selfDestruct) ? styles.dim : ''}`} ref={createCanvasRef}>
      <Map {...{
        room,
        updateMapIsLoaded,
        loadObjects,
        updateLoadObjects: setLoadObjects,
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