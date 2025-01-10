export abstract class Entity<T> {
  protected abstract tableName: string;

  protected abstract relations?: {
    [key: string]: {
      table: string;
      localKey: string;
      foreignKey: string;
    };
  };

  constructor(protected fastify: FastifyInstance) {}

  protected async applyRelations(query: any, include?: string): any {
    if (include) {
      const includes = include.split(',').map((rel) => rel.trim());
      for (const relation of includes) {
        const config = this.relations[relation];
        if (!config) {
          throw new Error(`Unknown relation: ${relation}`);
        }
        query = query
          .leftJoin(
            config.table,
            `${this.tableName}.${config.localKey}`,
            `${config.table}.${config.foreignKey}`,
          )
          .select(this.fastify.knex.raw(`json_agg(${config.table}.*) as ${relation}`))
          .groupBy([`${this.tableName}.id`, `${relation}.id`])
      }
    }
    return query;
  }

  protected formatIncludesQuery(query: any, include?: string): any {
    const rows = Array.isArray(query) ? query : [query];

    return rows.map((row) => {
      if (include) {
        const includes = include.split(',').map((rel) => rel.trim());
        for (const relation of includes) {
          if (row[relation]) {
            if (typeof row[relation] === 'string') {
              const parsedRelation = JSON.parse(row[relation]);
              row[relation] = Array.isArray(parsedRelation) && parsedRelation.includes(null)
                ? []
                : parsedRelation;
            }
          } else {
            row[relation] = [];
          }
        }
      }
      return row;
    });
  }


  async getAll(include?: string): Promise<T[]> {
    const initialQuery = this.fastify.knex(this.tableName).select(`${this.tableName}.*`);
    const queryWithRelations = await this.applyRelations(initialQuery, include);
    return this.formatIncludesQuery(queryWithRelations, include);
  }

  async getById(id: number, include?: string): Promise<T | undefined> {
    const initialQuery = this.fastify.knex(this.tableName).select(`${this.tableName}.*`).where({ [`${this.tableName}.id`]: id }).first();
    const queryWithRelations = await this.applyRelations(initialQuery, include);
    return this.formatIncludesQuery([queryWithRelations], include)[0] || null;
  }

  async create(data: Partial<T>): Promise<T> {
    const [newEntity] = await this.fastify.knex(this.tableName).insert(data).returning('*');
    return newEntity;
  }

  async update(id: number, data: Partial<T>): Promise<void> {
    await this.fastify.knex(this.tableName).where({ id }).update(data);
  }

  async delete(id: number): Promise<void> {
    await this.fastify.knex(this.tableName).where({ id }).del();
  }
}
