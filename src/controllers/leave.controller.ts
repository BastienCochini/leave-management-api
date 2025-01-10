import { EntityController } from '@/controllers/entity.controller';
import { LeaveModel } from '@/models/leave.model';
import { makeAllOptional } from '@/utils/makeAllOptional';
import { z } from 'zod';

const createBody = {
  employeeId: z.number().int(),
  startDate: z.string().date(),
  endDate: z.string().date(),
  comment: z.string(),
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

export class LeaveController extends EntityController<LeaveModel> {
  protected tableName = 'leaves';
  protected routesConfig = routesConfig;
}
