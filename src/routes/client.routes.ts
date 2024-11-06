import { Router } from "express";
import { authMiddleware, optionalAuth } from "../middlewares/auth.middleware";
import {
  getClientBooksControler,
  getClientPartsController,
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
clientRouter.get("/parts", authMiddleware, getClientPartsController);

export default clientRouter;
