import { Client } from 'pg';

export async function connectDatabase() {
  const client = await new Client({
    connectionString: process.env.POSTGRES_URL,
  });

  return client;
}
