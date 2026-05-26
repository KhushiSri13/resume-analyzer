const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const blacklistedTokenModel = require("../models/blacklist.model");
// require("dotenv").config();
/**
 * @name registerUserController
 * @description Controller to handle user registration expects username , email and password in the request body
 * @access Public
 */

async function registerUserController(req, res) {
  let { username, email, password } = req.body;
  if (!username || !email || !password) {
    return (
      res.status(400),
      json({ message: "provide username, email and password" })
    );
  }
  let isUserExists = await userModel.findOne({
    $or: [{username}, {email}],
  });
  if (isUserExists) {
    return (
      res.status(400).
      json({ message: "account already exists with same email or username" })
    );
  } else {
    const hash = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      username,
      email,
      password: hash,
    });
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" },
    );
    res.cookie("token", token);
    res.status(201).json({
      message: "user registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  }
}

/**
 * @name loginUserController
 * @description expects email and password for user login
 * @access Public
 */
async function loginUserController(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "Please enter email password",
    });
  }
  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(400).json({
      message: "no user found..please register",
    });
  } else {
    const pass = await bcrypt.compare(password, user.password);
    if (!pass) {
      return res.status(400).json({
        message: "Please enter correct password",
      });
    }
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" },
    );
    res.cookie("token", token);
    res.status(201).json({
      message: "user login successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  }
}

async function logoutUserController(req, res) {
  const token = req.cookies.token;
  if(token){
    await blacklistedTokenModel.create({ token });
  }
  res.clearCookie("token");
  res.status(200).json({
    message: "user logged out successfully"
  });
}

/**
 * @name getMeController
 * @description controller to get user details of logged in user
 * @access Private
 */
async function getMeController(req, res) {
  const user = await userModel.findById(req.user.id).select("-password");
  if (user) {
    res.status(200).json({
      message: "user details fetched successfully",
      user : {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } else {
    res.status(404).json({
      message: "user not found"
    });
  }
}
module.exports = { registerUserController , loginUserController, logoutUserController, getMeController };
