const { Product } = require("../model/user.model");

const getAllProducts = async (userId, query = {}) => {
  try {
    const { limit } = query;

    const products = await Product.find().limit(limit).sort({ createdAt: 1 });

    const productToSend = [];

    products?.map((product) => {
      product.productImage = product.productImage.url;
      productToSend.push(product);
    });

    return {
      response: { products: productToSend },
      status: 200,
    };
  } catch (e) {
    return {
      response: { message: e.message, products: [] },
      status: 500,
    };
  }
};

const getProductById = async (id) => {
  try {
    const product = await Product.findById(id);

    const producToSend = {
      ...product._doc,
      productImage: product.productImage.url,
      itemRemained: product.totalProducts - product.itemSelled,
    };

    // product.productImage = product.productImage.url;
    // product.itemRemained = product.totalProducts - product.itemSelled

    return {
      response: { product: producToSend },
      status: 200,
    };
  } catch (e) {
    return {
      response: { message: e.message },
      status: 500,
    };
  }
};

module.exports = { getAllProducts, getProductById };
