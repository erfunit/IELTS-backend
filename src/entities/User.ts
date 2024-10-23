import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { UserBook } from "./UserBook";

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  phoneNumber: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: "simple-json", nullable: true })
  lastTest: {
    testId: number;
    date: Date;
  };

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  // One-to-many relation to track user's purchased books
  @OneToMany(() => UserBook, (userBook) => userBook.user)
  userBooks: UserBook[];
}
