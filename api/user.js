const express = require("express");
const { registerUser, loginUser, logoutUser, getRefreshToken } = require("../controllers/user");

const api = express.Router();

// api.route("/").get(getUser);
api.route("/login").post(loginUser);
api.route("/register").post(registerUser);
api.route("/logout").post(logoutUser);
api.route("/refresh_token").post(getRefreshToken);

//get user information

//delete user

// api.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = api;
