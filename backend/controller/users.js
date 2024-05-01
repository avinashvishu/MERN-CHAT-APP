const asyncHandler = require("express-async-handler");
const User = require("../Model/user");
const generateToken = require("../config/generateToken");
const bcrypt = require("bcryptjs");

const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search;

  const users = await User.find({
    name: { $regex: `^${keyword}`, $options: "i" },
  });
  res.send(users);
});
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, picture } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }
  const userExists = await User.findOne({ email: email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists please login !");
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    picture,
  });
  user.save();

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Falid to create the user");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    const validPassword = await bcrypt.compare(password, user.password);

    if (user && validPassword) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error("password or email is not valid !");
    }
  } catch (error) {
    throw new Error("password or email is not valid !");
  }
});

module.exports = { registerUser, authUser, allUsers };
