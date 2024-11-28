import { Router } from "express";
import { authMiddleware, optionalAuth } from "../middlewares/auth.middleware";
import {
  getClientBooksControler,
  getClientPartsController,
  getClientSkillsController,
  purchaseBookController,
  submitQuestionsController,
} from "../controllers/client.controller";

const clientRouter = Router();

clientRouter.post(
  "/purchaseBook/:bookId",
  authMiddleware,
  purchaseBookController
);

clientRouter.get("/books", optionalAuth, getClientBooksControler);

clientRouter.get("/skills", optionalAuth, getClientSkillsController);
clientRouter.get("/parts", authMiddleware, getClientPartsController);
clientRouter.post(
  "/submit-questions",
  authMiddleware,
  submitQuestionsController
);

export default clientRouter;
