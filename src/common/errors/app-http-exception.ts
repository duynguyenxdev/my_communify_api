import { HttpException, HttpStatus } from '@nestjs/common';

type HttpError = string | Record<string, any>;

export class AppHttpException extends HttpException {
  constructor(
    statusCode: number,
    public error: HttpError,
  ) {
    super(error, statusCode);
  }

  static unauthorized(error: HttpError) {
    return new AppHttpException(HttpStatus.UNAUTHORIZED, error);
  }

  static notFound(error: HttpError) {
    return new AppHttpException(HttpStatus.NOT_FOUND, error);
  }
}
