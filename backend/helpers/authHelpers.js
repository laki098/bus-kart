const { promisify } = require("util");
const jwt = require("jsonwebtoken");

module.exports.checkToken = async (token) => {
  return await promisify(jwt.verify)(token, process.env.JWT_SECRET);
};
