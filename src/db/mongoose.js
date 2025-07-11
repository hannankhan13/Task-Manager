const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URL, {
    ssl: true,
    tlsAllowInvalidCertificates: false,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));
