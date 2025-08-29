import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/user.model";
import jwt from "jsonwebtoken";

//sign up
export const signUp = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Fields missing" });
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      email,
      hashedPassword,
    });

    return res.status(201).json({ message: "New user created" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error_message: "Something went wrong while sign up.",
    });
  }
};

//sign in
export const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      res.status(404).json({
        message: "Email Missing",
      });
    }

    if (!password) {
      res.status(404).json({
        message: "Password Missing",
      });
    }

    const user = await User.findOne({
      email,
    });

    if (!user) {
      res.status(400).json({
        message: "Invalid credentials",
      });
    }

    //password check
    const isMatch = await bcrypt.compare(password, user!.hashedPassword);

    if (!isMatch) {
      res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const payload = {
      id: user?._id,
      username: user?.username,
    };

    const secret = process.env.JWT_SECRET;
    const token = jwt.sign(payload, secret!, { expiresIn: "1h" });

    res.status(200).json({
      message: "Signed in successfully!",
      token: token,
      user: {
        id: user?._id,
        username: user?.username,
        email: user?.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during sign in." });
  }
};
