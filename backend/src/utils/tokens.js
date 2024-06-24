const jwt = require("jsonwebtoken");
require("dotenv").config();
const tokenGenerator = async (data) => {
  return jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
};

function tokenVerifier(token) {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
}
module.exports = { tokenGenerator, tokenVerifier };
