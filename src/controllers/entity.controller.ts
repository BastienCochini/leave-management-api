import { BadRequestError } from '@/errors/badRequestError';
import { NotFoundError } from '@/errors/notFoundError';
import { models } from '@/models';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { StatusCodes } from 'http-status-codes';
import { mapValues } from 'lodash-es';
import zod, { ZodTypeAny } from 'zod';

type RouteConfig = {
  getAll: {
    schema: {
      querystring: {
        include?: ZodTypeAny;
      };
    };
  };
  getById: {
    schema: {
      params: {
        id: ZodTypeAny;
      };
      querystring: {
        include?: ZodTypeAny;
      };
    };
  };
  create: {
    schema: {
      body: Record<string, ZodTypeAny>;
    };
  };
  update: {
    schema: {
      params: {
        id: ZodTypeAny;
      };
      body: Record<string, ZodTypeAny>;
    };
  };
  delete: {
    schema: {
      params: {
        id: ZodTypeAny;
      };
    };
  };
};

const resolveSchema = (options: Record<string, Record<string, ZodTypeAny>>) => {
  return mapValues(options, (option) => zod.strictObject(option));
};

const addUniqueRoute = (fastify: FastifyInstance, route: Parameters<FastifyInstance['route']>[0]) => {
  if (!fastify.hasRoute(route)) {
    fastify.withTypeProvider<ZodTypeProvider>().route(route);
  }
};

export abstract class EntityController<T> {
  protected abstract model: Entity<T>;
  protected abstract tableName: string;
  protected abstract routesConfig?: RouteConfig;
  protected abstract fastify: FastifyInstance;

  constructor(
    protected fastify: FastifyInstance,
    modelName: keyof typeof models,
  ) {
    const ModelClass = models[modelName];
    if (!ModelClass) {
      throw new Error(`Model ${modelName} not found`);
    }
    this.model = new ModelClass(fastify) as Entity<T>;
    this.fastify = fastify;
  }

  async getAll(request, reply) {
    const { include } = request.query as any;
    const entities = await this.model.getAll(include || undefined);
    reply.send(entities);
  }

  async getById(request, reply) {
    const { id } = request.params as any;
    const { include } = request.query as any;
    const entity = await this.model.getById(id, include || undefined);
    if (!entity) {
      throw new NotFoundError();
    }
    reply.send(entity);
  }

  async create(request, reply) {
    const body = request.body as any;
    const entity = await this.model.create(body);
    if (entity.length === 0) {
      throw new BadRequestError();
    }
    reply.status(StatusCodes.CREATED).header('Location', `/${this.tableName}/${entity.id}`);
  }

  async update(request, reply) {
    const { id } = request.params as any;
    const body = request.body as any;
    await this.model.update(id, body);
    const entity = this.model.getById(id);
    if (!entity) {
      throw new NotFoundError();
    }
    reply.send(entity);
  }

  async delete(request, reply) {
    const { id } = request.params as any;
    await this.model.delete(id);
    reply.status(StatusCodes.NO_CONTENT);
  }

  registerRoutes() {
    this.fastify.register((fastify, options, done) => {
      addUniqueRoute(fastify, {
        method: 'GET',
        url: `/${this.tableName}`,
        handler: this.getAll.bind(this),
        // Swagger metadata
        schema: {
          description: `Get all ${this.tableName}`,
          tags: [this.tableName],
          ...(
            this.routesConfig?.getAll?.schema
              ? resolveSchema(this.routesConfig.getAll?.schema)
              : {}
          ),
        },
      });

      addUniqueRoute(fastify, {
        method: 'GET',
        url: `/${this.tableName}/:id`,
        handler: this.getById.bind(this),
        // Swagger metadata
        schema: {
          description: `Get a specific record of ${this.tableName}`,
          tags: [this.tableName],
          params: {
            id: { type: 'integer', description: 'ID of the entity' },
            include: { type: 'string', description: 'Data to include' },
          },
          ...(
            this.routesConfig?.getById?.schema
              ? resolveSchema(this.routesConfig.getById?.schema)
              : {}
          ),
        },
      });

      addUniqueRoute(fastify, {
        method: 'POST',
        url: `/${this.tableName}`,
        handler: this.create.bind(this),
        // Swagger metadata
        schema: {
          description: `Create a new ${this.tableName}`,
          tags: [this.tableName],
          ...(
            this.routesConfig?.create?.schema
              ? resolveSchema(this.routesConfig.create?.schema)
              : {}
          ),
        },
      });

      addUniqueRoute(fastify, {
        method: 'PATCH',
        url: `/${this.tableName}/:id`,
        handler: this.update.bind(this),
        // Swagger metadata
        schema: {
          description: `Update a ${this.tableName}`,
          tags: [this.tableName],
          ...(
            this.routesConfig?.update?.schema
              ? resolveSchema(this.routesConfig.update?.schema)
              : {}
          ),
        },
      });

      addUniqueRoute(fastify, {
        method: 'DELETE',
        url: `/${this.tableName}/:id`,
        handler: this.delete.bind(this),
        // Swagger metadata
        schema: {
          description: `Delete a ${this.tableName}`,
          tags: [this.tableName],
          ...(
            this.routesConfig?.delete?.schema
              ? resolveSchema(this.routesConfig.delete?.schema)
              : {}
          ),
        },
      });
      done();
    });
  }
}
