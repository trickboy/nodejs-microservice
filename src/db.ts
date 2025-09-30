// src/db.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Transaction } from './entities/Transaction';
// import { Transaction } from './entities/Transaction';

// ⚡ You can configure via ENV for portability
export const AppDataSource = new DataSource({
  type: 'postgres', // or 'mysql' / 'mssql'
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'P@55w0rd1111',
  database: process.env.DB_NAME || 'fintech_db',
  entities: [Transaction],
  synchronize: true, // ⚠️ Auto-create schema in dev; disable in prod
  logging: true,
});

// Helper to ensure DB is ready
export async function initDB() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
    console.log('✅ Database connected');
  }
}