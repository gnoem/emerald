import React, { useRef } from "react";

export const MapContext = React.createContext();

const MapContextProvider = ({ children }) => {
  const collisionZones = useRef({});
  const contextValue = {
    collisionZones: collisionZones.current
  }
  return (
    <MapContext.Provider value={contextValue}>
      {children}
    </MapContext.Provider>
  );
}

export default MapContextProvider;