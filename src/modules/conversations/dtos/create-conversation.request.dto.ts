import { ArrayNotEmpty, IsArray, IsUUID } from 'class-validator';

export class CreateConversationRequestDto {
  @ArrayNotEmpty()
  @IsArray()
  @IsUUID('4', { each: true, message: 'Invalid participant id' })
  participantIds!: string[];
}
