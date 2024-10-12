import { Router } from "express";
import { publicEndpoint } from "../controllers/public.controller";

const publicRouter = Router();

// Public route
publicRouter.get("/public", publicEndpoint);

export default publicRouter;
