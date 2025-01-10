type httpErrorOptions = {
  statusCode: string;
  errorCode: string;
  message: string;
};

export class HttpError extends Error {
  statusCode: string;
  errorCode: string;

  constructor({
    statusCode,
    errorCode,
    message,
  }: httpErrorOptions) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }
}
