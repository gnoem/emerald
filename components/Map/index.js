import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { rooms } from "../../config";
import { MapContext } from "../../contexts";
import { arraysAreEqual } from "../../utils";
import styles from "./map.module.css";

const Map = ({ children, room, updateMapIsLoaded, objectsRef, updateObjectsRef }) => {
  const [loadObjects, setLoadObjects] = useState(false);
  const { objects: objectsList, portals: portalsList } = rooms[room];
  const mapObjects = objectsList.map(obj => {
    return <MapObject {...{
      key: obj,
      name: obj,
      objectsRef,
      updateObjectsRef
    }} />;
  });
  const mapPortals = portalsList.map(portal => (
    <MapPortal {...{ room, portal }} />
  ));
  useEffect(() => {
    setLoadObjects(false);
  }, [room]);
  useEffect(() => {
    if (Object.keys(objectsRef).length === 0) { // triggered by room change useEffect
      setLoadObjects(true); // objectsRef has been cleared and is ready to receive objects for this room
    }
  }, [Object.keys(objectsRef).length]);
  useEffect(() => {
    const loadedObjectNames = Object.keys(objectsRef);
    const loadedObjects = Object.values(objectsRef);
    if (arraysAreEqual(objectsList, loadedObjectNames)) {
      // not ready until null values have been replaced with elements:
      if (loadedObjects.every(el => el)) { // herbie fully loaded
        console.log('herbie fully loaded');
        updateMapIsLoaded(true);
        // NOW user can spawn!!!!!!
      }
    }
  }, [objectsRef]);
  if (!objectsList) {
    console.warn(`room "${room}" not configured!`);
    return null;
  }
  return (
    <div className={styles.Map}>
      {loadObjects && mapObjects}
      {loadObjects && mapPortals}
      {children}
    </div>
  );
}

const mapObjectConfig = {
  townhall: [70, 300, 0.3], // [top, left, collision zone height relative to object]
  mossyhouse: [100, 100, 0.6],
  wishingwell: [250, 350, 0.4],
  witchshack: [50, 351, 0.2]
}

const MapObject = ({ name, objectsRef, updateObjectsRef }) => {
  const [rect, setRect] = useState(null);
  const [zIndex, setZIndex] = useState(-1);
  const objectRef = useRef(null);
  const handleLoad = () => {
    setRect(objectRef.current?.getBoundingClientRect());
    if (!objectsRef[name]) updateObjectsRef(name, objectRef.current);
  }
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
      }} ref={objectRef} onLoad={handleLoad} />
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

const MapPortal = ({ room, portal }) => {
  const portalZoneRef = useRef(null);
  const { setPortalZones } = useContext(MapContext);
  useEffect(() => {
    const element = portalZoneRef.current;
    if (element) {
      setPortalZones(prevZones => ({
        ...prevZones,
        [portal.to]: element
      }));
    }
  }, [portalZoneRef.current]);
  const getPortalStyle = useCallback(() => {
    const { top, bottom, left, right, size } = portal;
    const portalStyle = {
      width: `${size[0]}px`,
      height: `${size[1]}px`,
    }
    if (top != null) portalStyle.top = `${top}px`;
    if (bottom != null) portalStyle.bottom = `${bottom}px`;
    if (left != null) portalStyle.left = `${left}px`;
    if (right != null) portalStyle.right = `${right}px`;
    return portalStyle;
  }, [portal]);
  return (
    <div className={styles.portal} style={getPortalStyle()} ref={portalZoneRef}></div>
  );
}

export default Map;