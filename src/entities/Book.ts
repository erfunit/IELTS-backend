import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  AfterLoad,
} from "typeorm";
import { UserBook } from "./UserBook";
import { Test } from "./Test";

@Entity("books")
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  image?: string;

  @Column()
  name: string;

  @Column()
  originalPrice: number;

  @Column({ nullable: true, default: null })
  discountedPrice?: number;

  @Column({ nullable: true })
  discountPercentage?: number;

  @Column()
  publisher: string;

  @OneToMany(() => Test, (test) => test.book)
  tests: Test[];

  // One-to-many relation to track which users have purchased this book
  @OneToMany(() => UserBook, (userBook) => userBook.book)
  userBooks: UserBook[];

  @CreateDateColumn()
  createdAt: Date;

  @AfterLoad()
  setDiscountedPrice() {
    if (this.discountedPrice === null) {
      this.discountedPrice = this.originalPrice;
    }
  }
}
