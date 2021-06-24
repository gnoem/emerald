import { IUser } from "@types";
import React, { useRef, useState } from "react";

export const UsersContext = React.createContext(null);

const UsersContextProvider: React.FC = ({ children }): JSX.Element => {
  const [userList, setUserList] = useState<{ [socketId: string]: IUser }>({});
  const userInstances = useRef<{ [socketId: string]: HTMLElement }>({});
  const contextValue = {
    userList,
    setUserList,
    userInstances: userInstances.current
  }
  return (
    <UsersContext.Provider value={contextValue}>
      {children}
    </UsersContext.Provider>
  );
}

export default UsersContextProvider;