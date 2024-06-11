const express = require("express");
const adminRoutes = express.Router();
const { adminProtect } = require("../middlewares/authentication");
const {
  getAllUsers,
  uploadUniversityDocs,
  uploadHighSchoolDocs,
  uploadCbcMaterial,
} = require("../controllers/adminControllers");
adminRoutes.use(adminProtect);
adminRoutes.get("/getAllUsers", getAllUsers);
adminRoutes.post("/uploadUniversityDocs", uploadUniversityDocs);
adminRoutes.post("/uploadHighSchoolDocs", uploadHighSchoolDocs);
adminRoutes.post("/uploadCbcMaterial", uploadCbcMaterial);
module.exports = adminRoutes;
