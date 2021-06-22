import React, { useContext, useEffect, useRef, useState } from "react";
import Scene from "@components/Scene";
import User from "@components/User";
import { PlayerContext, UsersContext } from "@contexts";

const Game: React.FC = (): JSX.Element => {
  const [view, setView] = useState({});
  const [usersInRoom, setUsersInRoom] = useState([]);
  const { userList, userInstances } = useContext(UsersContext);
  const { socket, playerId } = useContext(PlayerContext);
  const sceneRef = useRef(null);
  useEffect(() => {
    if (!sceneRef.current || !Object.keys(userList).length) return;
    // dont try to load users until we have sceneRef.current and userList
    const usersInSameRoom = Object.keys(userList).filter(socketId => {
      return userList[socketId]?.room === userList[playerId].room;
    });
    const users = usersInSameRoom.map(socketId => {
      const userData = userList[socketId];
      const viewUserCard = () => setView({ user: socketId });
      return (
        <User {...{
          key: socketId,
          ref: (el) => userInstances[socketId] = el,
          socket,
          socketId, 
          playerId,
          scene: sceneRef.current,
          room: userList[playerId].room,
          userInstances,
          userData,
          viewUserCard
        }} />
      );
    });
    setUsersInRoom(users);
  }, [sceneRef.current, userList]);
  if (!playerId) return null;
  if (!Object.keys(userList).length) return null;
  return (
    <Scene ref={sceneRef} {...{ room: userList[playerId].room, socket, userList, userInstances, view, updateView: setView, playerId }}>
      {usersInRoom}
    </Scene>
  );
}

export default Game;