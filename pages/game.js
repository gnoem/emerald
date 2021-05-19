import { useEffect, useState } from "react";
import io from "socket.io-client";
import Scene from "../components/Scene";
import User from "../components/User";

const Game = () => {
  const [socket, setSocket] = useState(null);
  const [playerId, setPlayerId] = useState(null);
  const [userList, setUserList] = useState({});
  useEffect(() => {
    if (playerId) return;
    fetch('/api/io').finally(() => {
      const socket = io();
      setSocket(socket);
      socket.on('connect', () => {
        socket.emit('hello');
      });
      socket.on('hello', ({ id, users }) => {
        setPlayerId(id);
        setUserList(users);
      });
      socket.on('a user connected', (users) => {
        setUserList(users);
      });
      socket.on('a user moved', (user) => {
        const [socketId, data] = Object.entries(user)[0];
        setUserList(prevUsers => {
          const updatedUsers = {...prevUsers};
          updatedUsers[socketId] = data;
          return updatedUsers;
        });
      });
      socket.on('user-disconnected', (users) => {
        setUserList(users);
      });
    });
  }, []);
  const users = Object.keys(userList).map(socketId => {
    const { position, orientation, outfit } = userList[socketId];
    const isPlayer = socketId === playerId;
    return <User key={socketId} {...{ socketId, outfit, position, orientation, isPlayer }} />;
  });
  return (
    <Scene {...{ socket, userList, playerId }}>
      {users}
    </Scene>
  );
}

export default Game;