const { User, Store, Product } = require("../model/user.model");
const { v2: cloudinary } = require("cloudinary");
const fs = require("fs");
const { getUser } = require("./auth.service");

const createStore = async (data) => {
  try {
    const { storeName, description, ownerId, storeImage, type } = data;

    const existingStore = await Store.find({ storeName });
    const existingOwner = await User.findById(ownerId);

    if (existingOwner.storeId) {
      return {
        response: { message: "You are already the owner of a store" },
        status: 401,
      };
    }

    if (existingStore.length) {
      return {
        response: { message: "Store with this name already exists" },
        status: 409,
      };
    }

    const newStore = await Store.create({
      storeName,
      ownerId,
      description,
      type,
    });

    const cloudResult = await cloudinary.uploader.upload(storeImage.path);

    newStore.storeImage = {
      url: cloudResult?.secure_url,
      publicId: cloudResult?.public_id,
    };

    await newStore.save();

    const updatedUser = await User.findByIdAndUpdate(
      ownerId,
      { $set: { storeId: newStore._id } },
      { new: true, runValidators: true }
    );

    fs.unlink(storeImage.path, (err) => {
      if (err) {
        console.error("Error deleting temporary file:", err);
      } else {
        console.log("Temporary file deleted successfully:", storeImage.path);
      }
    });

    return {
      response: {
        message: "Store created successfully",
        user: (await getUser(updatedUser._id)).data.user,
      },
      status: 200,
    };
  } catch (e) {
    return {
      response: { message: `Unknown Error: ${e.message}` },
      status: 400,
    };
  }
};

const deleteStore = async (data) => {
  const { storeId, userId } = data;

  const thisUser = await User.findById(userId);
  const thisStore = await Store.findById(storeId);

  if (!thisStore) {
    return {
      status: 402,
      respnse: { message: "Store not existed" },
    };
  }
  if (!thisUser?.storeId.equals(thisStore?._id)) {
    return {
      status: 400,
      response: { message: "You are not the owner of this Store" },
    };
  }

  await cloudinary?.uploader?.destroy(thisStore?.storeImage?.publicId);

  await Store?.findByIdAndDelete(thisStore?._id);
  await User?.findByIdAndUpdate(thisUser?._id, {
    $set: { storeId: null },
  });

  await Product.deleteMany({ storeId, ownerId: userId });

  return {
    status: 201,
    response: { message: "Store Deleted" },
  };
};

const updateStore = async (data) => {
  const {
    storeAvatar,
    storeName,
    description,
    type,
    storeImage,
    ownerId,
    storeId,
  } = data;

  const thisStore = await Store.findById(storeId);

  if (!thisStore) {
    return {
      status: 402,
      respnse: { message: "Store not existed" },
    };
  }

  const updateData = {};

  if (thisStore.storeName !== storeName) {
    updateData.storeName = storeName;
  }

  if (thisStore?.description !== description) {
    updateData.description = description;
  }
  if (thisStore?.type !== type) {
    updateData.type = type;
  }

  if (storeAvatar || storeImage) {
    if (storeAvatar !== thisStore?.storeImage?.url) {
      cloudinary.uploader.destroy(thisStore?.storeImage?.publicId);
      const cloudResult = await cloudinary.uploader.upload(storeImage.path);
      updateData.storeImage = {
        url: cloudResult?.secure_url,
        publicId: cloudResult?.public_id,
      };
    }
  } else {
    cloudinary.uploader.destroy(thisStore?.storeImage?.publicId);
    updateData.storeImage = {
      url: undefined,
      publicId: undefined,
    };
  }

  // Only update if there are changes
  if (Object.keys(updateData).length > 0) {
    await Store.updateOne(
      { _id: storeId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    const user = await getUser(ownerId);

    return {
      status: 200,
      response: {
        message: "User updated successfully",
        user: user?.data?.user,
      },
    };
  }

  return {
    status: 200,
    response: { message: "No changes detected" },
  };
};

const getStore = async (userId) => {
  let storeToSend = {};
  const userStore = await User.findById(userId);
  if (userStore.storeId) {
    storeToSend = await Store.findById(userStore.storeId);
    storeToSend.storeImage = storeToSend?.storeImage?.url;

    return {
      status: 201,
      response: {
        message: "Store found",
        store: storeToSend,
      },
    };
  }

  return {
    status: 200,
    response: {
      message: "No store found",
      store: null,
    },
  };
};

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

const getProductsForStore = async (userId, query = {}) => {
  try {
    const thisStore = await Store.findOne({ ownerId: userId });
    if (!thisStore) {
      return {
        response: { message: "You are not the owner of any store" },
        status: 400,
      };
    }
    let productToSend = [];

    const limit = parseInt(query?.limit) || 10;
    const page = parseInt(query?.page) || 1;
    const sortBy = query?.sortBy || "createdAt";
    const order = query?.order === "asc" ? 1 : -1;

    const storeProducts = await Product.find({
      ownerId: userId,
      storeId: thisStore._id,
    })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ [sortBy]: order });

    const totalProducts = await Product.countDocuments({
      ownerId: userId,
      storeId: thisStore._id,
    });

    let reveniue = 0;
    storeProducts?.forEach((product) => {
      reveniue += product?.itemSelled * product?.price;
    });

    storeProducts?.forEach((product) => {
      product.productImage = product?.productImage?.url;
      productToSend = [...productToSend, product];
    });

    return {
      response: { products: productToSend, totalProducts, reveniue },
      status: 200,
    };
  } catch (e) {
    return {
      response: { message: e.message },
      status: 500,
    };
  }
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

const updateProduct = async ({
  title,
  desc,
  price,
  type,
  productId,
  storeId,
  userId,
  productImage,
  previousUrl,
}) => {
  const thisProduct = await Product?.findOne({
    _id: productId,
    storeId: storeId,
  });

  if (thisProduct?.ownerId !== userId) {
    return {
      response: {
        message: "You are not the owner of this product",
      },
      status: 400,
    };
  }

  const updateData = {};
  if (title !== thisProduct?.title) {
    updateData.title = title;
  }
  if (desc !== thisProduct?.desc) {
    updateData.desc = desc;
  }
  if (price !== thisProduct?.price) {
    updateData.price = price;
  }
  if (type !== thisProduct?.type) {
    updateData.type = type;
  }

  if (previousUrl || productImage) {
    if (previousUrl !== thisProduct.productImage.url) {
      cloudinary.uploader.destroy(thisProduct.productImage.publicId);

      const img = await cloudinary.uploader.upload(productImage?.path);

      updateData.productImage = {
        url: img?.secure_url,
        publicId: img?.public_id,
      };
    }
  } else {
    cloudinary.uploader.destroy(thisProduct.productImage.publicId);
    updateData.productImage = {
      url: null,
      publicId: null,
    };
  }

  if (Object.keys(updateData).length > 1) {
    await Product.updateOne(
      { _id: productId },
      { $set: updateData },
      { new: true, runValidators: true }
    );
  }

  return {
    response: { message: "Product Udated" },
    status: 200,
  };
};

module.exports = {
  deleteStore,
  createStore,
  updateStore,
  getStore,
  addProduct,
  getProductsForStore,
  deleteProduct,
  updateProduct,
};
