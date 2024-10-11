import { Router } from "express";
import { publicEndpoint } from "../controllers/publicController";

const publicRouter = Router();

// Public route
publicRouter.get("/public", publicEndpoint);

export default publicRouter;
