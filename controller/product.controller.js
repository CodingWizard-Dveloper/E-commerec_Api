const { productService } = require("../services");

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

  const { response, status } = await productService?.addProduct({
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

const getProduct = async (req, res) => {
  const { userId } = req.user;

  const { response, status } = await productService.getproducts(userId);

  res.json(response).status(status);
};

module.exports = {
  addProduct,
  getProduct,
};
