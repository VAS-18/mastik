import dotenv from "dotenv";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
dotenv.config();

//sign-Up
export const signUp = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(404).json({
        message: "Fields not found",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);

    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username,
      email,
      passwordHash,
    });

    newUser.save();

    res.status(201).json({
      message: "User Created!!!",
    });
  } catch (error) {}
};

//sign in
export const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid Creds",
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Creds",
      });
    }

    const payload = {
      id: user._id,
      username: user.username,
    };

    const secret = process.env.JWT_SECRET;

    const token = jwt.sign(payload, secret!, { expiresIn: "1h" });

    res.status(200).json({
      message: "Signed in successfully",
      Refresh_token: token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during sign in." });
  }
};
