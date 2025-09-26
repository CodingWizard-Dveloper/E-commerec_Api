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

const getStore = async (req, res) => {
  const { userId } = req.user;

  const { response, status } = await storeService.getStore(userId);

  res.json(response).status(status);
};

const addProduct = async (req, res) => {
  const {
    type,
    title,
    description: desc,
    price,
    totalProducts,
    storeId,
  } = req.body;
  const { userId } = req.user;
  const productImage = req.file;

  const { response, status } = await storeService?.addProduct({
    type,
    title,
    desc,
    price,
    totalProducts,
    storeId,
    userId,
    productImage,
  });

  res.json(response).status(status);
};

const getProductsForStore = async (req, res) => {
  const { userId } = req.user;
  const query = req.query;

  const { response, status } = await storeService.getProductsForStore(
    userId,
    query
  );

  res.json(response).status(status);
};

const deleteProduct = async (req, res) => {
  const { productId, storeId } = req.params;
  const { userId } = req.user;

  const { response, status } = await storeService?.deleteProduct({
    productId,
    storeId,
    userId,
  });

  res.json(response).status(status);
};

module.exports = {
  deleteStore,
  createStore,
  updateStore,
  getStore,
  addProduct,
  getProductsForStore,
  deleteProduct,
};
