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

module.exports = {
  getStore,
  deleteStore,
  createStore,
  updateStore,
};
