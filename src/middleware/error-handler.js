const { CustomAPIError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
  const customErr = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Somthing went wrong try again later",
  };
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }
  //validate err
  if (err.name === "ValidationError") {
    customErr.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(","); //"Please provide password and email";
    customErr.statusCode = 400;
  }
  //duplicate email (trùng email)
  if (err.code && err.code === 11000) {
    customErr.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please choose another value`;
    customErr.statusCode = 400;
  }
  //Cast err ( xảy ra khi)
  if (err.name === "CastError") {
    customErr.msg = `No item found with id :${err.value}`;
    customErr.statusCode = 404;
  }
  ///return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });

  return res.status(customErr.statusCode).json({ msg: customErr.msg });
};

module.exports = errorHandlerMiddleware;
