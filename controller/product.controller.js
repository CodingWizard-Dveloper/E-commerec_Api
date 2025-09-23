const { productService } = require("../services");

const addProduct = async (req, res) => {
  const { type, title, description: desc, price, totalProducts } = req.body;
  const { userId } = req.user;
  const productImage = req.file;
  const { storeId } = req.params;

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

const getProductsForAdmin = async (req, res) => {
  const { userId } = req.user;

  const { response, status } = await productService.getProductsForAdmin(userId);

  res.json(response).status(status);
};

const deleteProduct = async (req, res) => {
  const { productId, storeId } = req.params;
  const { userId } = req.user;

  const { response, status } = await productService?.deleteProduct({
    productId,
    storeId,
    userId,
  });

  res.json(response).status(status);
};

module.exports = {
  addProduct,
  getProductsForAdmin,
  deleteProduct,
};
