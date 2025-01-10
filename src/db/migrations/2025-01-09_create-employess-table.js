export async function up(knex) {
  await knex.schema.createTable('employees', (table) => {
    table.increments('id').primary();
    table.string('firstName').notNullable();
    table.string('lastName').notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex) {
  await knex.schema.dropTable('employees');
}
