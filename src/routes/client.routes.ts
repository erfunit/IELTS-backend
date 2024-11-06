import { Router } from "express";
import { authMiddleware, optionalAuth } from "../middlewares/auth.middleware";
import {
  getClientBooksControler,
  getClientSkillsController,
  purchaseBookController,
} from "../controllers/client.controller";

const clientRouter = Router();

clientRouter.post(
  "/purchaseBook/:bookId",
  authMiddleware,
  purchaseBookController
);

clientRouter.get("/books", optionalAuth, getClientBooksControler);

clientRouter.get("/skills", authMiddleware, getClientSkillsController);

export default clientRouter;
