import React, { useRef } from "react";

export const MapContext = React.createContext();

const MapContextProvider = ({ children }) => {
  const mapObjects = useRef({});
  const contextValue = {
    mapObjects: mapObjects.current
  }
  return (
    <MapContext.Provider value={contextValue}>
      {children}
    </MapContext.Provider>
  );
}

export default MapContextProvider;