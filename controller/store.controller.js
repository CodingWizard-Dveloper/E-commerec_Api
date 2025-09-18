const { storeService } = require("../services");

const createStore = async (req, res) => {
  const { storeName, description, ownerId, type } = req.body;
  const storeImage = req.file;

  try {
    const { response, status } = await storeService.createStore({
      storeName,
      description,
      ownerId,
      storeImage,
      type,
    });

    res.status(status).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteStore = async (req, res) => {
  const { storeId } = req.body;
  const { userId } = req.user;

  const { response, status } = await storeService?.deleteStore({
    storeId,
    userId,
  });
  res.status(status).json(response);
};

const updateStore = async (req, res) => {
  const {
    storeImage: storeAvatar,
    storeName,
    description,
    type,
    ownerId,
    storeId,
  } = req.body;
  const storeImage = req.file;

  const { response, status } = await storeService.updateStore({
    storeAvatar,
    storeName,
    description,
    type,
    storeImage,
    ownerId,
    storeId,
  });

  res.json(response).status(status);
};

module.exports = { deleteStore, createStore, updateStore };
