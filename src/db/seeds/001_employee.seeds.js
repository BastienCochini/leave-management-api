export async function seed(knex) {
  await knex('employees').del();

  await knex('employees').insert([
    { firstName: 'John', lastName: 'Doe' },
    { firstName: 'Jane', lastName: 'Smith' },
    { firstName: 'Alice', lastName: 'Johnson' },
    { firstName: 'Bob', lastName: 'Brown' },
  ]);
}
