const mongoose = require("mongoose");

try {
    const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://mahinmoh:XQFKsVjGQy2w0ThT@artistapp27112000.tgkia.mongodb.net/?retryWrites=true&w=majority&appName=artistapp27112000"
    mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("MongoDB Connected...");
    } catch (error) {
      console.error("MongoDB connection failed:", error);
      process.exit(1);
    }



