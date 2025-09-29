import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { startTransactionWorkflow } from '../workflow/temporal.client';

@Injectable()
export class TemporalTestService implements OnApplicationBootstrap {
  async onApplicationBootstrap() {
    try {
      console.log('Starting test Temporal workflow...');
      await startTransactionWorkflow({ id: 123, amount: 500 });
      console.log('Workflow started successfully');
    } catch (err) {
      console.error('Error starting workflow:', err);
    }
  }
}