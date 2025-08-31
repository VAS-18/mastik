import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connection_db from "./utils/db";

dotenv.config();

const app = express();

app.use(express.json());

const frontendOrigin = process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173';
app.use(cors({ origin: frontendOrigin, credentials: true }));

connection_db();

//api routes
import authRouter from "./routes/auth.routes";
import userRouter from "./routes/user.routes";
import metadataRouter from "./routes/metadata.routes";

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/metadata", metadataRouter);

//server start
const port = process.env.PORT ?? 4000;

app.listen(port, () => {
  console.log(`backend running on ${port} — CORS allowed for ${frontendOrigin}`);
});
