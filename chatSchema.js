const mongoose = require('mongoose');

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
