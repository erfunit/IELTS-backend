import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Book } from "./Book";

@Entity("user_books")
export class UserBook {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.userBooks, { onDelete: "CASCADE" })
  user: User;

  @ManyToOne(() => Book, (book) => book.userBooks, { onDelete: "CASCADE" })
  book: Book;

  @CreateDateColumn()
  purchaseDate: Date;

  @Column({ type: "decimal" })
  priceAtPurchase: number; // Track the price at which the book was purchased
}
