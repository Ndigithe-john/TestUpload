const express = require("express");
const documentsRoutes = express.Router();
const {
  getAllUniversityDocs,
  getAllHighSchoolDocs,
  getAllCBCDocs,
} = require("../controllers/documentsControllers");
const { userProtect } = require("../middlewares/authentication");
documentsRoutes.use(userProtect);
documentsRoutes.get("/universityDocs", getAllUniversityDocs);
documentsRoutes.get("/highschoolDocs", getAllHighSchoolDocs);
documentsRoutes.get("/cbcDocs", getAllCBCDocs);

module.exports = documentsRoutes;
