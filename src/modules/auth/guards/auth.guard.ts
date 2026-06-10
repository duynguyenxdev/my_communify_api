import { AppHttpException } from '@/common/errors/app-http-exception';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request;

    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw AppHttpException.unauthorized('Invalid authorization header');
    }

    const accessToken = this.extractAccessToken(authHeader);
    if (!accessToken) {
      throw AppHttpException.unauthorized('Invalid token');
    }

    try {
      const { sub: userId } = await this.jwtService.verifyAsync(accessToken);
      (request as any).userId = userId;
      return true;
    } catch (error) {
      console.error(`Failed to verify jwt: ${error}`);
      throw AppHttpException.unauthorized('Invalid token');
    }
  }

  private extractAccessToken(authHeader: string) {
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return undefined;
    }
    return parts[1];
  }
}
