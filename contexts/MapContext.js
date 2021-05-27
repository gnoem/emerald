import React, { useState } from "react";

export const MapContext = React.createContext();

const MapContextProvider = ({ children }) => {
  const [collisionZones, setCollisionZones] = useState({});
  const contextValue = {
    collisionZones,
    setCollisionZones
  }
  return (
    <MapContext.Provider value={contextValue}>
      {children}
    </MapContext.Provider>
  );
}

export default MapContextProvider;