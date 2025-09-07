import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connection_db from "./utils/db";

dotenv.config();

//express app initialization
const app = express();

//express middlewares
app.use(cookieParser());
app.use(cors({ origin: '*', credentials: true }));

//db connection
connection_db();

app.use(express.json());
//api routes
import authRouter from "./routes/auth.routes";
import userRouter from "./routes/user.routes";
import metadataRouter from "./routes/metadata.routes";

//auth route 
app.use("/api/v1/auth", authRouter);
//user routes
app.use("/api/v1/user", userRouter);
//route to getmeta data
app.use("/api/v1/metadata", metadataRouter);

//server start
const port = process.env.PORT ?? 4000;

app.listen(port, () => {
  console.log(
    `backend running on ${port}`
  );
});
