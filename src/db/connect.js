const mongoose = require("mongoose");

const connectdb = (url) => {
  return mongoose.connect(url).then(() => console.log("DB connected"));
};

module.exports = connectdb;
