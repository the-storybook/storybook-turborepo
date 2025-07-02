import { Module } from '@nestjs/common';

import { LinksModule } from './links/links.module';

import { AppService } from './app.service';
import { AppController } from './app.controller';

import { MongooseModule } from '@nestjs/mongoose';
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
  imports: [LinksModule, MongooseModule.forRoot(process.env.MONGODB_URL), UserModule, AuthModule, OtpModule, AppRedisModule, PasswordEncoderModule],
  controllers: [AppController],
  providers: [AppService, PasswordEncoderService, AuthService, MailerService, OtpService],
})
export class AppModule {}
