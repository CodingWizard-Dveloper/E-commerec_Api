const { Store, Product } = require("../model/user.model");
const { v2: cloudinary } = require("cloudinary");
const fs = require("fs");

const addProduct = async ({
  type,
  title,
  desc,
  price,
  totalProducts,
  storeId,
  userId,
  productImage,
}) => {
  const thisStore = Store.findOne({ ownerId: userId });
  if (!thisStore) {
    return {
      response: { message: "You are not the owner of this shop" },
      status: 400,
    };
  }

  const newProduct = await Product.create({
    type,
    title,
    desc,
    price,
    totalProducts,
    storeId,
    ownerId: userId,
    itemSelled: 0,
    createdAt: Date.now(),
  });

  const cloudResult = await cloudinary.uploader.upload(productImage?.path);

  newProduct.productImage = {
    url: cloudResult.secure_url,
    publicId: cloudResult.public_id,
  };

  newProduct.save();

  fs.unlink(productImage.path, (err) => {
    console.error(err);
  });

  return {
    response: { message: "Product added" },
    status: 200,
  };
};

const getProductsForAdmin = async (userId) => {
  const thisStore = await Store.findOne({ ownerId: userId });
  if (!thisStore) {
    return {
      response: { message: "You are not the owner of any store" },
      status: 400,
    };
  }
  let productToSend = [];

  const storeProducts = await Product.find({
    ownerId: userId,
    storeId: thisStore._id,
  });

  storeProducts?.forEach((product) => {
    product.productImage = product?.productImage?.url;
    productToSend = [...productToSend, product];
  });

  return {
    response: { message: "Product Found", products: productToSend },
    status: 200,
  };
};

const deleteProduct = async ({ productId, userId, storeId }) => {
  const thisProduct = await Product?.findOne({
    _id: productId,
    storeId: storeId,
  });

  if (thisProduct?.ownerId !== userId)
    return {
      response: {
        message: "You are not the owner of this product",
        products: (await getProductsForAdmin(userId))?.response.products,
      },
      status: 400,
    };

  await cloudinary?.uploader?.destroy(thisProduct?.productImage?.publicId);

  await Product?.findByIdAndDelete(productId);

  return {
    response: {
      message: "Product deleted",
      products: (await getProductsForAdmin(userId))?.response.products,
    },
    status: 200,
  };
};

module.exports = { addProduct, getProductsForAdmin, deleteProduct };
