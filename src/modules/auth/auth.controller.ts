import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { GoogleAuthRequestDto } from './dtos/google-auth.request.dto';
import { AuthService } from './auth.service';
import { TokenAuthRequestDto } from './dtos/token-auth.request.dto';
import { GetTokenRequestDto } from './dtos/get-token.request.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google')
  authenticateWithGoogle(@Body() request: GoogleAuthRequestDto) {
    return this.authService.authenticateWithGoogle(request.idToken);
  }

  // TODO: remove this
  @Post('/get-token')
  @HttpCode(HttpStatus.OK)
  getToken(@Body() request: GetTokenRequestDto) {
    return this.authService.getAccessTokenByEmail(request.email);
  }

  @Post('/token')
  authenticateWithToken(@Body() request: TokenAuthRequestDto) {
    return this.authService.authenticateWithToken(request.token);
  }
}
