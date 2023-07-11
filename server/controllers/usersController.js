const User = require("../models/User");
const Note = require("../models/Note");

const asyncHandler = require("express-async-handler");
const bcryptjs = require("bcryptjs");

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").lean();
  if (!users?.length) {
    return res.status(400).json({ message: "No users found" });
  }
  res.json(users);
});

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
  const { username, password, roles } = req.body;
console.log(username, password, roles);
  //Confirm data
  console.log(!username , !password , !Array.isArray(roles) , !roles.length);
  if (!username || !password || !Array.isArray(roles) || !roles.length) {
    // 400 - bad request
    return res.status(400).json({ message: "All fields are required!" });
  }

  //check for duplikate
  const duplicate = await User.findOne({ username }).lean().exec();

  if (duplicate) {
    // 409 - conflict
    return res.status(409).json({ message: "Duplicate username" });
  }

  //hash password
  const hashedPwd = await bcryptjs.hash(password, 10);

  const userObject = {
    username,
    password: hashedPwd,
    roles,
  };

  //create and store new user
  const user = await User.create(userObject);

  if (user) {
    //created
    res.status(201).json({ message: `New user: ${username}, created` });
  } else {
    res.status(400).json({ message: "Invalid user data recived" });
  }
});

// @desc Update a user
// @route PATCH /users
// @acce{ss Private
const updateUser = asyncHandler(async (req, res) => {
  const { id, username, roles, active, password } = req.body;

  // confirm data
  if (
    !id ||
    !username ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof active !== "boolean"
  ) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found." });
  }

  // check for duplicate username
  const duplicate = await User.findOne({ username }).lean().exec();
  // Allow updates to the original user
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status.apply(409).json({ message: "duplicate username" });
  }

  user.username = username;
  user.roles = roles;
  user.active = active;

  if (password) {
    user.password = await bcryptjs.hash(password, 10);
  }

  const updatedUser = await user.save();

  res.json({ message: `${updatedUser.username} updated!` });
});

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "User ID Required~!" });
  }

  const note = await Note.findOne({ user: id }).lean().exec();
  if (note) {
    return res.status(400).json({ message: "User has assigned notes" });
  }

  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const result = await user.deleteOne();

  const reply = `Username ${result.username} with ID ${result._id} deleted`;

  res.json(reply)
});

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};
