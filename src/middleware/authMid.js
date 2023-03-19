const jwt = require("jsonwebtoken");
const { Unauthenticated } = require("../errors");

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new Unauthenticated("Unauthentication invalid");
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const userID = payload.userID;
    const name = payload.name;
    //req.user = { userID: payload.userID, name: payload.name };
    req.user = { userID, name };
    next();
  } catch (error) {
    throw new Unauthenticated("Unauthentication invalid");
  }
};

module.exports = auth;
