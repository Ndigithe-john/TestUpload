const express = require("express");
const userRoutes = express.Router();
const { userProtect } = require("../middlewares/authentication");
const adminProtectedRoutes = require("../middlewares/adminVerifier");
const {
  createAccount,
  login,
  adminLogin,
  forgotPassword,
  resetPassword,
  logout,
} = require("../controllers/userControllers");

userRoutes.post("/signUp", createAccount);
userRoutes.post("/login", login);
userRoutes.post("/forgotPassword", forgotPassword);
userRoutes.patch("/resetPassword/:token", resetPassword);
userRoutes.delete("/logout", userProtect, logout);
userRoutes.post("/login/admin", adminProtectedRoutes, adminLogin);
module.exports = userRoutes;
