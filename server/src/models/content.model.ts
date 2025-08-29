import mongoose, { Schema, Types } from "mongoose";
import { TContentType } from "../types/types";
import { v4 as uuidv4, v4 } from 'uuid';

export interface IContent extends Document {
  contentType: TContentType;
  title: string;
  vectorEmbedding: Number[];
  userId: Types.ObjectId;
  isPublic: boolean;
  url?: string;
  description?: string;
  imageUrl?: string;
  caption?: string;
  createdAt: Date;
  updatedAt: Date;
}

const contentSchema: Schema = new Schema(
  {
    contentType: {
      type: String,
      enum: ["Note", "Link", "Tweet", "Spotify", "YouTube", "Reddit", "Other"],
      required: true,
    },

    title: {
      type: String,
      required: true,
    },
    vectorEmbedding: {
      type: [Number],
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    shareId : {
        type: String,
        required: true,
        unique: true,
        default: () => v4()
    },

    url: {
      type: String,
    },
    description: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    body: {
      type: String,
    },
  },
  { timestamps: true }
);

const Content = mongoose.model<IContent>("Content", contentSchema);

export default Content;
