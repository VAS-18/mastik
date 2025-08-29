import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id: string;
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const bearer_token = req.headers["authorization"];

  if (!bearer_token) {
    return res.status(403).json({
      message: "No Token provided",
    });
  }

  const token = bearer_token.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authMiddleware;
