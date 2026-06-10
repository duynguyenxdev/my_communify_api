import { Message } from '@/modules/chat/entities/message.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Participant } from './participant.entity';
import { ConversationDto } from '../dtos/conversation.dto';

@Entity('conversations')
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: true })
  name?: string;

  @OneToMany(() => Participant, (participant) => participant.conversation, {
    cascade: true,
  })
  participants!: Participant[];

  @OneToMany(() => Message, (message) => message.conversation)
  messages!: Message[];

  toDto(): ConversationDto {
    return {
      id: this.id,
      name: this.name,
      participants: this.participants.map((e) => ({
        id: e.id,
        fullName: e.user.fullName,
        avatar: e.user.avatar,
      })),
    };
  }
}
