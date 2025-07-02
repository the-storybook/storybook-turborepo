import { Module } from '@nestjs/common';
import { PasswordEncoderService } from './password_encoder.service';

@Module({providers: [PasswordEncoderService],exports: [PasswordEncoderService]})
export class PasswordEncoderModule {
    
}
