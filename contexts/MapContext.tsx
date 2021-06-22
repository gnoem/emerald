import React, { useState } from "react";

export const MapContext = React.createContext(null);

const MapContextProvider: React.FC = ({ children }): JSX.Element => {
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