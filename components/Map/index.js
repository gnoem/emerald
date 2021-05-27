import React, { useContext, useEffect, useRef, useState } from "react";
import { rooms } from "../../config";
import { MapContext } from "../../contexts";
import { arraysAreEqual } from "../../utils";
import styles from "./map.module.css";

const Map = ({ children, room, objectsRef, clearObjectsRef }) => { // objectsRef should be array of elements
  const [ready, setReady] = useState(false);
  const { setCollisionZones } = useContext(MapContext);
  const objectsList = rooms[room]?.objects;
  const mapObjects = objectsList.map(obj => {
    return <MapObject {...{
      key: obj,
      name: obj
    }} />;
  });
  useEffect(() => {
    clearObjectsRef();
    setCollisionZones({});
    setReady(true);
  }, [room]);
  useEffect(() => {
    const loadedObjects = Object.keys(objectsRef);
    if (arraysAreEqual(objectsList, loadedObjects)) {
      //setMapIsLoaded(true);
      // NOW user can spawn
    }
  }, [Object.keys(objectsRef)]);
  if (!objectsList) {
    console.warn(`room "${room}" not configured!`);
    return null;
  }
  return (
    <div className={styles.Map}>
      {ready && mapObjects}
      {children}
    </div>
  );
}

const mapObjectConfig = {
  townhall: [70, 300, 0.3], // [top, left, collision zone height relative to object]
  mossyhouse: [170, 60, 0.6],
  wishingwell: [250, 350, 0.4],
  witchshack: [50, 351, 0.2]
}

const MapObject = ({ name }) => {
  const [rect, setRect] = useState(null);
  const [zIndex, setZIndex] = useState(-1);
  const objectRef = useRef(null);
  useEffect(() => {
    if (!mapObjectConfig[name] || !rect) return;
    setZIndex(Math.round(mapObjectConfig[name][0] + rect.height - 12)); // 12 is approx half of avatar height but maybe todo better
  }, [rect]);
  if (!mapObjectConfig[name]) return null;
  return (
    <>
      <img src={`/assets/map/${name}.png`} style={{
        top: `${mapObjectConfig[name][0]}px`,
        left: `${mapObjectConfig[name][1]}px`,
        zIndex: `${zIndex}`
      }} ref={objectRef} onLoad={() => setRect(objectRef.current?.getBoundingClientRect())} />
      {rect?.height && <CollisionZone {...{ name, object: objectRef.current, rect }} />}
    </>
  );
}

const CollisionZone = ({ name, object, rect }) => {
  const [{ top, left, width, height }, setRect] = useState({});
  const collisionZoneRef = useRef(null);
  const { setCollisionZones } = useContext(MapContext);
  useEffect(() => {
    let { top: objectTop, left: objectLeft } = object?.style;
    const { width: objectWidth, height: objectHeight } = rect;
    objectTop = parseInt(objectTop);
    objectLeft = parseInt(objectLeft);
    const heightFactor = mapObjectConfig[name][2];
    setRect({
      top: objectTop + (objectHeight * (1 - heightFactor)),
      left: objectLeft,
      width: objectWidth,
      height: objectHeight * heightFactor
    });
  }, []);
  useEffect(() => {
    const element = collisionZoneRef.current;
    if (element) {
      setCollisionZones(prevZones => ({
        ...prevZones,
        [name]: element
      }));
    }
  }, [collisionZoneRef.current]);
  return (
    <div className={styles.collision} style={{
      top: `${top}px`,
      left: `${left}px`,
      width: `${width}px`,
      height: `${height}px`
    }} ref={collisionZoneRef} />
  );
}

export default Map;