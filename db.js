import mongoose from "mongoose";
import 'dotenv/config'
const connectToMongo = () => {
  const URL = process.env.DATA_BASE
    // "mongodb+srv://arpitvermaetw:xT3JaNpWGSabOHPC@noteBook.v6pwutf.mongodb.net/iNoteBook";

  try {
    mongoose.connect(URL);
    console.log("Connect to mongodb Successfully");
  } catch (err) {
    console.log("Connection Failed! ", err.message);
  }
};

export default connectToMongo
