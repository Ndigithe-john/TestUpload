const { PAYMENT_SCHEMA } = require("../schema/paymentSchema");

function paymentBodyValidator(body) {
  const PAYMENT_BODY_SCHEMA = PAYMENT_SCHEMA.validate(body, {
    abortEarly: false,
  });

  if (PAYMENT_BODY_SCHEMA.error?.details.length) {
    let message = PAYMENT_BODY_SCHEMA.error?.details.map((err) => err.message);
    throw new Error(message.join("\n"));
  } else return PAYMENT_BODY_SCHEMA;
}

module.exports = paymentBodyValidator;
