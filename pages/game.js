import { useContext, useRef, useState } from "react";
import Scene from "../components/Scene";
import User from "../components/User";
import { PlayerContext, UsersContext } from "../contexts";

const Game = () => {
  const [view, setView] = useState({});
  const { userList, userInstances } = useContext(UsersContext);
  const { socket, playerId } = useContext(PlayerContext);
  const sceneRef = useRef(null);
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