const { DOCUMENTS_UPLOAD_SCHEMA } = require("../schema/documentsSchema");

function documentsValidator(body) {
  const DOCUMENTS_SCHEMA = DOCUMENTS_UPLOAD_SCHEMA.validate(body, {
    abortEarly: false,
  });
  if (DOCUMENTS_SCHEMA.error?.details.length) {
    let message = DOCUMENTS_SCHEMA.error?.details.map((err) => err.message);
    throw new Error(message.join("\n"));
  } else return DOCUMENTS_SCHEMA;
}

module.exports = documentsValidator;
