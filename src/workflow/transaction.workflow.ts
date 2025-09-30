import { proxyActivities } from '@temporalio/workflow';

// const { debitWallet,
//   creditMerchant,
//   logAudit
// } = proxyActivities({
//   startToCloseTimeout: '1 minute',
// });

const { debitWallet, creditMerchant, logAudit, saveWorkflowResult } = proxyActivities<{
  debitWallet(txn: any): Promise<void>;
  creditMerchant(txn: any): Promise<void>;
  logAudit(txn: any): Promise<void>;
  saveWorkflowResult(result: any): Promise<void>; // 👈 new activity
}>({
  startToCloseTimeout: '1 minute',
});


export async function TransactionWorkflow(txn: any) {
  await logAudit({ ...txn, status: 'STARTED' });
  await debitWallet(txn);
  await logAudit({ ...txn, status: 'WALLET_DEBITED' });
  await creditMerchant(txn);
  await logAudit({ ...txn, status: 'MERCHANT_CREDITED' });
  await logAudit({ ...txn, status: 'COMPLETED' });

  await saveWorkflowResult({
    txnId: txn.id,
    status: 'COMPLETED',
    finishedAt: new Date().toISOString(),
  });

}

// export async function TransactionWorkflow(txn: any) {
//   await debitWallet(txn);
//   await creditMerchant(txn);
//   await logAudit(txn);
//
//     // Persist workflow completion
//   await saveWorkflowResult({
//     txnId: txn.id,
//     status: 'COMPLETED',
//     finishedAt: new Date().toISOString(),
//   });
// }
//
