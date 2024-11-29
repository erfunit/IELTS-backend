import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { Test } from "./Test";
import { Part } from "./Part";

export enum SkillType {
  READING = "READING",
  LISTENING = "LISTENING",
  WRITING = "WRITING",
}

@Entity("skills")
export class Skill {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Test, (test) => test.skills)
  @JoinColumn({ name: "testId" })
  test: Test;

  @OneToMany(() => Part, (part) => part.skill, {
    cascade: true,
    onDelete: "CASCADE",
  })
  parts: Part[];

  @Column({
    type: "enum",
    enum: SkillType,
    default: SkillType.READING,
  })
  skillType: SkillType;

  @CreateDateColumn()
  createdAt: Date;
}
