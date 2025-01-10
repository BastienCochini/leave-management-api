import { Entity } from '@/models/entity.model';

export interface Employee {
  id?: number;
  firstName: string;
  lastName: string;
}

export class EmployeeModel extends Entity<Employee> {
  protected tableName = 'employees';

  protected relations = {
    leaves: {
      table: 'leaves',
      localKey: 'id',
      foreignKey: 'employeeId',
    },
  };
}
