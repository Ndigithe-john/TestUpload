const joi = require("joi");

const PAYMENT_SCHEMA = joi.object({
  amount_payable: joi.number().required(),
  phoneNumber: joi.number().required(),
});

module.exports = { PAYMENT_SCHEMA };
