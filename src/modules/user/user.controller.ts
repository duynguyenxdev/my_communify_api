import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UserId } from '../auth/decorators/user-id.decorator';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/search')
  @HttpCode(HttpStatus.OK)
  getUsers(@Query('q') query: string, @UserId() userId: string) {
    return this.userService.search(userId, query);
  }
}
