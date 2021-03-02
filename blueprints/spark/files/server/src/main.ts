import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as compression from 'compression';
import * as helmet from 'helmet';
import * as expressEnforcesSsl from 'express-enforces-ssl';
import { AppModule } from './app.module';
import { ServeStaticFilter } from './serve-static.filter';

const ONE_YEAR = 31536000;

async function bootstrap() {
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const configService = app.get(ConfigService);
    const port = configService.get('port');

    app.useGlobalPipes(new ValidationPipe());

    // global middleware
    app.use(compression());
    app.enableCors();

    if (!process.env.LOCAL) {
      app.set('trust proxy', 1);
      app.use(expressEnforcesSsl());
      app.use(
        helmet.hsts({
          maxAge: ONE_YEAR,
        })
      );
    }

    app.useStaticAssets(path.join(process.cwd(), 'client', 'dist'));
    app.useGlobalFilters(new ServeStaticFilter());

    await app.listen(port);
    console.log(`Started server on http://localhost:${port}`);
  } catch (e) {
    console.log(e);
    throw e;
  }
}
bootstrap();
