import { Connection, WorkflowClient } from '@temporalio/client';

let client: WorkflowClient;

/**
 * Create (or reuse) a Temporal client connection
 */
export async function getTemporalClient(): Promise<WorkflowClient> {
  if (!client) {
    const connection = await Connection.connect({
      // 👇 Port specified here (default 7233, override via .env)
      address: process.env.TEMPORAL_ADDRESS || 'localhost:7233',
    });

    client = new WorkflowClient({
      connection,
      namespace: 'payment',
    });
  }
  return client;
}

/**
 * Start the TransactionWorkflow with given txn data
 */
export async function startTransactionWorkflow(txn: any) {
  const client = await getTemporalClient();
  return client.start('TransactionWorkflow', {
    args: [txn],
    taskQueue: 'transactions',
    workflowId: `txn-${txn.id}`,
  });
}