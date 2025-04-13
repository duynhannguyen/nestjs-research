import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import {
  LoginBodyDTO,
  LoginResDTO,
  RefreshTokenBodyDTO,
  RefreshTokenResDTO,
  RegisterBodyDTO,
  RegisterResDTO,
} from './auth.dto';
import { AuthService } from './auth.service';
import { AccessTokenGuard } from 'src/shared/guards/access-token-guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @SerializeOptions({ type: RegisterResDTO })
  @Post('register')
  async register(@Body() body: RegisterBodyDTO) {
    console.log('controller...');
    const result = await this.authService.register(body);
    // return new RegisterResDTO(result);
    return result;
  }
  @Post('login')
  async login(@Body() body: LoginBodyDTO) {
    return new LoginResDTO(await this.authService.login(body));
  }
  @UseGuards(AccessTokenGuard)
  @Post('refreshToken')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() body: RefreshTokenBodyDTO) {
    return new RefreshTokenResDTO(
      await this.authService.refreshToken(body.refreshToken),
    );
  }
}
