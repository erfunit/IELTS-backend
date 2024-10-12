import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity("otp")
export class Otp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  otpCode: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: false })
  isUsed: boolean;

  @Column({ default: false })
  isExpired: boolean;

  // OTP validity duration in seconds
  @Column({ type: "int", default: 300 }) // OTP expires in 5 minutes
  maxAge: number;
}
