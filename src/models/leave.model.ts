import { Entity } from '@/models/entity.model';

export interface Leave {
  id?: number;
  employeeId: number;
  startDate: date;
  endDate: date;
  comment?: string;
}

export class LeaveModel extends Entity<Leave> {
  protected tableName = 'leaves';

  protected includeRelations = {
    employee: {
      table: 'employees',
      localKey: 'employeeId',
      foreignKey: 'id',
    },
  };
}
