import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Part } from "./Part";

export enum QuestionType {
  MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
  MATCH_HEADING = "MATCH_HEADING",
  PARAGRAPH_INFORMATION = "PARAGRAPH_INFORMATION",
  TABLE_MATCHING = "TABLE_MATCHING",
  MULTI_SELECT = "MULTI_SELECT",
  FILL_IN_BLANKS_NO_OPTIONS = "FILL_IN_BLANKS_NO_OPTIONS",
  FILL_IN_BLANKS_WITH_OPTIONS = "FILL_IN_BLANKS_WITH_OPTIONS",
  TRUE_FALSE_NOT_GIVEN = "TRUE_FALSE_NOT_GIVEN",
  MATCHING_ITEMS = "MATCHING_ITEMS",
}

@Entity("questions")
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Part, (part) => part.questions)
  @JoinColumn({ name: "partId" })
  part: Part;

  @Column({
    type: "enum",
    enum: QuestionType,
  })
  questionType: QuestionType;

  @Column()
  questionText: string;

  // For multiple choice, match heading, and table matching options
  @Column({ type: "json", nullable: true })
  options?: string[]; // Multiple options, can be answers or headings

  // Correct answer(s), different types will use this differently (multi-select can be an array, fill-in-the-blank single string, etc.)
  @Column({ type: "json", nullable: true })
  correctAnswers?: string;

  @CreateDateColumn()
  createdAt: Date;
}
