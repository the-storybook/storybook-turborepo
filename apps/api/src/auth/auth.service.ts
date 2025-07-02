import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PasswordEncoderService } from '../password_encoder/password_encoder.service';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
    constructor(private userService: UserService, private passwordEncoderService: PasswordEncoderService, private jwtService: JwtService) {}

    async logIn(email: string, password: string): Promise<{session: string}> {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const isPasswordValid = await this.passwordEncoderService.comparePasswords(password, user.password);
        if (!isPasswordValid) {
            throw new BadRequestException('Invalid password');
        }

        const payload = {sub: user.id, email: user.email};

        return {session: await this.jwtService.signAsync(payload)};
    }
}
