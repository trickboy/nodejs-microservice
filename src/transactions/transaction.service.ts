import { Injectable, Inject } from '@nestjs/common';
import { TransactionDto } from '../dto/TransactionDto';
import { Connection, WorkflowClient } from '@temporalio/client';
import { TransactionWorkflow } from '../workflow/transaction.workflow';

@Injectable()
export class TransactionService {
  // constructor(@Inject('KAFKA_SERVICE') private readonly kafka: ClientKafka) {}
  // async initiateTransaction(txn: TransactionDto) {
  //   await firstValueFrom(this.kafka.emit('transactions', JSON.stringify(txn)));
  //   return { status: 'initiated', txn };
  //
  // }
  //   constructor() {
  //     const connection = new Connection({ address: '127.0.0.1:7233', namespace: 'payment' });
  //     this.client = new WorkflowClient(connection.service);
  //   }

    private client: WorkflowClient;
    constructor() {
      // Just create a WorkflowClient; no Connection constructor directly
      this.client = new WorkflowClient({
        namespace: 'payment',
        // address defaults to localhost:7233
      });
    }

    async initiateTransaction(txn: TransactionDto) {
      const workflowId = `txn-${txn.id}-${Date.now()}`;
      await this.client.start(TransactionWorkflow, {
        workflowId,
        taskQueue: 'transactions',
        args: [txn],
      });

      return { status: 'initiated', workflowId };
    }
}
