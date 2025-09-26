const { Product } = require("../model/user.model");

const getAllProducts = async (userId, query = {}) => {
  try {
    const { limit } = query;

    const products = await Product.find().limit(limit).sort({ createdAt: 1 });

    const productToSend = []

    products?.map(product =>{
      product.productImage = product.productImage.url
      productToSend.push(product)
    })

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

module.exports = { getAllProducts };
