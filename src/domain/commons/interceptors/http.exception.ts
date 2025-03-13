import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { ICustomException } from './http.exception.interface';

@Catch()
export default class HttpExceptionFilter implements ExceptionFilter {
  private readonly defaultMsg = 'Internal server error';

  catch(exception: HttpException & ICustomException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status: number;
    let message: any;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      if (exception instanceof BadRequestException) {
        message = (exception.getResponse() as HttpException).message;
      } else {
        message = exception.message;
      }
    } else {
      status = 500;
      message = this.defaultMsg;
    }

    const errorResponse: ICustomException = { message };
    response.status(status).json(errorResponse);
  }
}
