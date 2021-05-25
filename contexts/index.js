import UsersContextProvider, { UsersContext } from "./UsersContext";
import MapContextProvider, { MapContext } from "./MapContext";

const AppContextProvider = ({ children }) => {
  return (
    <UsersContextProvider>
      {children}
    </UsersContextProvider>
  );
}

export default AppContextProvider;
export { UsersContext, MapContextProvider, MapContext }