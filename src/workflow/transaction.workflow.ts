import { proxyActivities } from '@temporalio/workflow';

const { debitWallet,
  creditMerchant,
  logAudit
} = proxyActivities({
  startToCloseTimeout: '1 minute',
});

export async function TransactionWorkflow(txn: any) {
  await debitWallet(txn);
  await creditMerchant(txn);
  await logAudit(txn);
}