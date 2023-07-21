const mongoose = require("mongoose");
require('dotenv').config({path:"./.env"})

const mongoUrl = process.env.MONGO_URL;

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoUrl,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
};
module.exports = connectToMongo;
