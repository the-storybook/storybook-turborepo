import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { PasswordEncoderService } from 'src/password_encoder/password_encoder.service';

@Module({
  controllers: [AuthController],
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.JWT_SECRET,
      signOptions: { expiresIn: jwtConstants.JWT_EXPIRATION_TIME },
    })
  ],
  providers: [
    AuthService,
    JwtService,
    PasswordEncoderService
  ],
})
export class AuthModule {}
