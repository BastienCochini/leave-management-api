export async function seed(knex) {
  await knex('leaves').del();

  await knex('leaves').insert([
    { employeeId: 1, startDate: '2025-01-02', endDate: '2025-01-31', comment: 'Vacation' },
    { employeeId: 2, startDate: '2025-01-01', endDate: '2025-02-03', comment: 'Sick leave' },
    { employeeId: 3, startDate: '2025-03-10', endDate: '2025-03-14', comment: 'Personal leave' },
    { employeeId: 4, startDate: '2025-04-01', endDate: '2025-04-05', comment: 'Holiday' },
  ]);
}
