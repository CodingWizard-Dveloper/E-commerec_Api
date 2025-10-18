const { Store } = require("../model/user.model");

/**
 * Take the storeName and tell that if the store with name is exists or not
 * @param {String} storeName 
 * @returns Boolean
 */

const checkStoreName = async (storeName) => {
  const existingStore = await Store.find({ storeName });

  if (existingStore.length) {
    return true;
  }
  return false;
};

module.exports = {
  checkStoreName,
};
