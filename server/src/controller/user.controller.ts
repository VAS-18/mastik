import { Request, Response } from "express";
import User from "../models/user.model";
import Content, { IContent } from "../models/content.model";
import { TContentType } from "../types/types";
import { Types } from "mongoose";
import axios from "axios";
import { parse } from "tldts";

//get user details (public)
export const getUserInfo = async (req: Request, res: Response) => {
  const { username } = req.body;

  if (!username) {
    return res.status(404).json({
      message: "username not found",
    });
  }

  const user = await User.findOne({
    username,
  });

  if (!user) {
    return res.status(404).json({
      message: `No user found with the username [${username}]`,
    });
  }

  res.status(200).json({
    message: "found the user!!",
    username: username,
  });
};

//get user details
export const getMe = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//User Actions: Adding, Deleting, Share etc

//adding content
export const addContent = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required.",
      });
    }

    const { contentType, url, title, description, body, imageUrl } = req.body;

    const validContentTypes: TContentType[] = ["Note", "Link"];
    if (!contentType || !validContentTypes.includes(contentType)) {
      return res.status(400).json({
        message: "Invalid content type.",
      });
    }

    let finalTitle = title;
    let finalDescription = description;
    let finalImageUrl = imageUrl;

    switch (contentType) {
      case "Note":
        if (!body) {
          return res.status(400).json({ message: "Note must have a body." });
        }
        break;
      case "Link":
        if (!url) {
          return res.status(400).json({ message: "Link must have a URL." });
        }

        const urlData = await axios.post(
          "http://localhost:3000/api/v1/metadata",
          {
            url: url,
          }
        );
        const embeddingsRes = await axios.post("http://localhost:8000/scrape", {
          req_url: url,
        });

        const { text, embeddings } = embeddingsRes.data;

        if (!text || !embeddings) {
          return res
            .status(500)
            .json({ message: "Failed to scrape or embed content." });
        }

        console.log(embeddings);

        console.log(urlData);

        const metaData = urlData.data.data;
        const parsed = parse(url).domain;
        const urlProvider = parsed?.split(".")[0];
        const urlTitle = metaData?.title || null;
        const urlDescription = metaData?.description || null;
        const urlImage = metaData?.image || null;

        finalTitle = urlTitle || title;
        finalDescription = urlDescription || description;
        finalImageUrl = urlImage || imageUrl;

        const newContentData: Partial<IContent> = {
          contentType: contentType as TContentType,
          title: finalTitle,
          //@ts-ignore
          userId,
          isPublic: false,
          vectorEmbedding: embeddings,
          url: url,
          platform: urlProvider,
          description: finalDescription,
          body,
          imageUrl: finalImageUrl,
        };

        const createdContent = await Content.create(newContentData);

        res.status(201).json({ content: createdContent });

        break;

      case "Image":
        if (!imageUrl) {
          return res
            .status(400)
            .json({ message: "Image must have an image URL." });
        }
        break;
    }
  } catch (error) {
    console.error("Error in addContent:", error);
    res.status(500).json({ message: "An internal server error occurred." });
  }
};

//deleting content
export const deleteContent = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    const contentId = req.params.id;

    console.log(contentId);

    if (!userId) {
      return res.status(403).json({
        message: "Not Authorized",
      });
    }

    const userObjectId = new Types.ObjectId(userId);
    const contentObjectId = new Types.ObjectId(contentId);

    const deletedContent = await Content.deleteOne({
      _id: contentObjectId,
      userId: userObjectId,
    });

    if (!deletedContent) {
      return res.status(404).json({
        message: "Content not found or not authorized",
      });
    }

    res.status(200).json({
      message: "Content Deleted!",
      data: deletedContent,
    });
  } catch (error) {
    console.error("Error deleting content:", error);
    res.status(500).json({
      message:
        "An internal server error occurred while trying to delete the content.",
    });
  }
};

//editing content
export const editContent = async (req: Request, res: Response) => {};

//get all content
export const getAll = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(403).json({
        message: "No Autho",
      });
    }

    const userData = await Content.find({
      userId: userId,
    });

    res.status(200).json({
      data: userData,
    });
  } catch (error) {
    console.error("Error deleting content:", error);
    res.status(500).json({
      message:
        "An internal server error occurred while trying to delete the content.",
    });
  }
};


//search 
export const search = async (req: Request, res: Response) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({
      message: "No search query found",
    });
  }

  try {
    const queryResponse = await axios.post(
      "http://localhost:8000/embed",
      { query },
      { headers: { "Content-Type": "application/json" } }
    );

    const embeddingVector = queryResponse.data.embedding;

    const pipeline = [
      {
        $vectorSearch: {
          index: "vector_index",
          queryVector: embeddingVector,
          path: "vectorEmbedding",
          limit: 2,
          numCandidates: 5,
        },
      },
    ];

    const results = await Content.aggregate(pipeline);

    return res.status(200).json({
      search: results,
    });
  } catch (error: any) {
    console.error("Error:", error.response || error.message);
    res.status(500).json({
      message:
        "An internal server error occurred while trying to embed search query.",
    });
  }
};
