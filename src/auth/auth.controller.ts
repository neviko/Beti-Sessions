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
import { TSessionPayload } from 'src/types/session-payload.type';

declare module 'express-session' {
  interface SessionData {
    email: TSessionPayload;
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
    } as TSessionPayload;
    return res.status(200).send('Session set');
  }

  // guard middleware should be placed here!!
  @UseGuards(AuthGuard)
  @Get('verify')
  async verify(@Req() req: Request, @Res() res: Response) {
    console.log(req.sessionID);
    res.send('s');
  }
}
