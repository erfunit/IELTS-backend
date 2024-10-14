import { Router } from "express";
import { validateSchema } from "../middlewares/schema.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";
import {
  createSkillController,
  updateSkillController,
  deleteSkillController,
  getAllSkillsController,
  getOneSkillController,
  createPartController,
  updatePartController,
  deletePartController,
  createQuestionController,
  updateQuestionController,
  deleteQuestionController,
} from "../controllers/skill.controller";
import { skillSchema } from "../schemas/skill.schema";
import { questionSchema } from "../schemas/question.schema";
import { partSchema } from "../schemas/part.schema";

const skillRouter = Router();

skillRouter.post(
  "/",
  adminMiddleware,
  validateSchema(skillSchema),
  createSkillController
);
skillRouter.get("/", adminMiddleware, getAllSkillsController);
skillRouter.get("/:skillId", adminMiddleware, getOneSkillController);
skillRouter.put(
  "/:skillId",
  adminMiddleware,
  validateSchema(skillSchema, true),
  updateSkillController
);
skillRouter.delete("/:skillId", adminMiddleware, deleteSkillController);

skillRouter.post(
  "/:skillId/parts",
  adminMiddleware,
  validateSchema(partSchema),
  createPartController
);
skillRouter.put(
  "/:skillId/parts/:partId",
  adminMiddleware,
  validateSchema(partSchema, true),
  updatePartController
);
skillRouter.delete(
  "/:skillId/parts/:partId",
  adminMiddleware,
  deletePartController
);

skillRouter.post(
  "/:skillId/parts/:partId/questions",
  adminMiddleware,
  validateSchema(questionSchema),
  createQuestionController
);
skillRouter.put(
  "/:skillId/parts/:partId/questions/:questionId",
  adminMiddleware,
  validateSchema(questionSchema, true),
  updateQuestionController
);
skillRouter.delete(
  "/:skillId/parts/:partId/questions/:questionId",
  adminMiddleware,
  deleteQuestionController
);

export default skillRouter;
