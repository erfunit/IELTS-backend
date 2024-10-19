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
  getAllPartsController,
  getQuestionsController,
} from "../controllers/skill.controller";
import { skillSchema } from "../schemas/skill.schema";
import { questionSchema } from "../schemas/question.schema";
import { partSchema } from "../schemas/part.schema";

const skillRouter = Router();

/*
Missing endpoints:
2. get full list of QUESTIONS in a part
*/

// create new skill
skillRouter.post(
  "/",
  adminMiddleware,
  validateSchema(skillSchema),
  createSkillController
);

// get the full list of skills
skillRouter.get("/", adminMiddleware, getAllSkillsController);

// get one skill with id
skillRouter.get("/:skillId", adminMiddleware, getOneSkillController);

// update one skill with id
skillRouter.put(
  "/:skillId",
  adminMiddleware,
  validateSchema(skillSchema, true),
  updateSkillController
);

// delete one skill with id
skillRouter.delete("/:skillId", adminMiddleware, deleteSkillController);

// add new part to one skill
skillRouter.post(
  "/:skillId/parts",
  adminMiddleware,
  validateSchema(partSchema),
  createPartController
);

skillRouter.get("/:skillId/parts", adminMiddleware, getAllPartsController);

// update one part by skill and part id
skillRouter.put(
  "/:skillId/parts/:partId",
  adminMiddleware,
  validateSchema(partSchema, true),
  updatePartController
);

// delete one part with skill and part id
skillRouter.delete(
  "/:skillId/parts/:partId",
  adminMiddleware,
  deletePartController
);

// add question to a part with skill and part id
skillRouter.post(
  "/:skillId/parts/:partId/questions",
  adminMiddleware,
  validateSchema(questionSchema),
  createQuestionController
);

skillRouter.get(
  "/:skillId/parts/:partId/questions",
  adminMiddleware,
  getQuestionsController
);

// update one question with skill, part and question id
skillRouter.put(
  "/:skillId/parts/:partId/questions/:questionId",
  adminMiddleware,
  validateSchema(questionSchema, true),
  updateQuestionController
);

// delete one question with skill, part and question id
skillRouter.delete(
  "/:skillId/parts/:partId/questions/:questionId",
  adminMiddleware,
  deleteQuestionController
);

export default skillRouter;
