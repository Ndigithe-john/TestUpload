const supabase = require("../config/supabaseClient");
const AppError = require("../utils/appError");
const documentsValidator = require("../validators/documentsValidator");
const getAllUsers = async (req, res, next) => {
  try {
    const { data: users, error } = await supabase.from("users").select("*");

    if (error) {
      throw new AppError("Error fetching users from database", 500);
    }

    res.status(200).json({
      status: "success",
      data: {
        users,
      },
    });
  } catch (error) {
    console.error(error);
    next(new AppError(error.message, 500));
  }
};
const uploadUniversityDocs = async (req, res, next) => {
  try {
    const { title, course, type, pdf_url } = req.body;

    documentsValidator(req.body);
    const response = await supabase
      .from("university")
      .insert([{ title, course, type, pdf_url }]);
    console.log("Supabase response:", JSON.stringify(response, null, 2));

    if (response.error) {
      console.error("Supabase error:", JSON.stringify(response.error, null, 2));

      if (response.status === 404) {
        throw new AppError(
          'The specified table "University" does not exist',
          400
        );
      } else {
        throw new AppError(
          `Database error: ${response.error.message || "Unknown error"}`,
          500
        );
      }
    }

    res.status(200).json({
      status: "success",
      message: "Document uploaded successfully",
    });
  } catch (error) {
    console.error(error);
    next(new AppError(`Error: ${error.message}`, 500));
  }
};
const uploadHighSchoolDocs = async (req, res, next) => {
  try {
    const { title, course, type, pdf_url } = req.body;

    documentsValidator(req.body);
    const response = await supabase
      .from("highschool")
      .insert([{ title, course, type, pdf_url }]);
    console.log("Supabase response:", JSON.stringify(response, null, 2));

    if (response.error) {
      console.error("Supabase error:", JSON.stringify(response.error, null, 2));

      if (response.status === 404) {
        throw new AppError(
          'The specified table "University" does not exist',
          400
        );
      } else {
        throw new AppError(
          `Database error: ${response.error.message || "Unknown error"}`,
          500
        );
      }
    }

    res.status(200).json({
      status: "success",
      message: "Document uploaded successfully",
    });
  } catch (error) {
    console.error(error);
    next(new AppError(`Error: ${error.message}`, 500));
  }
};
const uploadCbcMaterial = async (req, res, next) => {
  try {
    const { title, course, type, pdf_url } = req.body;

    documentsValidator(req.body);
    const response = await supabase
      .from("cbc")
      .insert([{ title, course, type, pdf_url }]);
    console.log("Supabase response:", JSON.stringify(response, null, 2));

    if (response.error) {
      console.error("Supabase error:", JSON.stringify(response.error, null, 2));

      if (response.status === 404) {
        throw new AppError(
          'The specified table "University" does not exist',
          400
        );
      } else {
        throw new AppError(
          `Database error: ${response.error.message || "Unknown error"}`,
          500
        );
      }
    }

    res.status(200).json({
      status: "success",
      message: "Document uploaded successfully",
    });
  } catch (error) {
    console.error(error);
    next(new AppError(`Error: ${error.message}`, 500));
  }
};

module.exports = {
  getAllUsers,
  uploadUniversityDocs,
  uploadHighSchoolDocs,
  uploadCbcMaterial,
};
