const { configDotenv } = require("dotenv");
const mongoose = require("mongoose");

require("dotenv").config();

exports.connect = () => {
  mongoose
    .connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("DB Connection successful ");
    })
    .catch((error) => {
      console.log("DB has connection issues");
      console.error(error);
      process.exit(1);
    });
};
