import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Book } from "./Book";

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

  //   @OneToMany(() => Exam, (exam) => exam.test)
  //   exams: Exam[];

  @CreateDateColumn()
  createdAt: Date;
}
