import mongoose, { Schema } from "mongoose";
import { IContent} from "../types/types";
import { v4 as v4 } from "uuid";


//schema for content
const contentSchema = new Schema<IContent>(
  {
    contentType: {
      type: String,
      enum: ["Note", "Link"],
      required: true,
    },
    title: { type: String, required: true },
    vectorEmbedding: { type: [Number], required: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isPublic: { type: Boolean, default: false },
    shareId: { type: String, required: true, unique: true, default: () => v4() },
    platform: { type: String },
    url: { type: String },
    description: { type: String },
    imageUrl: { type: String },
    body: { type: String },
    scrapeStatus: {
      type: String,
      enum: ["pending", "processing", "done", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Content = mongoose.model<IContent>("Content", contentSchema);

export default Content;
