const bcrypt = require("bcrypt");
const { format, addHours } = require("date-fns");
const crypto = require("crypto");
const AppError = require("../utils/appError");
const supabase = require("../config/supabaseClient");
const User = require("../utils/getUserByEmail");
const { tokenGenerator } = require("../utils/tokens");
const sendMail = require("../utils/email");
const {
  signupValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  loginValidator,
} = require("../validators/userValidators");
const createAccount = async (req, res, next) => {
  try {
    const { full_name, email, password } = req.body;

    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("email")
      .eq("email", email)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      throw new AppError("Error checking for existing user", 500);
    }

    if (existingUser) {
      throw new AppError(
        "User with this email already exists. Proceed to login!",
        400
      );
    }

    const hashed_password = await bcrypt.hash(password, 8);
    signupValidator(req.body);

    const { data: new_user, error: insertError } = await supabase
      .from("users")
      .insert([{ full_name, email, password: hashed_password }])
      .single();

    if (insertError) {
      throw new AppError("Error creating user", 500);
    }

    res.status(200).json({
      status: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.log(error);
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

async function login(req, res, next) {
  try {
    const login_body = req.body;
    const { email, password } = login_body;
    loginValidator(login_body);

    let user = await User(email);
    if (user) {
      let password_match = await bcrypt.compare(password, user.password);
      if (password_match) {
        const token = await tokenGenerator({
          userid: user.userid,
          email: user.email,
          role: user.role,
          password: user.password,
        });

        res.status(200).json({
          status: true,
          message: "Logged in successfully",
          token,
        });
      } else {
        return next(new AppError("Incorrect email or password", 401));
      }
    } else {
      return next(
        new AppError("User not found! Please sign up to continue", 401)
      );
    }
  } catch (error) {
    console.log(error.message);
    return next(new AppError(`Error logging in: ${error.message}`, 500));
  }
}

async function adminLogin(req, res, next) {
  try {
    const login_body = req.body;
    const { email, password } = login_body;
    loginValidator(login_body);

    let user = await User(email);
    if (user) {
      console.log(user);
      let password_match = await bcrypt.compare(password, user.password);
      if (password_match) {
        const token = await tokenGenerator({
          userid: user.userid,
          email: user.email,
          role: user.role,
          password: user.password,
        });

        res.status(200).json({
          status: true,
          message: "Logged in successfully",
          token,
        });
      } else {
        return next(new AppError("Incorrect email or password", 401));
      }
    } else {
      return next(
        new AppError("User not found! Please sign up to continue", 401)
      );
    }
  } catch (error) {
    console.log(error.message);
    return next(new AppError(`Error logging in: ${error.message}`, 500));
  }
}

async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    forgotPasswordValidator(req.body);
    let user = await User(email);
    const resetToken = crypto.randomBytes(32).toString("hex");
    const currentTime = format(addHours(new Date(), 1), "yyyyMMddHHmmss");
    const hashedResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    if (user) {
      const { error } = await supabase
        .from("users")
        .update({
          reset_password_token: hashedResetToken,
          reset_password_expires: currentTime,
        })
        .eq("email", email);

      if (error) {
        throw new AppError(
          "There was an error updating the user data. Try again later",
          500
        );
      }
      try {
        const resetURL = `${req.get("host")}/resetPassword/${resetToken}`;
        const message = `Forgot your password? Submit a PATCH request with the new password and passwordConfirm to ${resetURL}.\nIf you didn't forget your password, please ignore this email.`;
        await sendMail({
          email: email,
          subject: "Password Reset Prompt",
          message,
        });

        res.status(200).json({
          status: "success",
          message: "Token sent to email",
        });
      } catch (emailError) {
        console.log(emailError);
        await supabase
          .from("users")
          .update({
            resetpasswordtoken: null,
            resetpasswordexpires: null,
          })
          .eq("email", email);

        throw new AppError(
          "There was an error sending the email. Try again later",
          500
        );
      }
    } else {
      return next(
        new AppError("Please use your registered email to reset your password")
      );
    }
  } catch (error) {
    console.error(error);
    return next(new AppError(error.message, 500));
  }
}
async function resetPassword(req, res, next) {
  try {
    const reset_body = req.body;
    resetPasswordValidator(reset_body);
    const { new_password } = reset_body;
    const currentDate = format(new Date(), "yyyyMMddHHmmss");
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
    const hashedPassword = await bcrypt.hash(new_password, 8);

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("reset_password_token", hashedToken);
    if (error) {
      throw new AppError("Error querying user data", 500);
    }

    if (data.length === 0) {
      return next(new AppError("Invalid token", 400));
    }
    const user = data[0];
    const resetPasswordExpires = user.reset_password_expires;

    if (resetPasswordExpires < currentDate) {
      return next(new AppError("Token has expired", 400));
    }

    const { error: updateError } = await supabase
      .from("users")
      .update({
        password: hashedPassword,
        reset_password_token: null,
        reset_password_expires: null,
      })
      .eq("userid", user.userid);
    if (updateError) {
      console.log(updateError);
      return next(new AppError(updateError.message, 400));
    }

    res.status(200).json({
      status: "success",
      message: "Password reset successful",
    });
  } catch (error) {
    console.log(error);
    return next(new AppError(error.message, 500));
  }
}
async function logout(req, res, next) {
  // try {
  //   const user = r;
  //   if (user) {
  //     req.session.destroy();
  //     return next(new AppError("Logged out successfully", 200));
  //   }
  // } catch (error) {
  //   console.log(error);
  //   return next(new AppError(error.message, 500));
  // }
}

module.exports = {
  createAccount,
  login,
  adminLogin,
  forgotPassword,
  resetPassword,
  logout,
};
