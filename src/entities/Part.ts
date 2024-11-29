import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Skill } from "./Skill";
import { Question } from "./Question";

@Entity("parts")
export class Part {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Skill, (skill) => skill.parts, { onDelete: "CASCADE" })
  @JoinColumn({ name: "skillId" })
  skill: Skill;

  @Column({ nullable: true, type: "text" })
  passageOrPrompt?: string;

  @Column({ nullable: true })
  audioUrl?: string;

  @OneToMany(() => Question, (question) => question.part, {
    cascade: true,
    onDelete: "CASCADE",
  })
  questions: Question[];

  @CreateDateColumn()
  createdAt: Date;
}
