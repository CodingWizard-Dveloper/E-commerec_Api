const { authService } = require("../services");

const createUser = async (req, res) => {
  const { userName, password, email } = req.body;

  try {
    const { response, status } = await authService.createUser({
      userName,
      password,
      email,
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

  const {status, data} = await authService.loginUser({email, password})

  res.status(status).json(data)
};

module.exports = {
  createUser,
  getUser,
  loginUser
};
