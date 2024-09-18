const mongoose = require("mongoose");

require("dotenv").config();

const db = () => {
  mongoose
    .connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "Billing-System",
    })
    .then(() => {
      console.log("Successfully connected to MongoDB");
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB:", err);
    });
};

module.exports = db;
