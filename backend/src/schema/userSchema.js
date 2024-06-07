const joi = require("joi");

const signup_schema = joi
  .object({
    full_name: joi.string().required(),
    email: joi.string().required(),
    password: joi.string().required(),
    c_password: joi.ref("password"),
  })
  .with("password", "c_password");

const login_schema = joi.object({
  email: joi.string().required(),
  password: joi.string().required(),
});
const forgot_password_schema = joi.object({
  email: joi.required(),
});
const reset_password_schema = joi
  .object({
    new_password: joi.string().required(),
    confirm_new_password: joi.ref("new_password"),
  })
  .with("new_password", "confirm_new_password");
module.exports = {
  signup_schema,
  login_schema,
  forgot_password_schema,
  reset_password_schema,
};
