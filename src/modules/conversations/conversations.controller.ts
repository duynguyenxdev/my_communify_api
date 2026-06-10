import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UserId } from '../auth/decorators/user-id.decorator';
import { ConversationsService } from './conversations.service';
import { CreateConversationRequestDto } from './dtos/create-conversation.request.dto';

@Controller('conversations')
@UseGuards(AuthGuard)
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getConversations(@UserId() userId: string) {
    return this.conversationsService.getConversations(userId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createConversation(
    @UserId() userId: string,
    @Body() body: CreateConversationRequestDto,
  ) {
    return this.conversationsService.createConversation(
      userId,
      body.participantIds,
    );
  }
}
