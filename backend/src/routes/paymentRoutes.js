const express = require("express");
const paymentRoutes = express.Router();

const {
  accessToken,
  lipa_na_mpesa,
  CallBack,
} = require("../controllers/paymentController");
const { userProtect } = require("../middlewares/authentication");
paymentRoutes.use(userProtect);
paymentRoutes.get("/accessToken", accessToken);
paymentRoutes.post("/lipa/callback", CallBack);
paymentRoutes.post("/stkPush", accessToken, lipa_na_mpesa);

module.exports = paymentRoutes;
