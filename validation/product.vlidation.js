const joi = require("joi");

const authHeader = joi.object().keys({
  Authorization: joi.string().required(),
});

const getProducts = {
  Headers: authHeader,
};

module.exports = {
  getProducts,
};
