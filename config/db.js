const mongoose = require("mongoose");

const connectDB = async (req, res, next) => {
  const conn = await mongoose.connect(process.env.URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  console.log(`Mongodb connected: ${conn.connection.host}`.cyan);
};

module.exports = connectDB;
