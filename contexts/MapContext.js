import React, { useState } from "react";

export const MapContext = React.createContext();

const MapContextProvider = ({ children }) => {
  const [collisionZones, setCollisionZones] = useState({});
  const [portalZones, setPortalZones] = useState({});
  const contextValue = {
    collisionZones,
    setCollisionZones,
    portalZones,
    setPortalZones,
  }
  return (
    <MapContext.Provider value={contextValue}>
      {children}
    </MapContext.Provider>
  );
}

export default MapContextProvider;