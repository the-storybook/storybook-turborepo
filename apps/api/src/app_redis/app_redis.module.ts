import { Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';

@Module({
    imports: [
        RedisModule.forRoot({
            options: {
                host: 'localhost',
                port: 6379,
            },
            type: 'single'
        }),
    ],
})
export class AppRedisModule {}
