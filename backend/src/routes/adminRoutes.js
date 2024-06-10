const express = require("express");
const adminRoutes = express.Router();
const { adminProtect } = require("../middlewares/authentication");
const { getAllUsers } = require("../controllers/adminControllers");

adminRoutes.get("/getAllUsers", adminProtect, getAllUsers);
module.exports = adminRoutes;
