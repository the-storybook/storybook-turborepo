import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Mongoose } from 'mongoose';
import { UserSchema } from './schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { PasswordEncoderService } from 'src/password_encoder/password_encoder.service';
import { OtpService } from 'src/otp/otp.service';
import { MailerService } from 'src/mailer/mailer.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  controllers: [UserController],
  providers: [UserService, PasswordEncoderService, OtpService, MailerService],
  exports: [UserService],
})
export class UserModule {}
