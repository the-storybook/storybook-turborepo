import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

type OtpPurpose = 'register' | 'password_reset';

@Injectable()
export class OtpService {

    constructor(@InjectRedis() private readonly redis: Redis) {}


    generateOtp(): string {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        return otp;
    }

    async generateAndStoreOtp(email: string, purpose: OtpPurpose): Promise<string> {
        const otp = this.generateOtp();
        const key = `otp:${email}:${purpose}`;
        await this.redis.set(key, otp, 'EX', process.env.OTP_EXPIRATION || 300);
        return otp;
    }

    async validateOtp(email: string, purpose: OtpPurpose, otp: string): Promise<boolean> {
        const key = `otp:${email}:${purpose}`;
        const storedOtp = await this.redis.get(key);

        if (storedOtp === otp) {
            await this.redis.del(key);
            return true;
        }
        return false;
    }

    async invalidateOtp(email: string, purpose: OtpPurpose): Promise<void> {
        const key = `otp:${email}:${purpose}`;
        await this.redis.del(key);
    }
}
