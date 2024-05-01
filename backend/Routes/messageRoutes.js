const express = require("express");

const protect = require("../Middleware/AuthMiddleWare");
const {
  sendMessage,
  allMessages,
  addPendingMessage,
  fetchPendingMessage,
  deletePendingMessage,
  addPendingMessageForGroupChat,
} = require("../controller/message");

const router = express.Router();

router
  .post("/", protect, sendMessage)
  .get("/:chatId", protect, allMessages)
  .post("/pendingMessages", protect, addPendingMessage)
  .post("/pendingMessages/groupChat", protect, addPendingMessageForGroupChat)
  .get("/pendingMessages/user", protect, fetchPendingMessage)
  .put("/pendingMessages/delete", protect, deletePendingMessage);

module.exports = router;
