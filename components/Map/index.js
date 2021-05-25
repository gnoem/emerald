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

export const Town = () => {
  return (
    <Map>
      <Object name="townhall" detectCollision />
      <Object name="mossyhouse" detectCollision />
      <Object name="wishingwell" />
      <Object name="teapot" detectCollision />
    </Map>
  );
}

const Object = ({ name, detectCollision }) => {
  const [zIndex, setZIndex] = useState(null);
  const { mapObjects } = useContext(MapContext);
  const objectRef = useRef(null);
  const config = {
    townhall: [70, 300],
    mossyhouse: [170, 60],
    wishingwell: [250, 350]
  }
  useEffect(() => {
    if (!config[name]) return;
    setZIndex(config[name][0] + objectRef.current?.scrollHeight);
  }, [name, objectRef.current]);
  const createReference = (element) => {
    if (detectCollision) mapObjects[name] = element;
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