const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Chatuser = require('./chatSchema');
const socketIo = require('socket.io');

const app = express();

dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE_URL.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASS
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Database connected!!');
  });

const server = http.Server(app);
app.use(cors());

const io = socketIo(server, {
  cors: {
    origin: [process.env.CLIENT],
    methods: ['GET', 'POST', 'DELETE'],
  },
});

app.get('/', (req, res) => {
  console.log(req.headers.origin);
  res.send({ response: 'I am alive!' }).status(200);
});

app.get('/user-registered', async (req, res) => {
  try {
    const users = await Chatuser.find({});
    res.status(200).json({
      status: 'success',
      result: users,
    });
  } catch (error) {
    res.status(500).json({
      status: 'failed',
      error: 'Failed to fetch users',
    });
  }
});

app.get('/delete-user/:userID', async (req, res) => {
  try {
    await Chatuser.findByIdAndDelete({ _id: req.params.userID });

    res.status(200).json({
      status: 'success',
      result: 'deleted user',
    });
  } catch (error) {
    res.status(500).json({
      status: 'failed',
      error: 'Failed to delete users',
    });
  }
});

io.on('connection', function (socket) {
  socket.on('create', function (room, name) {
    socket.join(room);
    Chatuser.create({ firstName: name, roomId: room, joinedAt: Date.now() });
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

const PORT = process.env.PORT || 3040;
server.listen(PORT, function () {
  console.log('server is up and running on ' + PORT);
});
