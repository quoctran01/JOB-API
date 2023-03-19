const { StatusCodes } = require("http-status-codes");
const { BadRequest, Unauthenticated } = require("../errors");
const UserSchema = require("../models/User");

const register = async (req, res) => {
  const user = await UserSchema.create({ ...req.body });
  const token = user.createJwt(); // instance methods in mongooes
  res
    .status(StatusCodes.CREATED)
    .json({ user: { name: user.name }, token: token });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequest("Please provider email and password");
  }
  const user = await UserSchema.findOne({ email });
  if (!user) {
    throw new Unauthenticated("Invalid Credentials");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new Unauthenticated("Invalid Credentials");
  }
  const token = user.createJwt();

  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};
module.exports = {
  register,
  login,
};
