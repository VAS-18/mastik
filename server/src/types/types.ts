import { Types } from "mongoose";

export type TContentType =
  | "Note"
  | "Link"
  | "Tweet"
  | "Spotify"
  | "YouTube"
  | "Reddit"
  | "Other";


export interface IUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
}


export interface IContent extends Document {
  contentType: TContentType;
  title: string;
  vectorEmbedding?: number[];
  userId: Types.ObjectId;
  isPublic: boolean;
  shareId: string;
  platform?: string;
  url?: string;
  description?: string;
  imageUrl?: string;
  scrapeStatus: "pending" | "processing" | "done" | "failed";
  createdAt: Date;
  updatedAt: Date;
}