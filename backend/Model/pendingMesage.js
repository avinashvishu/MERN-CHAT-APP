const mongoose = require("mongoose");
const { Schema } = mongoose;

const pendingMessageSchema = new Schema(
  {
    reciver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isGroupChat: { type: Boolean, default: false },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
  },
  { timeseries: true }
);
const PendingMessage = mongoose.model("PendingMessage", pendingMessageSchema);
module.exports = PendingMessage;
