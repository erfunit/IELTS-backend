import { Request, Response } from "express";
import {
  createNewSkill,
  deleteSkillById,
  getAllSkills,
  getSkillById,
  updateSkillById,
  createNewPart,
  updatePartById,
  deletePartById,
  createNewQuestion,
  updateQuestionById,
  deleteQuestionById,
  getAllParts,
  getQuestions,
} from "../services/skill.service";
import { controllerWrapper } from "../utils/controllerWrapper";

export const createSkillController = async (req: Request, res: Response) => {
  await controllerWrapper(res, createNewSkill, req.body);
};

export const getAllSkillsController = async (req: Request, res: Response) => {
  await controllerWrapper(res, getAllSkills);
};

export const getOneSkillController = async (req: Request, res: Response) => {
  const skillId = req.params.skillId;
  await controllerWrapper(res, getSkillById, skillId);
};

export const updateSkillController = async (req: Request, res: Response) => {
  const skillId = req.params.skillId;
  await controllerWrapper(res, updateSkillById, skillId, req.body);
};

export const deleteSkillController = async (req: Request, res: Response) => {
  const skillId = req.params.skillId;
  await controllerWrapper(res, deleteSkillById, skillId);
};

export const createPartController = async (req: Request, res: Response) => {
  const skillId = req.params.skillId;
  await controllerWrapper(res, createNewPart, skillId, req.body);
};

export const getAllPartsController = async (req: Request, res: Response) => {
  const skillId = req.params.skillId;
  await controllerWrapper(res, getAllParts, skillId);
};

export const updatePartController = async (req: Request, res: Response) => {
  const partId = req.params.partId;
  await controllerWrapper(res, updatePartById, partId, req.body);
};

export const deletePartController = async (req: Request, res: Response) => {
  const partId = req.params.partId;
  await controllerWrapper(res, deletePartById, partId);
};

export const createQuestionController = async (req: Request, res: Response) => {
  const partId = req.params.partId;
  await controllerWrapper(res, createNewQuestion, partId, req.body);
};

export const getQuestionsController = async (req: Request, res: Response) => {
  const { skillId, partId } = req.params;
  await controllerWrapper(res, getQuestions, skillId, partId);
};

export const updateQuestionController = async (req: Request, res: Response) => {
  const questionId = req.params.questionId;
  await controllerWrapper(res, updateQuestionById, questionId, req.body);
};

export const deleteQuestionController = async (req: Request, res: Response) => {
  const questionId = req.params.questionId;
  await controllerWrapper(res, deleteQuestionById, questionId);
};
