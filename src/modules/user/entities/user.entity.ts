import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserResponseDto } from '../dtos/user.response.dto';
import { Message } from '@/modules/chat/entities/message.entity';
import { Participant } from '@/modules/conversations/entities/participant.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'ref_id', nullable: true })
  refId?: string;

  @Column({ name: 'full_name', nullable: true })
  fullName?: string;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  avatar?: string;

  @OneToMany(() => Message, (message) => message.sender)
  messages!: Message[];

  @OneToMany(() => Participant, (participant) => participant.user)
  participants!: Participant[];

  toUserResponseDto(): UserResponseDto {
    return {
      id: this.id,
      fullName: this.fullName,
      email: this.email,
      avatar: this.avatar,
    };
  }
}
