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
    console.error('HttpExceptionFilter: Exception caught', exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status: number;
    let message: any;

    if (exception && typeof exception === 'object' && 'getStatus' in exception) {
      if (exception instanceof HttpException) {
        status = exception.getStatus();
        if (exception instanceof BadRequestException) {
          message = (exception.getResponse() as HttpException).message;
        } else {
          message = exception.message;
        }
      }
    } else if (exception && typeof exception === 'object' && 'message' in exception) {
      message = exception.message;
    } else {
      status = 500;
      message = this.defaultMsg;
    }

    if (!status) {
      status = 500; 
    }

    const errorResponse: ICustomException = { message };
    response.status(status).json(errorResponse);
  }
}
