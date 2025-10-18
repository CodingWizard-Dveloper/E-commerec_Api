/**
 * It run the given function in a try Catch and return the responses and use in  services
 * @param {Function} func
 * @param {String} message
 * @param {Number} response
 * @returns Returning value of function
 */

const tryCatch = async (func, message = "Server error", res) => {
  try {
    const { response, status } = await func();
    return { response, status };
  } catch (e) {
    return {
      response: { message: `${message}: ${e.message}` },
      status: res || 500,
    };
  }
};

module.exports = tryCatch;
