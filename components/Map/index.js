import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { rooms } from "../../config";
import { MapContext } from "../../contexts";
import { useClientRect } from "../../hooks";
import { arraysAreEqual } from "../../utils";
import styles from "./map.module.css";

const Map = ({ children, room, objectsRef, clearObjectsRef }) => { // objectsRef should be array of elements
  const [ready, setReady] = useState(false);
  const objectsList = rooms[room]?.objects;
  const mapObjects = objectsList.map(obj => {
    return <MapObject {...{
      key: obj,
      name: obj
    }} />;
  });
  useEffect(() => {
    clearObjectsRef();
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

const MapObject = ({ name }) => {
  const [rect, setRect] = useState(null);
  const [zIndex, setZIndex] = useState(-1);
  const [collisionZone, setCollisionZone] = useState(null);
  const { setCollisionZones } = useContext(MapContext);
  const objectRef = useRef(null);
  const config = {
    townhall: [70, 300, 0.3], // [top, left, collision zone height relative to object]
    mossyhouse: [170, 60, 0.2],
    wishingwell: [250, 350, 0.4],
    witchshack: [50, 351, 0.2]
  }
  useEffect(() => {
    if (!config[name] || !rect) return;
    setZIndex(Math.round(config[name][0] + rect.height - 12)); // 12 is approx half of avatar height but maybe todo better
  }, [rect]);
  useEffect(() => {
    if (!rect?.height) return;
    let { top: objectTop, left: objectLeft } = objectRef.current?.style;
    const { width: objectWidth, height: objectHeight } = rect;
    objectTop = parseInt(objectTop);
    objectLeft = parseInt(objectLeft);
    const heightFactor = config[name][2];
    const [top, left, width, height] = [
      objectTop + (objectHeight * (1 - heightFactor)),
      objectLeft,
      objectWidth,
      objectHeight * heightFactor
    ]
    const createReference = (element) => {
      setCollisionZones(prevZones => ({
        ...prevZones,
        [name]: element
      }));
    }
    const collisionZoneElement = (
      <div className={styles.collision} style={{
        top: `${top}px`,
        left: `${left}px`,
        width: `${width}px`,
        height: `${height}px`
      }} ref={createReference} />
    );
    setCollisionZone(collisionZoneElement);
  }, [rect?.height]);
  if (!config[name]) return null;
  return (
    <>
      <img src={`/assets/map/${name}.png`} style={{
        top: `${config[name][0]}px`,
        left: `${config[name][1]}px`,
        zIndex: `${zIndex}`
      }} ref={objectRef} onLoad={() => setRect(objectRef.current?.getBoundingClientRect())} />
      {collisionZone}
    </>
  );
}

export default Map;