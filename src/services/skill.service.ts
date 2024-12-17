import { AppDataSource } from "../app";
import { Skill } from "../entities/Skill";
import { Part } from "../entities/Part";
import { Question } from "../entities/Question";

// file related imports:
import { uploadFile } from "../utils/uploadFile";
import multer from "multer";

import dotenv from "dotenv";
import { Request } from "express";
dotenv.config();

const storage = multer.memoryStorage();
export const uploadMiddlewareAudio = multer({ storage }).single("audio");

export const createNewPart = async (skillId: number, req: Request) => {
  const partRepository = AppDataSource.getRepository(Part);

  const { passageOrPrompt } = req.body;
  const file = req.file;

  if (!passageOrPrompt && !file) {
    throw new Error("Missing required fields or file");
  }

  const skill = { skillId } as any;

  try {
    const audioUrl = (await uploadFile(file)) || undefined;
    const newPart = partRepository.create({
      passageOrPrompt,
      audioUrl,
      skill: skill.skillId,
      // skill,
    });
    await partRepository.save(newPart);
    return { message: "New part created successfully", data: newPart };
  } catch (error: any) {
    throw new Error(error.message);
  }

  // const newPart = partRepository.create(part);
  // await partRepository.save(newPart);
  // return { message: "New part created successfully", data: newPart };
};

export const updatePartById = async (id: number, req: Request) => {
  const partRepository = AppDataSource.getRepository(Part);

  // Extract body data and file
  const { passageOrPrompt } = req.body;
  const file = req.file;

  try {
    // Find the existing part
    const existingPart = await partRepository.findOne({ where: { id } });
    if (!existingPart) {
      throw new Error("Part not found");
    }

    // Check if there are updates to apply
    if (!passageOrPrompt && !file) {
      throw new Error("No updates provided");
    }

    // Upload file if provided and get the URL
    const audioUrl = file ? await uploadFile(file) : undefined;

    // Merge the updated fields with the existing part
    const updatedPart = partRepository.merge(existingPart, {
      passageOrPrompt: passageOrPrompt || existingPart.passageOrPrompt,
      audioUrl: audioUrl || existingPart.audioUrl,
    });

    // Save the updated part
    await partRepository.save(updatedPart);

    return { message: "Part updated successfully", data: updatedPart };
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const createNewSkill = async (skill: Skill & { testId: number }) => {
  const skillRepository = AppDataSource.getRepository(Skill);
  const newSkill = skillRepository.create({
    ...skill,
    test: { id: skill.testId },
  });
  await skillRepository.save(newSkill);
  return { message: "New skill created successfully", data: newSkill };
};

export const getAllSkills = async () => {
  const skillRepository = AppDataSource.getRepository(Skill);
  return skillRepository.find({ relations: ["parts", "parts.questions"] });
};

export const getSkillById = async (id: number) => {
  const skillRepository = AppDataSource.getRepository(Skill);
  const skill = await skillRepository.findOne({
    where: { id },
    relations: ["parts", "parts.questions"],
  });
  if (!skill) throw Error("Skill not found");
  return skill;
};

export const updateSkillById = async (id: number, skill: Skill) => {
  const skillRepository = AppDataSource.getRepository(Skill);
  const existingSkill = await skillRepository.findOne({ where: { id } });
  const updatedSkill = await skillRepository.save({
    ...existingSkill,
    ...skill,
  });
  return { message: "Skill updated successfully", data: updatedSkill };
};

export const deleteSkillById = async (id: number) => {
  const skillRepository = AppDataSource.getRepository(Skill);
  const partRepository = AppDataSource.getRepository(Part);

  const skill = await skillRepository.findOne({
    where: { id },
    relations: ["parts"],
  });
  if (!skill) throw Error("Skill not found");

  // Delete parts explicitly
  await partRepository.delete({ skill: { id } });

  // Now delete the skill
  await skillRepository.delete(id);

  return { message: "Skill deleted successfully", data: skill };
};

export const getAllParts = async (skillId: number) => {
  const partRepository = AppDataSource.getRepository(Part);
  return await partRepository.find({ where: { skill: { id: skillId } } });
};

export const deletePartById = async (id: number) => {
  const partRepository = AppDataSource.getRepository(Part);
  const questionRepository = AppDataSource.getRepository(Question);

  // Find the part
  const part = await partRepository.findOne({ where: { id } });
  if (!part) throw Error("Part not found");

  // Delete associated questions
  await questionRepository.delete({ part: { id } });

  // Now delete the part
  await partRepository.delete(part.id);
  return { message: "Part deleted successfully", data: part };
};

export const createNewQuestion = async (partId: number, question: Question) => {
  const questionRepository = AppDataSource.getRepository(Question);
  question.part = { id: partId } as any;
  const newQuestion = questionRepository.create(question);
  await questionRepository.save(newQuestion);
  return { message: "New question created successfully", data: newQuestion };
};

export const getQuestions = async (skillId: number, partId: number) => {
  const questionRepository = AppDataSource.getRepository(Question);
  const result = await questionRepository.find({
    where: { part: { id: partId, skill: { id: skillId } } },
  });
  return result;
};

export const updateQuestionById = async (id: number, question: Question) => {
  const questionRepository = AppDataSource.getRepository(Question);
  const existingQuestion = await questionRepository.findOne({ where: { id } });
  const updatedQuestion = await questionRepository.save({
    ...existingQuestion,
    ...question,
  });
  return { message: "Question updated successfully", data: updatedQuestion };
};

export const deleteQuestionById = async (id: number) => {
  const questionRepository = AppDataSource.getRepository(Question);
  const question = await questionRepository.findOne({ where: { id } });
  if (!question) throw Error("Question not found");
  await questionRepository.delete(question.id);
  return { message: "Question deleted successfully", data: question };
};
