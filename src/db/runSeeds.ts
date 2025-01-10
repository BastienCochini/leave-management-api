import { knexConfig } from '@/db/knexfile';
import knex from 'knex';

const db = knex(knexConfig);

async function runSeeds() {
  try {
    await db.seed.run();
    console.log('Seeders executed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error running seeders:', error);
    process.exit(1);
  }
}

runSeeds();
