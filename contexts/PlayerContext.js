import React, { useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { UsersContext } from ".";
import { rooms } from "../config";
import { randomFromArray } from "../utils";

export const PlayerContext = React.createContext();

const PlayerContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [playerId, setPlayerId] = useState(null);
  const [displayName, setDisplayName] = useState(null);
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
      socket.on('a user connected', (users) => setUserList(users));
      const handleUserUpdate = (user) => {
        const [socketId, data] = Object.entries(user)[0];
        setUserList(prevUsers => {
          const updatedUsers = {...prevUsers};
          updatedUsers[socketId] = data;
          return updatedUsers;
        });
      }
      socket.on('a user moved', handleUserUpdate);
      socket.on('a user talked', handleUserUpdate);
      socket.on('a user changed their outfit', handleUserUpdate);
      socket.on('user-disconnected', ({ socketId, users }) => {
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