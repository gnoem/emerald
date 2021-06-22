import React from "react";
import UsersContextProvider, { UsersContext } from "./UsersContext";
import MapContextProvider, { MapContext } from "./MapContext";
import PlayerContextProvider, { PlayerContext } from "./PlayerContext";

const AppContextProvider: React.FC = ({ children }): JSX.Element => {
  return (
    <UsersContextProvider>
      <PlayerContextProvider>
        {children}
      </PlayerContextProvider>
    </UsersContextProvider>
  );
}

export default AppContextProvider;
export { UsersContext, MapContextProvider, MapContext, PlayerContext }