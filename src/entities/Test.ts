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

  // Add onDelete: "CASCADE" to automatically delete tests when a book is deleted
  @ManyToOne(() => Book, (book) => book.tests, { onDelete: "CASCADE" })
  @JoinColumn({ name: "bookId" })
  book: Book;

  @Column({ default: true })
  isPaid?: boolean;

  @OneToMany(() => Skill, (skill) => skill.test, {
    cascade: true,
    onDelete: "CASCADE",
  })
  skills: Skill[];

  @CreateDateColumn()
  createdAt: Date;
}
