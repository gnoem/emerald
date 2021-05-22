import UsersContextProvider, { UsersContext } from "./UsersContext";

const AppContextProvider = ({ children }) => {
  return (
    <UsersContextProvider>
      {children}
    </UsersContextProvider>
  );
}

export default AppContextProvider;
export { UsersContext }