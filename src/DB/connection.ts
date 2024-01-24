import { Client } from 'pg';

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'DeviseHR',
    password: '890899000',
    port: 5432
  });

export default client;