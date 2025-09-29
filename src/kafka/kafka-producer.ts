// src/kafka/kafka-producer.ts
import { Kafka, Producer } from 'kafkajs';

let producer: Producer | null = null;
let connected = false;

export async function getProducer(): Promise<Producer> {
  if (producer && connected) return producer;

  const kafka = new Kafka({ brokers: ['localhost:9092'] });
  producer = kafka.producer();

  try {
    await producer.connect();
    connected = true;
    console.log('Kafka producer connected');
  } catch (err) {
    connected = false;
    producer = null;
    console.error('Kafka connection failed, retrying in 5s', err);
    await new Promise((res) => setTimeout(res, 5000));
    return getProducer(); // retry
  }

  return producer;
}