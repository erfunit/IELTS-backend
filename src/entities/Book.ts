import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  AfterLoad,
} from "typeorm";

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

  @CreateDateColumn()
  createdAt: Date;

  @AfterLoad()
  setDiscountedPrice() {
    if (this.discountedPrice === null) {
      this.discountedPrice = this.originalPrice;
    }
  }
}
