import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";
import { Test } from "./Test";

@Entity("user_test_results")
export class UserTestResult {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  testId: number;

  @Column({ nullable: true })
  readingBand: number;

  @Column({ nullable: true })
  listeningBand: number;

  @Column({ type: "simple-json" })
  answers: {
    questionId: number;
    isCorrect: boolean;
    correctAnswer: string | string[];
    userAnswer: string | string[];
  }[];

  @CreateDateColumn()
  createdAt: Date;
}
