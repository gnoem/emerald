import React, { useState } from "react";

export const MapContext = React.createContext(null);

interface IMapZone {
  [key: string]: HTMLElement
}

const MapContextProvider: React.FC = ({ children }): JSX.Element => {
  const [collisionZones, setCollisionZones] = useState<IMapZone>({});
  const [portalZones, setPortalZones] = useState<IMapZone>({});
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