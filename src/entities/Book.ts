import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  AfterLoad,
} from "typeorm";
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

  @CreateDateColumn()
  createdAt: Date;

  @AfterLoad()
  setDiscountedPrice() {
    if (this.discountedPrice === null) {
      this.discountedPrice = this.originalPrice;
    }
  }
}
