import React, { useContext, useEffect, useRef, useState } from "react";
import { MapContext } from "../../contexts";
import styles from "./map.module.css";

const Map = ({ children }) => {
  return (
    <div className={styles.Map}>
      {children}
    </div>
  );
}

export const Plaza = () => {
  return (
    <Map>
      <Object name="townhall" preventCollision />
      <Object name="mossyhouse" preventCollision />
      <Object name="wishingwell" />
      <Object name="teapot" preventCollision />
    </Map>
  );
}

export const Swamp = () => {
  return (
    <Map>
      <Object name="witchshack" preventCollision />
    </Map>
  );
}

const Object = ({ name, preventCollision }) => {
  const [zIndex, setZIndex] = useState(null);
  const { mapObjects } = useContext(MapContext);
  const objectRef = useRef(null);
  const config = {
    townhall: [70, 300],
    mossyhouse: [170, 60],
    wishingwell: [250, 350],
    witchshack: [50, 351]
  }
  useEffect(() => {
    if (!config[name] || !objectRef.current) return;
    setZIndex(config[name][0] + objectRef.current.scrollHeight);
  }, [name, objectRef.current]);
  const createReference = (element) => {
    if (preventCollision) mapObjects[name] = element; // or define a collision zone?
    objectRef.current = element;
  }
  if (!config[name]) return null;
  return (
    <img src={`/assets/map/${name}.png`} style={{
      top: `${config[name][0]}px`,
      left: `${config[name][1]}px`,
      zIndex: `${zIndex}`
    }} ref={createReference} />
  );
}