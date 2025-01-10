import { EntityController } from '@/controllers/entity.controller';
import { EmployeeModel } from '@/models/employee.model';
import { makeAllOptional } from '@/utils/makeAllOptional';
import { z } from 'zod';

const createBody = {
  firstName: z.string(),
  lastName: z.string(),
};

const updateBody = makeAllOptional(createBody);

const routesConfig = {
  getAll: {
    schema: {
      querystring: {
        include: z.string().optional(),
      },
    },
  },
  getById: {
    schema: {
      params: {
        id: z.string(),
      },
      querystring: {
        include: z.string().optional(),
      },
    },
  },
  create: {
    schema: {
      body: createBody,
    },
  },
  update: {
    schema: {
      params: {
        id: z.string(),
      },
      body: updateBody,
    },
  },
  delete: {
    schema: {
      params: {
        id: z.string(),
      },
    },
  },
};

export class EmployeeController extends EntityController<EmployeeModel> {
  protected tableName = 'employees';
  protected routesConfig = routesConfig;
}
