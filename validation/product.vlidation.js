const joi = require("joi");

const authHeader = joi.object().keys({
  Authorization: joi.string().required(),
});

const getProducts = {
  Headers: authHeader,
};

const getProduct = {
  Headers: authHeader,
  params: joi.object().keys({
    id: joi.string().required(),
  }),
};

module.exports = {
  getProducts,
  getProduct,
};
