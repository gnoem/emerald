import { useContext, useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Scene from "../components/Scene";
import User from "../components/User";
import { UsersContext } from "../contexts";

const Game = () => {
  const [socket, setSocket] = useState(null);
  const [playerId, setPlayerId] = useState(null);
  const [view, setView] = useState({});
  const { userList, setUserList, userInstances } = useContext(UsersContext);
  const sceneRef = useRef(null);
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
  const users = Object.keys(userList).map(socketId => {
    const { position, orientation, outfit, message, timestamp } = userList[socketId];
    const isPlayer = socketId === playerId;
    return (
      <User
        key={socketId}
        ref={(el) => userInstances[socketId] = el}
        {...{ socketId, scene: sceneRef.current, userInstances, outfit, position, message, timestamp, orientation, isPlayer, updateView: setView }}
      />
    );
  });
  return (
    <Scene ref={sceneRef} {...{ socket, userList, userInstances, view, updateView: setView, playerId }}>
      {users}
    </Scene>
  );
}

export default Game;