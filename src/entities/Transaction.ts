// src/entities/Transaction.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  referenceId!: string; // workflowId or business reference

  @Column()
  amount!: number;

  @Column({ default: 'PENDING' })
  status!: string; // PENDING | RUNNING | COMPLETED | FAILED

  @Column({ nullable: true })
  finishedAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}