const joi = require("joi");

const authHeader = joi.object().keys({
  Authorization: joi.string().required(),
});

const getUser = {
  Headers: authHeader,
};

const createUser = {
  body: joi.object().keys({
    userName: joi.string().min(2).max(20).required(),
    password: joi.string().min(6).max(100).required(),
    email: joi.string().email().required(),
    role: joi.string().valid("storeOwner", "client").default("client"),
    storeId: joi.string().optional(),
  }),
  headers: authHeader,
};

const login = {
  body: joi.object().keys({
    password: joi.string().min(6).max(100).required(),
    email: joi.string().email().required(),
  }),
  headers: authHeader,
};

const createStore = {
  body: joi.object().keys({
    storeName: joi.string().min(3).max(50).required(),
    description: joi.string().max(255).optional(),
    ownerId: joi.string().required(),
    storeAvatar: joi.any().optional(),
  }),
  headers: authHeader,
};

const changeUser = {
  body: joi.object().keys({
    email: joi.string().email().optional(),
    userName: joi.string().min(2).max(20).optional(),
    password: joi.string().min(6).max(100).optional(),
    profileImage: joi.string().optional(),
  }),
  headers: authHeader,
};

const deleteStore = {
  body: joi.object().keys({
    storeId: joi.string().required(),
  }),
  headers: authHeader,
};

module.exports = {
  getUser,
  createUser,
  login,
  createStore,
  changeUser,
  deleteStore,
};
