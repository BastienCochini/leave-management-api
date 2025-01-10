export async function up(knex) {
  await knex.schema.createTable('leaves', (table) => {
    table.increments('id').primary();
    table.integer('employeeId').unsigned().notNullable();
    table.date('startDate').notNullable();
    table.date('endDate').notNullable();
    table.string('comment');
    table.timestamps(true, true);

    table.foreign('employeeId').references('id').inTable('employees').onDelete('CASCADE');
  });
}

export async function down(knex) {
  await knex.schema.dropTable('leaves');
}
