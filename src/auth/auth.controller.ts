import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto as AuthDto } from './dto/register.dto';
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
    @Body() authDto: AuthDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    await this.authService.register(authDto.email);
    Logger.log(`user - ${authDto.email} have been registered `);
    res.status(201).send({
      message: `Registration succeeded, user ${authDto.email} created`,
    });
  }

  // add a guard who checks the activation status
  @Post('login')
  async login(
    @Body() authDto: AuthDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    await this.authService.login(authDto.email);
    Logger.log(`user - ${authDto.email} have been logged in `);

    req.session.email = {
      email: authDto.email,
    } as ISessionPayload;
    return res.status(200).send({
      message: `user - ${authDto.email} have been logged in successfully`,
    });
  }

  @UseGuards(AuthGuard)
  @Get('verify')
  async verify(@Req() req: Request, @Res() res: Response) {
    Logger.log(`Access granted for ${req.session.email.email}`);

    res
      .send({ message: `Access granted for ${req.session.email.email}` })
      .status(200);
  }
}
