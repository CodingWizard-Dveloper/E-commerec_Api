const { User, Store } = require("../model/user.model");
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

module.exports = {
  deleteStore,
  createStore,
  updateStore,
};
