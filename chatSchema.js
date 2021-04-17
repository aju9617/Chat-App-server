const mongoose = require('mongoose');

//For storing users name who have created chat room or joined chat room.
// just to know how many people visited my app 😁

const chatSchema = mongoose.Schema({
  firstName: {
    type: String,
  },
  joinedAt: {
    type: Date,
    default: Date.now(),
  },
  roomId: {
    type: String,
  },
});

const Chatuser = mongoose.model('Chatuser', chatSchema);
module.exports = Chatuser;
