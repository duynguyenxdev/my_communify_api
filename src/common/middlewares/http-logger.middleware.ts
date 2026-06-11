import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl, body, query, headers } = req;
    const startTime = Date.now();

    // Listen for the response to finish before writing the log
    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - startTime;
      const obscuredCharacters = '*****';

      // Sanitize sensitive headers (like Authorization tokens or Cookies)
      const sanitizedHeaders = { ...headers };
      if (sanitizedHeaders['authorization'])
        sanitizedHeaders['authorization'] = obscuredCharacters;
      if (sanitizedHeaders['cookie'])
        sanitizedHeaders['cookie'] = obscuredCharacters;

      // Sanitize sensitive body fields (e.g., passwords)
      const sanitizedBody = { ...body };
      if (sanitizedBody.password) sanitizedBody.password = obscuredCharacters;

      const logPayload = {
        method,
        url: originalUrl,
        statusCode,
        duration: `${duration}ms`,
        queryParams: Object.keys(query).length ? query : undefined,
        body: Object.keys(sanitizedBody).length ? sanitizedBody : undefined,
        headers: sanitizedHeaders,
      };

      // Log as an error if status code is 4xx or 5xx, otherwise log as standard info
      if (statusCode >= 400) {
        this.logger.error(
          `Request Failed: ${method} ${originalUrl}`,
          JSON.stringify(logPayload),
        );
      } else {
        this.logger.log(
          `Request Success: ${method} ${originalUrl}`,
          JSON.stringify(logPayload),
        );
      }
    });

    next();
  }
}
