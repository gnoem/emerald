import React, { useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { UsersContext } from ".";

export const PlayerContext = React.createContext(null);

const PlayerContextProvider: React.FC = ({ children }): JSX.Element => {
  const [socket, setSocket] = useState(null);
  const [playerId, setPlayerId] = useState(null);
  const { setUserList } = useContext(UsersContext);
  useEffect(() => {
    if (socket) return; // prevent new connection on hot reload
    fetch('/api/io').finally(() => {
      const socket = io();
      setSocket(socket);
      socket.on('connect', () => socket.emit('hello'));
      socket.on('hello', ({ id, users }) => {
        setPlayerId(id);
        setUserList(users);
      });
      socket.on('a user connected', setUserList);
      const handleUserUpdate = (user) => {
        const [socketId, data] = Object.entries(user)[0];
        setUserList(prevUsers => {
          const updatedUsers = {...prevUsers};
          updatedUsers[socketId] = data;
          return updatedUsers;
        });
      }
      socket.on('a user moved', handleUserUpdate);
      socket.on('a user spawned', handleUserUpdate);
      socket.on('a user switched rooms', handleUserUpdate);
      socket.on('a user talked', handleUserUpdate);
      socket.on('a user changed their outfit', handleUserUpdate);
      socket.on('user-disconnected', ({ users }) => {
        setUserList(users);
        // todo figure out how to remove element from userInstances
        // something like clearUserInstance(socketId);
      });
    });
  }, []);
  const contextValue = {
    socket,
    playerId
  }
  return (
    <PlayerContext.Provider value={contextValue}>
      {children}
    </PlayerContext.Provider>
  );
}

export default PlayerContextProvider;