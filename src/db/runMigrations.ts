import { knexConfig } from '@/db/knexfile';
import knex from 'knex';

const db = knex(knexConfig);

async function runMigrations() {
  try {
    await db.migrate.latest();
    console.log('Migrations are up to date!');
    process.exit(0);
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  }
}

runMigrations();
