import * as path from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { TwilioModule } from 'nestjs-twilio';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import configuration from './config/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AccountsModule } from './accounts/accounts.module';
import { SmsService } from './sms/sms.service';
import * as ormconfig from './ormconfig';

const isLocal = process.env.LOCAL === 'true' ? true : false;

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    TwilioModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          accountSid: config.get('twilio.accountSid'),
          authToken: config.get('twilio.authToken'),
        };
      },
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const capture = isLocal;
        return {
          transport: {
            service: capture ? undefined : config.get('email.service'),
            auth: capture ? undefined : config.get('email.auth'),
            port: capture ? 1025 : config.get('email.port'),
            ignoreTLS: capture ? true : undefined,
          },
          defaults: {
            from: `"MyApp" <${config.get('email.from')}>`,
          },
          template: {
            dir: path.join(__dirname, 'email-templates'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: isLocal
        ? path.join(process.cwd(), 'src', 'schema.gql')
        : true,
      sortSchema: true,
      context: ({ req }) => ({ req }),
      debug: isLocal,
      playground: isLocal,
    }),
    TypeOrmModule.forRoot(ormconfig),
    AuthModule,
    UsersModule,
    AccountsModule,
  ],
  controllers: [AppController],
  providers: [AppService, SmsService],
})
export class AppModule {}
