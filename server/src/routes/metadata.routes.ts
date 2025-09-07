import { Router } from "express";
import { getLinkMetadata } from "../controller/metadata.controller";

const metadataRouter = Router();

//route to get metadata
metadataRouter.post("/", getLinkMetadata);

export default metadataRouter;
