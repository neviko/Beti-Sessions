import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { TUser } from 'src/types/user.type';

declare module 'express-session' {
  interface SessionData {
    user: TUser;
  }
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    await this.authService.register(registerDto.email);
    res.status(201).send('Registration succeeded, user created');
  }

  // add a guard who checks the activation status
  @Post('login')
  async login(
    @Body() registerDto: RegisterDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    await this.authService.login(registerDto.email);
    req.session.user = {
      email: registerDto.email,
    } as TUser;
    return res.status(200).send('Session set');
  }

  // guard middleware should be placed here!!
  @Get('verify')
  async verify(@Req() req: Request, @Res() res: Response) {
    console.log(req.sessionID);
    res.send('s');
  }
}
