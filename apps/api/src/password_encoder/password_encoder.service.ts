import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordEncoderService {
    async encodePassword(password: string): Promise<string> {
        const saltOrRounds = 10;
        
        return await bcrypt.hash(password, saltOrRounds);
    }
    
    async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(plainPassword, hashedPassword)
    }
}
