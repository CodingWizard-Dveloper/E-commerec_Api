const joi = require("joi");

const authHeader = joi.object().keys({
  Authorization: joi.string().required(),
});

const deleteStore = {
  body: joi.object().keys({
    storeId: joi.string().required(),
  }),
  headers: authHeader,
};

const createStore = {
  body: joi.object().keys({
    storeName: joi.string().min(3).max(50).required(),
    description: joi.string().max(255).optional(),
    ownerId: joi.string().required(),
    storeAvatar: joi.any().optional(),
    type: joi
      .string()
      .valid(
        "electronics",
        "fashion",
        "living",
        "cosmatics",
        "books",
        "sports"
      ),
  }),
  headers: authHeader,
};

const updateStore = {
  body: joi.object().keys({
    storeName: joi.string().min(3).max(50).required(),
    description: joi.string().max(255).optional(),
    ownerId: joi.string().required(),
    storeId: joi.string().required(),
    storeImage: joi.any().optional(),
    type: joi
      .string()
      .valid(
        "electronics",
        "fashion",
        "living",
        "cosmatics",
        "books",
        "sports"
      ),
  }),
  headers: authHeader,
};

const getStore = {
  headers: authHeader,
};

const addProduct = {
  body: joi.object().keys({
    title: joi.string().min(3).max(30).required(),
    description: joi.string().min(8).max(80).required(),
    price: joi.number().required(),
    totalProducts: joi.number().required(),
    type: joi
      .string()
      .valid("electronics", "fashion", "living", "cosmatics", "books", "sports")
      .required(),
    storeId: joi.string().required(),
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

const updateProduct = {
  Headers: authHeader,
  body: joi.object().keys({
    title: joi.string().min(3).max(30).required(),
    desc: joi.string().min(8).max(80).required(),
    price: joi.number().required(),
    previousUrl: joi.string().optional(),
    type: joi
      .string()
      .valid("electronics", "fashion", "living", "cosmatics", "books", "sports")
      .required(),
  }),
  params: joi.object().keys({
    storeId: joi.string().required(),
    productId: joi.string().required(),
  }),
};

module.exports = {
  getStore,
  deleteStore,
  createStore,
  updateStore,
  addProduct,
  deleteProduct,
  getProducts,
  updateProduct,
};
