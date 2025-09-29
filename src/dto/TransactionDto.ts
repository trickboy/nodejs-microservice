import { IsString, IsNumber } from 'class-validator';

export class TransactionDto {
  @IsString()
  id!: string;

  @IsNumber()
  amount!: number;

  @IsString()
  currency!: string;

  @IsString()
  reference!: string;
}