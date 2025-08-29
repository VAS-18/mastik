import { Request, Response } from "express";
import User from "../models/user.model";

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


export const getMe = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};