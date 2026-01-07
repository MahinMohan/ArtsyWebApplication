const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  tokens : [{type:String}],
  favourites: [
    {
      artistId: { type: String, required: true },
      title: { type: String },
      birthyear: { type: String },
      deathyear: { type: String },
      nationality: { type: String },
      image: { type: String },
      addedAt: { type: Date, default: Date.now }
    }
  ],
  gravatar: {type:String, required: true}
});
 
const User = mongoose.model("User", userSchema);

const connectDB = async () => {
    const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://mahinmoh:XQFKsVjGQy2w0ThT@artistapp27112000.tgkia.mongodb.net/?retryWrites=true&w=majority&appName=artistapp27112000"
    try
    {
        await mongoose.connect(MONGO_URI,{useNewUrlParser: true});
        mongoose.connection.close();

    } catch(error)
    {
        console.log("Mongo Connection Failed")
    }
}


module.exports = User;
