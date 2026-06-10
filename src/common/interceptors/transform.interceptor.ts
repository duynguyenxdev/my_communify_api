import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { BaseResponse } from '../interfaces/base-response.interface';

export class TransformInterceptor<T> implements NestInterceptor<
  T,
  BaseResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<BaseResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        return {
          data: data,
        };
      }),
    );
  }
}
