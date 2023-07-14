import { promisify } from "util";
import jwt from "jsonwebtoken";

export const checkToken = async (token) => {
  return await promisify(jwt.verify)(token, process.env.JWT_SECRET);
};
