import React, { useEffect, useRef, useState } from "react";
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
      <Object name="mossyhouse" />
      <Object name="wishingwell" />
      <Object name="teapot" />
    </Map>
  );
}

const Object = ({ name, detectCollision }) => {
  const [zIndex, setZIndex] = useState(null);
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
  useEffect(() => {
    if (!detectCollision) return;
  }, [detectCollision]);
  if (!config[name]) return null;
  return (
    <img src={`/assets/map/${name}.png`} style={{
      top: `${config[name][0]}px`,
      left: `${config[name][1]}px`,
      zIndex: `${zIndex}`
    }} ref={objectRef} />
  );
}