import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { LinksModule } from './links/links.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { PasswordEncoderService } from './password_encoder/password_encoder.service';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { MailerService } from './mailer/mailer.service';
import { OtpService } from './otp/otp.service';
import { OtpModule } from './otp/otp.module';
import { AppRedisModule } from './app_redis/app_redis.module';
import { PasswordEncoderModule } from './password_encoder/password_encoder.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the ConfigModule available globally
      envFilePath: '.env', // Specifies the path to your .env file
    }),
    LinksModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URL'),
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    OtpModule,
    AppRedisModule,
    PasswordEncoderModule,
  ],
  controllers: [AppController],
  providers: [AppService, PasswordEncoderService, AuthService, MailerService, OtpService],
})
export class AppModule {}
