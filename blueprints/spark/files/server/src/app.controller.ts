import { Controller, Request, Get, UseGuards, Post, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { AuthService } from './auth/auth.service';
import * as path from 'path';

@Controller()
export class AppController {
  constructor(
    private readonly authService: AuthService,
    private readonly appService: AppService
  ) {}

  @Get('api/ping')
  ping(): string {
    return this.appService.getPing();
  }

  @UseGuards(LocalAuthGuard)
  @Post('api/auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('api/profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get('/*')
  sendClientIndex(@Res() res) {
    return {};
    // res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
  }
}
