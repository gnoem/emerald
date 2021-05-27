import { Server } from "socket.io";
import { colorMap } from "../../components/Avatar";
import { rooms } from "../../config";
import { randomFromArray } from "../../utils";

const users = {};

const ioHandler = (_, res) => {
  if (!res.socket.server.io) {
    console.log('Starting socket.io');
    const io = new Server(res.socket.server);
    io.on('connection', (socket) => {
      users[socket.id] = {
        // displayName,
        room: randomFromArray(Object.keys(rooms)),
        outfit: {
          color: randomFromArray(Object.keys(colorMap)),
          face: 'eyes1'
        }
      }
      socket.on('hello', () => {
        socket.emit('hello', {
          // send new connection their socketId and info (so far just room + outfit)
          // spawn location will depend on the room map
          id: socket.id,
          users
        });
      });
      socket.broadcast.emit('a user connected', users);
      socket.on('a user moved', ({ socketId, position, orientation }) => {
        const data = {
          ...users[socketId],
          position,
          orientation
        }
        users[socketId] = data;
        io.sockets.emit('a user moved', {
          [socketId]: data
        });
      });
      socket.on('a user switched rooms', ({ socketId, room }) => {
        const data = {
          ...users[socketId],
          room
        }
        users[socketId] = data;
        io.sockets.emit('a user switched rooms', {
          [socketId]: data
        });
      });
      let messageTimer;
      socket.on('a user talked', ({ socketId, message, timestamp }) => {
        clearTimeout(messageTimer);
        const data = {
          ...users[socketId],
          message,
          timestamp
        }
        users[socketId] = data;
        io.sockets.emit('a user talked', {
          [socketId]: data
        });
        messageTimer = setTimeout(() => {
          const upToDateData = {...users[socketId]};
          delete upToDateData.message;
          delete upToDateData.timestamp;
          users[socketId] = upToDateData;
          socket.emit('a user talked', {
            [socketId]: upToDateData
          });
          socket.broadcast.emit('a user talked', {
            [socketId]: upToDateData
          });
        }, 5000);
      });
      socket.on('a user changed their outfit', ({ socketId, outfit }) => {
        const data = {
          ...users[socketId],
          outfit
        }
        users[socketId] = data;
        io.sockets.emit('a user talked', {
          [socketId]: data
        });
      });
      socket.on('disconnect', () => {
        delete users[socket.id];
        socket.broadcast.emit('user-disconnected', {
          socketId: socket.id,
          users
        });
      });
    });
    res.socket.server.io = io;
  } else {
    console.log('socket.io already running');
  }
  res.end();
}

export default ioHandler;