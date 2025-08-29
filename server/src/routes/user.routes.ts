import { Router } from "express";
import authMiddleware from "../middleware";
import { getMe, getUserInfo } from "../controller/user.controller";

const userRouter = Router();

//auth protected routes
userRouter.get("/get-me", authMiddleware, getMe);



//public routes
userRouter.get("/me", getUserInfo);

export default userRouter;
