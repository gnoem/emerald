import React, { useContext, useEffect, useState } from "react";
import { rooms } from "../../config";
import { MapContext } from "../../contexts";
import { arraysAreEqual } from "../../utils";
import styles from "./map.module.css";

const Map = ({ children, room, objectsRef }) => {
  const [ready, setReady] = useState(false);
  const objectsList = rooms[room]?.objects;
  const mapObjects = objectsList.map(obj => {
    return <MapObject key={obj} name={obj} objectsRef={objectsRef} ref={(el) => objectsRef.current[obj] = el} />;
  });
  useEffect(() => {
    objectsRef.current = {};
    setReady(true);
  }, [room]);
  useEffect(() => {
    const loadedObjects = Object.keys(objectsRef.current);
    if (arraysAreEqual(objectsList, loadedObjects)) {
      //setMapIsLoaded(true);
      // NOW user can spawn
    }
  }, [Object.keys(objectsRef.current)]);
  if (!objectsList) {
    console.warn(`room "${room}" not configured!`);
    return null;
  }
  return (
    <div className={styles.Map}>
      <button className="test" onClick={() => console.dir(objectsRef.current)}><span>click here</span></button>
      {ready && mapObjects}
      {children}
    </div>
  );
}

const MapObject = React.forwardRef(({ name, objectsRef }, objectRef) => {
  const [zIndex, setZIndex] = useState(null);
  const [collisionZone, setCollisionZone] = useState(null);
  const { collisionZones } = useContext(MapContext);
  const config = {
    townhall: [70, 300, 0.3], // [top, left, collision zone height relative to object]
    mossyhouse: [170, 60, 0.2],
    wishingwell: [250, 350, 0.4],
    witchshack: [50, 351, 0.2]
  }
  useEffect(() => {
    if (!config[name] || !objectRef.current?.scrollHeight) return;
    setZIndex(config[name][0] + objectRef.current.scrollHeight);
  }, [name, objectRef.current?.scrollHeight]);
  useEffect(() => {
    if (!objectRef.current?.scrollHeight) return;
    let { top: objectTop, left: objectLeft } = objectRef.current.style;
    const { scrollWidth, scrollHeight } = objectRef.current;
    objectTop = parseInt(objectTop);
    objectLeft = parseInt(objectLeft);
    const heightFactor = config[name][2];
    const [top, left, width, height] = [
      objectTop + (scrollHeight * (1 - heightFactor)),
      objectLeft,
      scrollWidth,
      scrollHeight * heightFactor
    ]
    const createReference = (element) => {
      collisionZones[name] = element;
      objectsRef.current[name] = { top, left, width, height };
    }
    const collisionZoneElement = (
      <img style={{
        top: `${top}px`,
        left: `${left}px`,
        width: `${width}px`,
        height: `${height}px`
      }} ref={createReference} />
    );
    setCollisionZone(collisionZoneElement);
  }, [objectRef.current?.scrollHeight, objectsRef.current]);
  if (!config[name]) return null;
  return (
    <>
      <img src={`/assets/map/${name}.png`} style={{
        top: `${config[name][0]}px`,
        left: `${config[name][1]}px`,
        zIndex: `${zIndex}`
      }} ref={objectRef} />
      {collisionZone}
    </>
  );
})

export default Map;