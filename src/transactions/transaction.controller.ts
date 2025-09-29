import { Controller, Post, Body } from '@nestjs/common';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly txnService: TransactionService) {}

  @Post()
  async create(@Body() data: any) {
    return this.txnService.initiateTransaction(data);
  }
}