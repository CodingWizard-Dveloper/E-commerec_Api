const { productService } = require("../services");

const getAllProducts = async (req, res) => {
  const query = req.query;

  const { response, status } = await productService.getAllProducts(query);

  res.json(response).status(status);
};

module.exports = { getAllProducts };
