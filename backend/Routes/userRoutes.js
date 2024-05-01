const express = require("express");
const { registerUser, authUser, allUsers } = require("../controller/users");
const protect = require("../Middleware/AuthMiddleWare");
const router = express.Router();

router
  .post("/signup", registerUser)
  .post("/login", authUser)
  .get("/", protect, allUsers);

module.exports = router;
