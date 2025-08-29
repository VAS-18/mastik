import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connect_db from "./utils/db";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

//db connection
connect_db();

//api routes
import authRouter from "./routes/auth.routes";

app.use("/api/v1/auth", authRouter);

app.post("/", (req: Request, res: Response) => {
  res
    .json({
      message: "ITS WORKING BABY",
    })
    .status(200);
});

//server start
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`app running on ${port}`);
});
