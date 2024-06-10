const supabase = require("../config/supabaseClient");
const AppError = require("../utils/appError");
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

module.exports = { getAllUsers };
