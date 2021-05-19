import { Server } from "socket.io";
import { randomIntBetween } from "../../utils";

const users = {};

const ioHandler = (_, res) => {
  if (!res.socket.server.io) {
    console.log('Starting socket.io');
    const io = new Server(res.socket.server);
    io.on('connection', (socket) => {
      users[socket.id] = {
        position: {
          x: randomIntBetween(150, 550),
          y: randomIntBetween(150, 350)
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
      socket.on('disconnect', () => {
        delete users[socket.id];
        socket.broadcast.emit('user-disconnected', users);
      });
    });
    res.socket.server.io = io;
  } else {
    console.log('socket.io already running');
  }
  res.end();
}

export default ioHandler;