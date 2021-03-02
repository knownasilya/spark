import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import * as path from 'path';

@Catch()
export class ServeStaticFilter<T> extends BaseExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const req = ctx.getRequest();

    if (
      req.path &&
      (req.path.startsWith('/api') || req.path.startsWith('/graphql'))
    ) {
      // API 404, serve default nest 404:
      super.catch(exception, host);
    } else {
      // client access, let the SPA handle:
      response.sendFile(
        path.join(process.cwd(), 'client', 'dist', 'index.html')
      );
    }
  }
}
