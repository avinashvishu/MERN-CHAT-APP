const express = require("express");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  removeFromGroup,
  addToGroup,
  renameGroup,
  newAdmin,
} = require("../controller/chat");
const protect = require("../Middleware/AuthMiddleWare");

const router = express.Router();

router
  .get("/", protect, fetchChats)
  .post("/", protect, accessChat)
  .post("/group", protect, createGroupChat)
  .put("/rename", protect, renameGroup)
  .put("/newAdmin", protect, newAdmin)
  .put("/groupremove", protect, removeFromGroup)
  .put("/groupadd", protect, addToGroup);

module.exports = router;
