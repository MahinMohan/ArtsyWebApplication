const mongoose = require("mongoose");

try {
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) {
        throw new Error("MONGO_URI environment variable is not set");
    }
    mongoose.connect(MONGO_URI);
      console.log("MongoDB Connected...");
    } catch (error) {
      console.error("MongoDB connection failed:", error);
      process.exit(1);
    }



