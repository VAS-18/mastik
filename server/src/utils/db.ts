import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const connect_db = async () => {
  const uri = process.env.MONGO_URI;

  try {
    await mongoose.connect(uri!);
    console.log("Connected to DB");
  } catch (error) {
    console.error("Database Failed to connect : ", error);
    process.exit(1);
  }
};

export default connect_db;
