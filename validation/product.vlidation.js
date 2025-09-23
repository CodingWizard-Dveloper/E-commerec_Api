const joi = require("joi");

const authHeader = joi.object().keys({
  Authorization: joi.string().required(),
});

const addProduct = {
  params: joi.object().keys({
    storeId: joi.string().required(),
  }),
  body: joi.object().keys({
    title: joi.string().min(3).max(30).required(),
    description: joi.string().min(8).max(80).required(),
    price: joi.number().required(),
    totalProducts: joi.number().required(),
    type: joi
      .string()
      .valid("electronics", "fashion", "living", "cosmatics", "books", "sports")
      .required(),
  }),
  Headers: authHeader,
};

const deleteProduct = {
  params: joi.object().keys({
    storeId: joi.string().required(),
    productId: joi.string().required(),
  }),
  Headers: authHeader,
};

const getProducts = {
  Headers: authHeader,
};

module.exports = {
  addProduct,
  getProducts,
  deleteProduct,
};
