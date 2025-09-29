import { Worker } from '@temporalio/worker';
import * as activities from './activities/transaction.activities';

async function run() {
  const worker = await Worker.create({
    workflowsPath: require.resolve('./workflow/transaction.workflow.ts'),
    activities,
    taskQueue: 'transactions',
    namespace: 'payment',
  });
  await worker.run();
}

// run().catch((err) => console.error(err));
run().catch(err => {
  console.error(err);
  process.exit(1);
});