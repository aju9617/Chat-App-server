const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const socketIo = require('socket.io');

const app = express();

dotenv.config({ path: './config.env' });

const server = http.Server(app);
app.use(cors());
app.options('*', cors());
const io = socketIo(server, {
  cors: {
    origin: [process.env.CLIENT, 'http://localhost:3000/'],
    methods: ['GET', 'POST'],
  },
});

app.get('/', (req, res) => {
  res.send({ response: 'I am alive!' }).status(200);
});

io.on('connection', function (socket) {
  socket.on('create', function (room, name) {
    socket.join(room);
    console.log('some one joined');
    socket.to(room).emit('user-joined', name);
  });

  socket.on('toServer', (message, room, name) => {
    socket.to(room).emit('toClient', message, name);
  });

  socket.on('join-room', (name) => {
    socket.to(room).emit('user-joined', name);
  });
  socket.on('i-m-leaving', (room, name) => {
    console.log('user lefting');
    socket.to(room).emit('user-left', name);
  });

  // Whenever someone disconnects this piece of code executed
  socket.on('disconnect', function () {
    console.log('left');
    // socket.to(room).emit('user-left');
  });
});

const PORT = process.env.PORT || 3030;
server.listen(PORT, function () {
  console.log('server is up and running on ' + PORT);
});
