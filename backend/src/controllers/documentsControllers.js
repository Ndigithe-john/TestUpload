const supabase = require("../config/supabaseClient");
const AppError = require("../utils/appError");
const getAllUniversityDocs = async (req, res, next) => {
  try {
    const { data: documents, error } = await supabase
      .from("university")
      .select("*");

    if (error) {
      throw new AppError("Error fetching users from database", 500);
    }

    res.status(200).json({
      status: "success",
      data: {
        documents,
      },
    });
  } catch (error) {
    console.error(error);
    next(new AppError(error.message, 500));
  }
};
const getAllHighSchoolDocs = async (req, res, next) => {
  try {
    const { data: documents, error } = await supabase
      .from("highschool")
      .select("*");

    if (error) {
      throw new AppError("Error fetching users from database", 500);
    }

    res.status(200).json({
      status: "success",
      data: {
        documents,
      },
    });
  } catch (error) {
    console.error(error);
    next(new AppError(error.message, 500));
  }
};

const getAllCBCDocs = async (req, res, next) => {
  try {
    const { data: documents, error } = await supabase.from("cbc").select("*");

    if (error) {
      throw new AppError("Error fetching users from database", 500);
    }

    res.status(200).json({
      status: "success",
      data: {
        documents,
      },
    });
  } catch (error) {
    console.error(error);
    next(new AppError(error.message, 500));
  }
};

module.exports = { getAllUniversityDocs, getAllHighSchoolDocs, getAllCBCDocs };
