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

  @Column({ nullable: true })
  lastTestResultId: number; // Store the ID of the last test result

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
