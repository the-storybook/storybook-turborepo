import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { RedisModule } from '@nestjs-modules/ioredis';
import { AppRedisModule } from 'src/app_redis/app_redis.module';

@Module({
    imports: [AppRedisModule]
})
export class OtpModule {}
