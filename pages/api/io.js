import { Server } from "socket.io";
import { colorMap } from "../../components/Avatar";
import { randomFromArray, randomIntBetween } from "../../utils";

const users = {};

const ioHandler = (_, res) => {
  if (!res.socket.server.io) {
    console.log('Starting socket.io');
    const io = new Server(res.socket.server);
    io.on('connection', (socket) => {
      users[socket.id] = {
        position: { // todo better: needs to be based on room where user spawns
          x: randomIntBetween(150, 550),
          y: randomIntBetween(150, 350)
        },
        outfit: {
          color: randomFromArray(Object.keys(colorMap)),
          face: 'eyes1'
        }
      };
      socket.broadcast.emit('a user connected', users);
      socket.on('hello', () => {
        socket.emit('hello', {
          id: socket.id,
          users
        });
      });
      socket.on('a user connected', () => {
        socket.emit('a user connected', users);
      });
      socket.on('a user moved', ({ socketId, position, orientation }) => {
        const data = {
          ...users[socketId],
          position,
          orientation
        }
        users[socketId] = data;
        socket.emit('a user moved', {
          [socketId]: data
        });
        socket.broadcast.emit('a user moved', {
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
        socket.emit('a user talked', {
          [socketId]: data
        });
        socket.broadcast.emit('a user talked', {
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
        socket.emit('a user talked', {
          [socketId]: data
        });
        socket.broadcast.emit('a user talked', {
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