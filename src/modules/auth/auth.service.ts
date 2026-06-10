import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { UserService } from '../user/user.service';
import { AuthResponseDto } from './dtos/auth.response.dto';
import { User } from '../user/entities/user.entity';
import { AppHttpException } from '@/common/errors/app-http-exception';

@Injectable()
export class AuthService {
  private googleOAuthClient: OAuth2Client;

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {
    this.googleOAuthClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async authenticateWithGoogle(idToken: string): Promise<AuthResponseDto> {
    try {
      const ticket = await this.googleOAuthClient.verifyIdToken({
        idToken: idToken,
      });

      const payload = ticket.getPayload();

      if (!payload) {
        throw new UnauthorizedException('Invalid google payload');
      }

      const { sub: userId, name, picture, email } = payload;

      let user = await this.userService.getByRefId(userId);
      if (!user) {
        const newUser = new User();
        newUser.refId = userId;
        newUser.email = email!;
        newUser.avatar = picture;
        newUser.fullName = name;
        user = await this.userService.create(newUser);
      }

      const accessToken = await this.generateToken(user);

      return {
        accessToken: accessToken,
        user: user.toUserResponseDto(),
      };
    } catch (error) {
      console.error('Failed to authenticate google account:', error);
      throw AppHttpException.unauthorized(
        'Failed to authenticate google account',
      );
    }
  }

  async getAccessTokenByEmail(email: string): Promise<AuthResponseDto> {
    const user = await this.userService.getByEmail(email);
    if (!user) {
      throw AppHttpException.notFound('User not found');
    }

    const accessToken = await this.generateToken(user);

    return {
      accessToken: accessToken,
      user: user.toUserResponseDto(),
    };
  }

  async authenticateWithToken(token: string): Promise<AuthResponseDto> {
    try {
      const { sub: userId } = await this.jwtService.verifyAsync(token);

      const user = await this.userService.getById(userId);

      if (!user) {
        throw AppHttpException.unauthorized('Invalid user credentials');
      }

      const accessToken = await this.generateToken(user);

      return {
        accessToken: accessToken,
        user: user.toUserResponseDto(),
      };
    } catch (error) {
      console.error('Failed to authenticate token:', error);
      throw AppHttpException.unauthorized('Invalid user credentials');
    }
  }

  private generateToken(user: User) {
    const jwtPayload = {
      sub: user.id,
      email: user.email,
      fullName: user.fullName,
    };
    return this.jwtService.signAsync(jwtPayload);
  }
}
