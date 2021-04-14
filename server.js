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
    origin: process.env.CLIENT,
    methods: ['GET', 'POST'],
  },
});

app.get('/', (req, res) => {
  res.send({ response: 'I am alive!' }).status(200);
});

io.on('connection', function (socket) {
  socket.on('create', function (room) {
    socket.join(room);
  });

  socket.on('toServer', (message, room) => {
    socket.to(room).emit('toClient', message);
  });

  //Whenever someone disconnects this piece of code executed
  // socket.on('disconnect', function () {});
});

const PORT = process.env.PORT;
server.listen(PORT, function () {
  console.log('server is up and running on ' + PORT);
});
