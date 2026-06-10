import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { AppHttpException } from '../errors/app-http-exception';

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let error: any;
    if (exception instanceof AppHttpException) {
      error = exception.error;
    } else if (exception instanceof BadRequestException) {
      const response = exception.getResponse();
      if (typeof response === 'string') {
        error = response;
      } else if (typeof response === 'object') {
        if (response['message']) {
          error = response['message'];
        }
      }
    } else {
      error = exception.message;
    }

    response.status(status).json({
      error: error,
    });
  }
}
