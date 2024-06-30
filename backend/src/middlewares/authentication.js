const { tokenVerifier } = require("../utils/tokens");
const AppError = require("../utils/appError");
const { BlackListedRedisClient } = require("../config/redisConfig");
const userProtect = async (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  try {
    const decoded = tokenVerifier(token);
    const blackListedAccessToken = await BlackListedRedisClient.GET(token);

    if (blackListedAccessToken === "true") {
      return next(new AppError("Invalid token. Please log in again!", 401));
    }
    req.user = decoded;
    next();
  } catch (err) {
    console.log(err);
    return next(new AppError(err, 500));
  }
};
const adminProtect = async (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  try {
    const decoded = tokenVerifier(token);
    const blackListedAccessToken = await BlackListedRedisClient.GET(token);
    if (blackListedAccessToken === "true") {
      return next(new AppError("Invalid token. Please log in again!", 401));
    }
    if (decoded.role !== "admin") {
      return next(
        new AppError(
          "Unauthorized!! You do have permission to perform this action",
          403
        )
      );
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.log(err);
    return next(new AppError(err, 500));
  }
};

module.exports = { userProtect, adminProtect };
