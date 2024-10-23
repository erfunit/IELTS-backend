import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { Book } from "./Book";
import { Skill } from "./Skill";

@Entity("tests")
export class Test {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Book, (book) => book.tests)
  @JoinColumn({ name: "bookId" })
  book: Book;

  @Column({ default: true })
  isPaid?: boolean;

  @OneToMany(() => Skill, (skill) => skill.test, { cascade: true })
  skills: Skill[];

  @CreateDateColumn()
  createdAt: Date;
}
