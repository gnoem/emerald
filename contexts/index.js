import UsersContextProvider, { UsersContext } from "./UsersContext";
import MapContextProvider, { MapContext } from "./MapContext";
import PlayerContextProvider, { PlayerContext } from "./PlayerContext";

const AppContextProvider = ({ children }) => {
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