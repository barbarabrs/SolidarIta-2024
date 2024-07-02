import { createConnection } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
require('dotenv').config();

let conn: any;

export async function connect() {

  if (conn) return conn

  const config: PostgresConnectionOptions = {
    name: 'default',
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number.parseInt(process.env.DB_PORT as string),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    logging: true
    //   entities: ['src/database/models/*.ts']
  };

  conn = createConnection(config);
  return conn;
}
