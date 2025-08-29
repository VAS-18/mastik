import { Router } from "express";
import authMiddleware from "../middleware";
import {
  addContent,
  deleteContent,
  getAll,
  getMe,
  getUserInfo,
} from "../controller/user.controller";

const userRouter = Router();

//auth protected routes
userRouter.get("/get-me", authMiddleware, getMe);

//user action routes:
//get all the content
userRouter.get("/get-all", authMiddleware, getAll);

//get only the links
userRouter.get("/get-links", authMiddleware);

//get only the notes
userRouter.get("/get-notes", authMiddleware);

//add content
userRouter.post("/add", authMiddleware, addContent);

//delete content
userRouter.delete("/delete/:id", authMiddleware, deleteContent);

//update content
userRouter.patch("/edit", authMiddleware);

//public routes
userRouter.get("/me", getUserInfo);

export default userRouter;
