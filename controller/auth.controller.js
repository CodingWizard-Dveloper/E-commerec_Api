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


const changeUser = async (req, res) => {
  const {
    email,
    currentPass,
    newPass,
    userName,
    profileImage: imageURL,
  } = req.body;
  const { userId } = req.user;
  const profileImage = req.file;

  const { response, status } = await authService.changeUser({
    email,
    currentPass,
    newPass,
    userName,
    userId,
    profileImage,
    imageURL,
  });

  res.status(status).json(response);
};

const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  try {
    const { response, status } = await authService.refreshToken(refreshToken);
    res.status(status).json(response);
  } catch (error) {
    res.status(401).json({ message: "Invalid refresh token" });
  }
};

module.exports = {
  createUser,
  getUser,
  loginUser,
  changeUser,
  refreshToken,
};
