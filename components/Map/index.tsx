import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { rooms } from "@config";
import { MapContext } from "@contexts";
import { arraysAreEqual } from "@utils";
import styles from "./map.module.css";

interface IMapProps {
  room: any;
  updateMapIsLoaded: any;
  loadObjects: any;
  updateLoadObjects: any;
  objectsRef: any;
  updateObjectsRef: any;
}

const Map: React.FC<IMapProps> = ({ children, room, updateMapIsLoaded, loadObjects, updateLoadObjects, objectsRef, updateObjectsRef }): JSX.Element => {
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
    <MapPortal key={`portal(${room} > ${portal.to})`} {...{ room, portal }} />
  ));
  useEffect(() => {
    if (Object.keys(objectsRef).length === 0) { // triggered by room change useEffect
      if (!loadObjects) updateLoadObjects(true); // objectsRef has been cleared and is ready to receive objects for this room
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
      <MapBackground {...{ room }} />
      {loadObjects && mapObjects}
      {loadObjects && mapPortals}
      {children}
    </div>
  );
}

const MapBackground = ({ room }) => {
  const backgroundStyle = rooms[room].bg
    ? { backgroundImage: `url(/assets/map/${rooms[room].bg}.png)` }
    : { backgroundImage: `url(https://occ-0-1068-92.1.nflxso.net/dnm/api/v6/6AYY37jfdO6hpXcMjf9Yu5cnmO0/AAAABR65SE55Hp1maxFB0Iz-2qFvzkxGdoekXwI8Vye7yZXYoo8WBbhZKqR3IJRHX2WR7nFS6TrVN5OSl1grfJyKW3LihrNA.jpg?r=41b)`, backgroundSize: 'cover' };
  return (
    <div className={styles.background} style={backgroundStyle}></div>
  )
}

const mapObjectConfig = {
  townhall: {
    coords: [70, 300, 0.3],
    portal: {
      to: 'townhall',
      coords: [0.3, 0.3, 0.1, 0.1] // percentage [top, left, width, height] of object
    }
  }, // [top, left, collision zone height relative to object]
  mossyhouse: {
    coords: [100, 100, 0.6]
  },
  wishingwell: {
    coords: [250, 350, 0.4]
  },
  witchshack: {
    coords: [50, 351, 0.2],
    portal: {
      to: 'witchshack',
      coords: [0.66, 0.08, 0.4, 0.4] // percentage [top, left, width, height] of object
    }
  }
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
    if (!mapObjectConfig[name]?.coords || !rect) return;
    setZIndex(Math.round(mapObjectConfig[name].coords[0] + rect.height - 12)); // 12 is approx half of avatar height but maybe todo better
  }, [rect]);
  if (!mapObjectConfig[name]?.coords) return null;
  return (
    <>
      <img src={`/assets/map/${name}.png`} style={{
        top: `${mapObjectConfig[name].coords[0]}px`,
        left: `${mapObjectConfig[name].coords[1]}px`,
        zIndex: `${zIndex}`
      } as React.CSSProperties} ref={objectRef} onLoad={handleLoad} />
      {rect?.height && <CollisionZone {...{ name, object: objectRef.current, rect }} />}
      {rect?.height && <ObjectPortal {...{ name, rect, portal: mapObjectConfig[name].portal }} />}
    </>
  );
}

const CollisionZone = ({ name, object, rect }) => {
  const [clientRect, setRect] = useState<{ [key: string]: number } | undefined>({});
  const { top, left, width, height } = clientRect;
  const collisionZoneRef = useRef(null);
  const { setCollisionZones } = useContext(MapContext);
  useEffect(() => {
    let { top: objectTop, left: objectLeft } = object?.style;
    const { width: objectWidth, height: objectHeight } = rect;
    objectTop = parseInt(objectTop);
    objectLeft = parseInt(objectLeft);
    const heightFactor = mapObjectConfig[name].coords[2];
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

const ObjectPortal = ({ name, rect, portal }) => {
  const objectPortal = {
    name,
    rect,
    ...portal
  }
  if (!portal) return null;
  return (
    <MapPortal {...{ portal: objectPortal }} isObjectPortal />
  );
}

interface IPortal {
  to: string;
  coords?: any;
  name?: string;
  rect?: ClientRect;
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  size?: number[];
}

interface IMapPortalProps {
  portal: IPortal;
  isObjectPortal?: boolean;
}

const MapPortal: React.FC<IMapPortalProps> = ({ portal, isObjectPortal }): JSX.Element => {
  const portalZoneRef = useRef(null);
  const { setPortalZones } = useContext(MapContext);
  useEffect(() => {
    const element = portalZoneRef.current;
    setPortalZones(prevZones => ({
      ...prevZones,
      [portal.to]: element // portalZone should be the entire object collision zone
    }));
  }, [portalZoneRef.current]);
  const getPortalStyle = useCallback(() => {
    if (isObjectPortal) {
      const objectName = portal.name;
      const [top, left, width, height] = portal.coords;
      const [objectTop, objectLeft] = mapObjectConfig[objectName].coords;
      const { width: objectWidth, height: objectHeight } = portal.rect;
      const portalStyle = {
        top: `${objectTop + (top * objectHeight)}px`,
        left: `${objectLeft + (left * objectWidth)}px`,
        width: `${objectWidth * width}px`,
        height: `${objectHeight * height}px`
      }
      return portalStyle;
    } else {
      const { top, bottom, left, right, size } = portal;
      const portalStyle: {
        top?: string;
        bottom?: string;
        left?: string;
        right?: string;
        width: string;
        height: string;
      } = {
        width: `${size[0]}px`,
        height: `${size[1]}px`,
      }
      if (top != null) portalStyle.top = `${top}px`;
      if (bottom != null) portalStyle.bottom = `${bottom}px`;
      if (left != null) portalStyle.left = `${left}px`;
      if (right != null) portalStyle.right = `${right}px`;
      return portalStyle;
    }
  }, []);
  if (!portal) return null;
  return (
    <div className={`${styles.portal} ${isObjectPortal ? styles.isObjectPortal : ''}`} style={getPortalStyle()} ref={portalZoneRef}></div>
  );
}

export default Map;