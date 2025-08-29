import { Router } from "express";
import { getLinkMetadata } from "../controller/metadata.controller";

const metadataRouter = Router();

metadataRouter.post("/", getLinkMetadata);

export default metadataRouter;
