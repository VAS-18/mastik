import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

//db connection
const connection_db = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.log("No Connection URI");
  }

  try {
    await mongoose.connect(uri!);
    console.log("Database Connected");
  } catch (error) {
    console.error("Something went wrong while connecting to database", error);
    process.exit(1);
  }
};

export default connection_db;
