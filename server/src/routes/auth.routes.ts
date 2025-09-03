import { Router } from "express";
import { logout, signIn, signUp } from "../controller/auth.controller";

const authRouter = Router();

authRouter.post("/sign-up", signUp);
authRouter.post("/sign-in", signIn);
authRouter.post("/logout", logout);

export default authRouter;
