const joi = require("joi");

const authHeader = joi.object().keys({
  accessToken: joi.string().required(),
  refreshToken: joi.string().required(),
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

const editUser = {
  body: joi.object().keys({
    email: joi.string().email().optional(),
    userName: joi.string().min(2).max(20).optional(),
    currentPass: joi.string().min(6).max(100).optional(),
    newPass: joi.string().min(6).max(100).when("currentPass", {
      is: true,
      then: joi.required(),
      otherwise: joi.optional(),
    }),
    profileImage: joi.string().optional(),
  }),
  headers: authHeader,
};

module.exports = {
  getUser,
  createUser,
  login,
  editUser,
};
