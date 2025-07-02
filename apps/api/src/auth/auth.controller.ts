import { Body, Controller, Post, Res, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { Cookies } from '../decorators/cookies.decorator';
import { JwtService } from '@nestjs/jwt';
import { UUID } from 'crypto';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService, private jwtService: JwtService, private userService: UserService) {}

    @Post('login')
    async login(@Body() body: LoginUserDto ,@Res({passthrough: true}) res: Response) {
        const session = await this.authService.logIn(body.email, body.password);
        res.headers.set('set-cookie', `session=${session.session}; HttpOnly; Path=/; Max-Age=86400`);
        return { message: 'Login successful', session: session.session };
    }

    @Post('logout')
    async logout(@Res({passthrough: true}) res: Response) {
        res.headers.set('set-cookie', 'session=; HttpOnly; Path=/; Max-Age=0');
        return { message: 'Logout successful' };
    }

    @Post('me')
    async me(@Cookies('session') sessionToken: string) {
        if (!sessionToken) {
            throw new UnauthorizedException();
        }

        const payload = this.jwtService.decode<{sub: UUID, email: string}>(sessionToken);
        
        return this.userService.findOne(payload.sub)
    }
    
}
