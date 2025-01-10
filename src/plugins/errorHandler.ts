import { BadRequestError } from '@/errors/badRequestError';
import { HttpError } from '@/errors/httpError';
import { NotFoundError } from '@/errors/notFoundError';
import { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';

function resolveStatusCode(error: any) {
  switch (true) {
    case error instanceof BadRequestError: return StatusCodes.BAD_REQUEST;
    case error instanceof NotFoundError: return StatusCodes.NOT_FOUND;
    case error instanceof HttpError: return Number(error.statusCode);
    default: return StatusCodes.BAD_REQUEST;
  }
}

export const errorHandler = (
  error: Error & Record<string, any>,
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  if (error.code === 'FST_ERR_VALIDATION') {
    reply.status(400).send({
      message: 'Validation failed',
      issues: error.validation.map((issue: any) => ({
        path: `${error.validationContext}${issue.instancePath}`,
        message: issue.message,
      })),
    });
    return;
  }

  console.error(error);
  reply.status(resolveStatusCode(error));
  if (error.message) {
    reply.send({ message: error.message });
  } else {
    reply.send();
  }
};
