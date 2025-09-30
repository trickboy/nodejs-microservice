import { Kafka, Producer } from 'kafkajs';
let producer: Producer | null = null;
let connected = false;
import { AppDataSource, initDB } from '../db';
import { Transaction } from '../entities/Transaction';


export async function getProducer(): Promise<Producer> {
  if (producer && connected) {
    return producer; // already connected
  }

  const kafka = new Kafka({ brokers: ['localhost:9092'] });
  producer = kafka.producer();

  try {
    await producer.connect();
    connected = true;
    console.log('Kafka producer connected');
  } catch (err) {
    connected = false;
    console.error('Kafka connection failed, retrying in 5s', err);
    producer = null; // reset
    await new Promise((res) => setTimeout(res, 5000));
    return getProducer(); // retry
  }

  return producer;
}
//   return producer;
// }

export async function debitWallet(txn: any) {
  const producer = await getProducer();
  try {
    await producer.send({
      topic: 'wallet-debit',
      messages: [{ key: String(txn.id), value: JSON.stringify(txn) }],
    });
  } catch (err) {
    console.error('Failed to send message to Kafka, will retry via Temporal', err);
    throw err; // Temporal will retry activity
  }

}

export async function creditMerchant(txn: any) {
  const producer = await getProducer();
  try {
    await producer.send({
      topic: 'wallet-debit',
      messages: [{ key: String(txn.id), value: JSON.stringify(txn) }],
    });
  } catch (err) {
    console.error(
      'Failed to send message to Kafka, will retry via Temporal',
      err,
    );
    throw err; // Temporal will retry activity
  }

}

const failedTxns = new Set<number>();
export async function logAudit(txn: any) {
  const producer = await getProducer();
  try {

    // if (!txn._failed) {
    //   txn._failed = true;
    //   await debitWallet({ ...txn, simulateFail: true });
    // } else {
    //   await debitWallet({ ...txn, simulateFail: false });
    // }

    await producer.send({
      topic: 'wallet-debit',
      messages: [{ key: String(txn.id), value: JSON.stringify(txn) }],
    });

  } catch (err) {
    console.error('Failed to send message to Kafka, will retry via Temporal', err);
    throw err; // Temporal will retry activity
  }

}

export async function saveWorkflowResult(result: any) {
    await initDB(); // ensure connection is established

    const repo = AppDataSource.getRepository(Transaction);

    // Update if exists, else create
    let txn = await repo.findOne({ where: { referenceId: result.txnId.toString() } });
    if (!txn) {
      txn = repo.create({
        referenceId: result.txnId.toString(),
        amount: result.amount || 0,
        status: result.status,
        finishedAt: result.finishedAt ? new Date(result.finishedAt) : undefined,
      });
    } else {
      txn.status = result.status;
      txn.finishedAt = result.finishedAt ? new Date(result.finishedAt) : undefined;
    }

    await repo.save(txn);
    console.log('✅ Transaction saved:', txn);
}

