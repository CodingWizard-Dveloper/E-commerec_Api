const joi = require("joi");

const authHeader = joi.object().keys({
  accessToken: joi.string().required(),
  refreshToken: joi.string().required(),
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
