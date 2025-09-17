import dotenv from "dotenv";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import transporter from "../service/email.service";
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

    const user = await User.create({
      username,
      email,
      passwordHash,
    });

    user.save();

    const payload = {
      id: user._id,
      username: user.username,
    };

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET not defined in environment variables");
    }

    const token = jwt.sign(payload, secret, { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    //welcome email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Weclome to mastik",
      text: `Welcome to mastik. Your account has been created using email-id : ${email}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      message: "User Created!!!",
      user: user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during sign up." });
  }
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
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Credentials, Please verify your email or password",
      });
    }

    const payload = {
      id: user._id,
      username: user.username,
    };

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET not defined in environment variables");
    }
    const token = jwt.sign(payload, secret, { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Signed in successfully",
      token: token,
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

//logout
export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "logged out!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during logout." });
  }
};

//verifyOTP
// export const sendVerifyOTP = async(req: Request, res: Response) => {
//   try {
//     const userId = req.user?.id;

//     const found = User.findById(userId);

//   } catch (error) {
    
//   }
// }