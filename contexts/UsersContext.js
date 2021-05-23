import React, { useEffect, useRef, useState } from "react";

export const UsersContext = React.createContext();

const UsersContextProvider = ({ children }) => {
  const [userList, setUserList] = useState({});
  const userInstances = useRef({});
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