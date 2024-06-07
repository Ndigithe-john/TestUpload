const AppError = require("../utils/appError");
const supabase = require("../config/supabaseClient");
const adminProtectedRoutes = async (req, res, next) => {
  try {
    const { email } = req.body;
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error) {
      return next(new AppError("Error querying user data", 500));
    }

    if (data.role !== "admin") {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    if (data.role === "admin") {
      next();
    }
  } catch (error) {
    console.log(error);
    return next(new AppError("Unauthorized. Please log in again!", 401));
  }
};

module.exports = adminProtectedRoutes;
