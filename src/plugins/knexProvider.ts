import { knexConfig } from '@/db/knexfile';
import type { FastifyInstance } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import knex from 'knex';

export const knexProvider = fastifyPlugin(async (fastify: FastifyInstance) => {
  fastify.decorate('knex', knex(knexConfig));
});
