import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from './auth.guard';
import { ISessionPayload } from 'src/interfaces/session-payload.interface';

declare module 'express-session' {
  interface SessionData {
    email: ISessionPayload;
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
    req.session.email = {
      email: registerDto.email,
    } as ISessionPayload;
    return res.status(200).send('Session set');
  }

  @UseGuards(AuthGuard)
  @Get('verify')
  async verify(@Req() req: Request, @Res() res: Response) {
    res.send({ message: 'OK' }).status(200);
  }
}
