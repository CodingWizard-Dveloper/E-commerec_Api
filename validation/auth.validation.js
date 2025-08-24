const joi = require("joi");

const getUser = {
  Headers: joi.object().keys({
    Authorization: joi.string().required(),
  }),
};

const createUser = {
  body: joi.object().keys({
    userName: joi.string().min(3).max(30).required(),
    password: joi.string().min(6).max(100).required(),
    email: joi.string().email().required(),
  }),
  headers: joi.object().keys({
    Authorization: joi.string().required(),
  }),
};

const login = {
  body: joi.object().keys({
    password: joi.string().min(6).max(100).required(),
    email: joi.string().email().required(),
  }),
  headers: joi.object().keys({
    Authorization: joi.string().required(),
  }),
}

module.exports = {
  getUser,
  createUser,
  login
};
