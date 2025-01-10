import { EmployeeController } from '@/controllers/employee.controller';
import { LeaveController } from '@/controllers/leave.controller';
import { errorHandler } from '@/plugins/errorHandler';
import { knexProvider } from '@/plugins/knexProvider';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import dotenv from 'dotenv';
import Fastify from 'fastify';
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';

dotenv.config();

const fastify = Fastify();

fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

fastify.setErrorHandler(errorHandler);

// Register Swagger plugin
fastify.register(swagger, {
  swagger: {
    info: {
      title: 'Leave Management System API',
      description: 'API documentation for leaves management ',
      version: '1.0.0',
    },
    host: 'localhost:80',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
  },
  transform: jsonSchemaTransform,
});

fastify.register(swaggerUi, {
  routePrefix: '/docs',
  exposeRoute: true,
});

fastify.register(cors, {
  origin: process.env.BAS_URL_FRONTEND,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

fastify.register(knexProvider);

const employeeController = new EmployeeController(fastify, 'Employee');
const leaveController = new LeaveController(fastify, 'Leave');
employeeController.registerRoutes();
leaveController.registerRoutes();

const port = parseInt(process.env.PORT, 10);
await fastify.listen({ port, host: '0.0.0.0' });

console.log(`Listening on port ${port}`);
console.log(fastify.printRoutes());
