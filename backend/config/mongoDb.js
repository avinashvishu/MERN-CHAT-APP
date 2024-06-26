const { cyan } = require("colors");
const color = require("colors");
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL, {
      //process.env.MONGO_URL
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connecteed: ${conn.connection.host}`.cyan.underline);
  } catch (err) {
    console.error(`Error : ${err}`.red);
    process.exit(1);
  }
};
module.exports = connectDB;
