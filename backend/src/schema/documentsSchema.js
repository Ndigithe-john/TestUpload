const joi = require("joi");
const DOCUMENTS_UPLOAD_SCHEMA = joi.object({
  title: joi.string().required(),
  course: joi.string().required(),
  type: joi.string().required(),
  pdf_url: joi.string().required(),
});

module.exports = { DOCUMENTS_UPLOAD_SCHEMA };
