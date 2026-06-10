import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Participant } from './entities/participant.entity';
import { AppHttpException } from '@/common/errors/app-http-exception';
import { Conversation } from './entities/conversation.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(Participant)
    private readonly participantRepository: Repository<Participant>,
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    private readonly userService: UserService,
  ) {}

  async getConversations(userId: string) {
    const conversations = await this.conversationRepository.find({
      where: {
        participants: {
          id: userId,
        },
      },
      relations: {
        participants: {
          user: true,
        },
      },
      select: {
        id: true,
        name: true,
        participants: {
          id: true,
          user: {
            id: true,
            fullName: true,
            avatar: true,
          },
        },
      },
    });

    return conversations.map((e) => e.toDto());
  }

  async createConversation(userId: string, participantIds: string[]) {
    const conversation = new Conversation();
    conversation.name = 'Test conversation';

    const allParticipantIds = [userId, ...participantIds];

    const participantPromises = allParticipantIds.map(async (participantId) => {
      const user = await this.userService.getById(participantId);

      if (!user) {
        throw AppHttpException.notFound(
          `Can not find participant with id ${participantId}`,
        );
      }

      const participant = new Participant();
      participant.id = user.id;
      participant.user = user;

      return participant;
    });

    const participants = await Promise.all(participantPromises);

    conversation.messages = [];
    conversation.participants = participants;

    return this.conversationRepository.save(conversation);
  }
}
