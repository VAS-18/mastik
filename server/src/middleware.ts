// middleware/auth.ts
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id: string;
  username?: string;
  [k: string]: any;
}

// Extend Express Request to include `user`
// You can also put this in a global.d.ts if you prefer.
export interface AuthRequest extends Request {
  user?: { id: string; username?: string; [k: string]: any };
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // 1) Try Authorization header first (Bearer ...)
    const authHeader = (req.headers["authorization"] || req.headers["Authorization"]) as string | undefined;
    let token: string | undefined;

    if (authHeader && typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // 2) Fallback: try cookie (requires cookie-parser middleware)
    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token as string;
    }

    if (!token) {
      // 401 Unauthorized (no credentials provided)
      return res.status(401).json({ message: "Authentication required (no token provided)" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET is not set in environment");
      return res.status(500).json({ message: "Server misconfiguration" });
    }

    // verify token - will throw if invalid/expired
    const decoded = jwt.verify(token, secret) as JwtPayload;

    // attach minimal user info to request for downstream handlers
    req.user = { id: decoded.id, ...(decoded.username ? { username: decoded.username } : {}) };

    return next();
  } catch (err: any) {
    console.error("Auth verify error:", err.message || err);
    // 401 Unauthorized for invalid/expired token
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authMiddleware;
