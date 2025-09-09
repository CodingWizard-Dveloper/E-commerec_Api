const { authService } = require("../services");

const createUser = async (req, res) => {
  const { userName, password, email } = req.body;
  const profileImage = req.file;

  try {
    const { response, status } = await authService.createUser({
      userName,
      password,
      email,
      profileImage,
    });
    res.status(status).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getUser = async (req, res) => {
  const { userId } = req.user;

  const { status, data } = await authService.getUser(userId);

  res.status(status).json(data);
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const { status, data } = await authService.loginUser({ email, password });

  res.status(status).json(data);
};

const createStore = async (req, res) => {
  const { storeName, description, ownerId } = req.body;
  const storeImage = req.file;

  try {
    const { response, status } = await authService.createStore({
      storeName,
      description,
      ownerId,
      storeImage,
    });

    res.status(status).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const changeUser = async (req, res) => {
  const { email, password, name: userName, profileImage: avatar} = req.body;
  const { userId } = req.user;
  const profileImage = req.file;


  const { response, status } = await authService.changeUser({
    email,
    password,
    userName,
    userId,
    profileImage,
    avatar
  });

  res.status(status).json(response);
};

module.exports = {
  createUser,
  getUser,
  loginUser,
  createStore,
  changeUser,
};
